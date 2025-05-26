"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import Button from "@/app/components/Button";

type Vehiculo = {
  vehiculo_id: number;
  num_serie: string;
  placas: string;
  operador_id: number;
  imagen_vehi: string;
  anio: number;
  empresa_id: number;
  marca: string;
  empresa: string;
  operador: string;
  activo: string;
  num_unidad: string;
  linea: string;
};

type Props = {
  onModificar: (vehiculo: Vehiculo) => void;
};

export default function PantallaVehiculos({ onModificar }: Props) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [modoGaleria, setModoGaleria] = useState<boolean>(false);
  const [modoEliminar, setModoEliminar] = useState<boolean>(false);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [campoBusqueda, setCampoBusqueda] = useState<keyof Vehiculo>("placas");
  const [campoOrden, setCampoOrden] = useState<keyof Vehiculo | null>(null);
  const [direccionOrden, setDireccionOrden] = useState<"asc" | "desc">("asc");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const res = await fetch("http://localhost:8000/Vehiculos/");
        const data = await res.json();
        const vehiculosActivos = data.filter((cat: any) => cat.activo !== "false");
        setVehiculos(vehiculosActivos);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };
    obtenerVehiculos();
  }, []);

  const toggleSeleccion = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    if (!confirm("¿Estás seguro de eliminar los vehículos seleccionados?"))
      return;

    try {
      await Promise.all(
        seleccionados.map(async (id) => {
          const vehiculo = vehiculos.find((v) => v.vehiculo_id === id);
          await fetch(`http://localhost:8000/Vehiculos/delete/${id}/`, {
            method: "DELETE",
          });
          await fetch("http://localhost:8000/Movimientos/create/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo_movimiento: "eliminacion",
              user_id: localStorage.getItem("user_id"),
              nombre: vehiculo?.placas || "Desconocido",
            }),
          });
        })
      );
      setVehiculos((prev) =>
        prev.filter((v) => !seleccionados.includes(v.vehiculo_id))
      );
      setSeleccionados([]);
      setModoEliminar(false);
    } catch (error) {
      console.error("Error al eliminar vehículos:", error);
    }
  };

  const ordenarPor = (campo: keyof Vehiculo) => {
    if (campoOrden === campo) {
      setDireccionOrden(direccionOrden === "asc" ? "desc" : "asc");
    } else {
      setCampoOrden(campo);
      setDireccionOrden("asc");
    }
  };

  const extraerNumero = (str: string) => {
    const matches = str.match(/\d+/);
    return matches ? parseInt(matches[0]) : 0;
  };

  // Función para ordenamiento natural
  const compararNatural = (a: string, b: string) => {
    const regex = /(\d+|\D+)/g;
    const partesA = a.match(regex) || [];
    const partesB = b.match(regex) || [];

    for (let i = 0; i < Math.max(partesA.length, partesB.length); i++) {
      const parteA = partesA[i] || "";
      const parteB = partesB[i] || "";

      // Comparar como números si ambas partes son numéricas
      const numA = parseInt(parteA, 10);
      const numB = parseInt(parteB, 10);

      if (!isNaN(numA) && !isNaN(numB)) {
        if (numA !== numB) return numA - numB;
      } else if (parteA !== parteB) {
        // Comparar como cadenas si no son numéricas
        return parteA.localeCompare(parteB);
      }
    }

    return 0;
  };

  // Actualizar la lógica de ordenamiento
  const listaFiltrada = [...vehiculos]
    .filter((v) => {
      if (campoBusqueda === "num_unidad") {
        const busquedaNormalizada = busqueda.toLowerCase().replace(/\s+/g, "");
        const valorNormalizado =
          v[campoBusqueda]?.toString().toLowerCase().replace(/\s+/g, "") || "";
        return valorNormalizado.includes(busquedaNormalizada);
      } else {
        return v[campoBusqueda]
          ?.toString()
          .toLowerCase()
          .includes(busqueda.toLowerCase());
      }
    })
    .sort((a, b) => {
      if (!campoOrden) return 0;

      const valA = a[campoOrden];
      const valB = b[campoOrden];

      if (campoOrden === "num_serie") {
        // Usar ordenamiento natural para num_serie
        return direccionOrden === "asc"
          ? compararNatural(valA?.toString() || "", valB?.toString() || "")
          : compararNatural(valB?.toString() || "", valA?.toString() || "");
      }

      if (campoOrden === "num_unidad") {
        const numA = extraerNumero(valA?.toString() || "0");
        const numB = extraerNumero(valB?.toString() || "0");
        return direccionOrden === "asc" ? numA - numB : numB - numA;
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return direccionOrden === "asc" ? valA - valB : valB - valA;
      }

      return direccionOrden === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">
            Vista de Vehículos
        </h1>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 mb-4">
       
        <Link href="/dashboard_v2/vista-vehiculos/operadores">
          <Button variant="orange">
            Operadores
          </Button>
        </Link>
        <Link href="/dashboard_v2">
          <Button variant="blue">
            Volver
          </Button>
        </Link>
        <Button
          onClick={() => setModoGaleria(!modoGaleria)}
          variant="sky"
          className="ml-auto"
        >
          {modoGaleria ? "Ver como tabla" : "Ver como galería"}
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="bg-white p-4 rounded shadow flex gap-2 items-center mb-4">
        <select
          value={campoBusqueda}
          onChange={(e) =>
            setCampoBusqueda(e.target.value as keyof Vehiculo)
          }
          className="p-2 border rounded"
        >
          <option value="num_unidad">Número de Unidad</option>
          <option value="num_serie">Número de Serie</option>
          <option value="placas">Placas</option>
          <option value="empresa">Empresa</option>
          <option value="operador">Operador</option>
        </select>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar..."
          className="p-2 border rounded flex-1"
        />
      </div>

      {/* Vista: Galería o Tabla */}
      {modoGaleria ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow-md">
          {listaFiltrada.map((v) => (
            <div
              key={v.vehiculo_id}
              className="border rounded shadow hover:shadow-md transition duration-200 p-4 flex flex-col items-center"
            >
              <img
                src={v.imagen_vehi || "/placeholder.png"}
                alt={v.num_serie}
                className="h-32 w-32 object-contain mb-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-md cursor-pointer"
                onClick={() => setExpandedImage(v.imagen_vehi || "/placeholder.png")}
              />
              <h3 className="text-lg font-semibold text-center">{v.num_unidad}</h3>
              <p className="text-sm text-gray-900 text-center">{v.placas}</p>
              {!modoEliminar && (
                <Button
                  onClick={() => onModificar(v)}
                  variant="blue"
                  size="small"
                                  >
                Detalles
                </Button>
              )}
              {modoEliminar && (
                <div className="mt-2">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(v.vehiculo_id)}
                    onChange={() => toggleSeleccion(v.vehiculo_id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                {modoEliminar && <th className="px-4 py-2 text-center"></th>}
                {[
                  { campo: "num_unidad", label: "Número de Unidad" },
                  { campo: "operador", label: "Operador" },
                  { campo: "num_serie", label: "Número de Motor" },
                  { campo: "placas", label: "Placas" },
                  { campo: "empresa", label: "Empresa" },
                  { campo: "marca", label: "Marca" },
                  { campo: "anio", label: "Modelo" },
                ].map(({ campo, label }) => (
                  <th
                    key={campo}
                    onClick={() => ordenarPor(campo as keyof Vehiculo)}
                    className="px-4 py-2 text-center cursor-pointer select-none"
                  >
                    <div className="flex justify-center items-center gap-1">
                      {label}
                      {campoOrden === campo ? (
                        direccionOrden === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowsUpDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
                {!modoEliminar && (
                  <th className="px-4 py-2 text-center">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((v) => (
                <tr key={v.vehiculo_id} className="border-t hover:bg-gray-50">
                  {modoEliminar && (
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(v.vehiculo_id)}
                        onChange={() => toggleSeleccion(v.vehiculo_id)}
                      />
                    </td>
                  )}
                  {/* Tooltip de imagen en número de unidad */}
                  <td className="px-4 py-2 text-center relative">
                    <span
                      className="cursor-pointer"
                      onClick={() => setExpandedImage(v.imagen_vehi || "/placeholder.png")}
                      onMouseEnter={e => {
                        const timeout = setTimeout(() => {
                          setHoveredImage(v.imagen_vehi || "/placeholder.png");
                          setTooltipPosition({ x: e.clientX, y: e.clientY });
                        }, 300);
                        setHoverTimeout(timeout);
                      }}
                      onMouseMove={e => {
                        if (hoveredImage) {
                          setTooltipPosition({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseLeave={() => {
                        if (hoverTimeout) clearTimeout(hoverTimeout);
                        setHoveredImage(null);
                        setTooltipPosition(null);
                      }}
                    >
                      {v.num_unidad}
                    </span>
                    {hoveredImage === (v.imagen_vehi || "/placeholder.png") && tooltipPosition && (
                      <div
                        className="fixed bg-white border rounded shadow-lg p-2 z-50"
                        style={{
                          top: tooltipPosition.y + 10,
                          left: tooltipPosition.x + 10,
                        }}
                      >
                        <img
                          src={hoveredImage}
                          alt={v.num_unidad}
                          className="h-20 w-auto object-contain"
                          onError={e => (e.currentTarget.src = "/placeholder.png")}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">{v.operador}</td>
                  <td className="px-4 py-2 text-center">{v.num_serie}</td>
                  <td className="px-4 py-2 text-center">{v.placas}</td>
                  <td className="px-4 py-2 text-center">{v.empresa}</td>
                  <td className="px-4 py-2 text-center">{v.marca}</td>
                  <td className="px-4 py-2 text-center">{v.anio}</td>
                  {!modoEliminar && (
                    <td className="px-4 py-2 text-center">
                      <Button
                        onClick={() => onModificar(v)}
                        variant="blue"
                        size="small"
                      >
                        Detalles
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Tooltip global para fallback */}
          {hoveredImage && tooltipPosition && (
            <div
              className="fixed bg-white border rounded shadow-lg p-2 z-50 pointer-events-none"
              style={{
                top: tooltipPosition.y + 10,
                left: tooltipPosition.x + 10,
              }}
            >
              <img
                src={hoveredImage}
                alt="Vista previa"
                className="h-20 w-auto object-contain"
                onError={e => (e.currentTarget.src = "/placeholder.png")}
              />
            </div>
          )}
        </div>
      )}

      {listaFiltrada.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          No hay vehículos que coincidan con la búsqueda.
        </div>
      )}

      {/* Modal para imagen expandida */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl w-full p-4">
            <button 
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }}
            >
              ×
            </button>
            <img 
              src={expandedImage} 
              alt="Imagen expandida" 
              className="max-h-[80vh] w-auto mx-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
