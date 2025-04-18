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

  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const res = await fetch("http://localhost:8000/Vehiculos/");
        const data = await res.json();
        setVehiculos(data);
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
    if (!confirm("¿Estás seguro de desactivar los vehículos seleccionados?"))
      return;

    try {
      await Promise.all(
        seleccionados.map(async (id) => {
          const vehiculo = vehiculos.find((v) => v.vehiculo_id === id);
          await fetch(`http://localhost:8000/Vehiculos/update/${id}/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              activo: false,
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
      console.error("Error al desactivar vehículos:", error);
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

  const listaFiltrada = [...vehiculos]
    .filter((v) =>
      v[campoBusqueda]
        ?.toString()
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      if (!campoOrden) return 0;
      const valA = a[campoOrden];
      const valB = b[campoOrden];
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
          Gestión de Vehículos
        </h1>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link href="/dashboard/vehiculos/nuevo">
          <Button variant="lime">
            Nuevo
          </Button>
        </Link>
        <Button
          variant="green"
          onClick={() => {
            setModoEliminar(!modoEliminar);
            setSeleccionados([]);
          }}
        >
          {modoEliminar ? "Cancelar Eliminación" : "Eliminar"}
        </Button>
        {modoEliminar && (
          <Button
            variant="red"
            onClick={eliminarSeleccionados}
            disabled={seleccionados.length === 0}
          >
            Confirmar Eliminación
          </Button>
        )}
        <Link href="/dashboard/vehiculos/operadores">
          <Button variant="emerald">
            Operadores
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="teal">
            Volver
          </Button>
        </Link>
        <Button
          variant="cyan"
          onClick={() => setModoGaleria(!modoGaleria)}
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
                className="h-32 w-32 object-contain mb-2"
              />
              <h3 className="text-lg font-semibold text-center">{v.placas}</h3>
              <p className="text-sm text-gray-500 text-center">{v.num_serie}</p>
              {!modoEliminar && (
                <Button
                  variant="tealLight"
                  size="small"
                  onClick={() => onModificar(v)}
                >
                  Editar
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
                {modoEliminar && <th className="px-4 py-2"></th>}
                {[
                  { campo: "num_serie", label: "Número de Serie" },
                  { campo: "placas", label: "Placas" },
                  { campo: "operador", label: "Operador" },
                  { campo: "empresa", label: "Empresa" },
                  { campo: "marca", label: "Marca" },
                  { campo: "anio", label: "Año" },
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
                  <td className="px-4 py-2">{v.num_serie}</td>
                  <td className="px-4 py-2 text-center">{v.placas}</td>
                  <td className="px-4 py-2 text-center">{v.operador}</td>
                  <td className="px-4 py-2 text-center">{v.empresa}</td>
                  <td className="px-4 py-2 text-center">{v.marca}</td>
                  <td className="px-4 py-2 text-center">{v.anio}</td>
                  {!modoEliminar && (
                    <td className="px-4 py-2 text-center">
                      <Button
                        variant="tealLight"
                        size="small"
                        onClick={() => onModificar(v)}
                      >
                        Editar
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {listaFiltrada.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          No hay vehículos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}
