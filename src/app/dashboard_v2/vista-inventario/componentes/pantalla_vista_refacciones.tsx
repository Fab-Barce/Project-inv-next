"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import Button from "@/app/components/Button";

type Producto = {
  refaccion_id: number;
  proveedor_id: string;
  numero_parte: string;
  nombre: string;
  cantidad: number;
  stock_minimo: number;
  costo: number;
  categoria_id: string;
  imagen_refa: string;
  empresa_id: string;
  categoria: string;
  proveedor: string;
  empresa: string;
  activo: string;
  marca: string;
  num_unidad: string;
  linas: string;
};


type Vehiculo = {
  vehiculo_id: number;
  placas: string;
  activo: string;
  num_unidad: string;
};

type Props = {
  onModificar: (producto: Producto) => void;
};

export default function Pantalla_refacciones({ onModificar }: Props) {
  const [refacciones, setRefacciones] = useState<Producto[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<keyof Producto | "total">("nombre");
  const [sortField, setSortField] = useState<keyof Producto | "total" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [vistaGaleria, setVistaGaleria] = useState<boolean>(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const fetchRefacciones = async () => {
      try {
        // Obtener refacciones
        const refaccionesResponse = await fetch("http://localhost:8000/Refacciones/");
        const refaccionesData = await refaccionesResponse.json();

        // Mapear refacciones y asociar num_unidad del vehículo correspondiente
        const refaccionesFiltradas = refaccionesData
          .filter((item: any) => item.activo !== "false") // Filtra los inactivos
          .map((item: any) => {
            return {
              refaccion_id: item.refaccion_id || item.id,
              proveedor_id: item.proveedor_id || 0,
              vehiculo_id: item.vehiculo_id || 0,
              numero_parte: item.numero_parte || "N/A",
              nombre: item.nombre || "Sin nombre",
              cantidad: Number(item.cantidad) || 0,
              stock_minimo: Number(item.stock_minimo) || 0,
              costo: Number(item.costo) || 0,
              categoria_id: item.categoria_id || 0,
              imagen_refa: item.imagen_refa || "",
              empresa_id: item.empresa_id || 0,
              categoria: item.categoria || "",
              empresa: item.empresa || "",
              proveedor: item.proveedor || "",
              activo: item.activo || "",
              marca: item.marca || "",
              linas: item.linas || ""
            };
          });

        setRefacciones(refaccionesFiltradas);
      } catch (error) {
        console.error("Error al obtener refacciones o vehículos:", error);
      }
    };

    fetchRefacciones();
}, []);

  const filteredAndSorted = [...refacciones]
    .filter((r) => {
      if (searchField === "total") {
        const total = (r.costo * r.cantidad).toString();
        return total.includes(searchTerm.toLowerCase());
      }
      return r[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      if (sortField === "total") {
        const totalA = a.costo * a.cantidad;
        const totalB = b.costo * b.cantidad;
        return sortDirection === "asc" ? totalA - totalB : totalB - totalA;
      }
      
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });

  const handleSort = (field: keyof Producto | "total") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("Eliminar las refacciones seleccionadas?");
    if (!confirmar) return;

    try {
      await Promise.all(
        selectedItems.map(async (refaccion_id) => {
          const refa = refacciones.find((r) => r.refaccion_id === refaccion_id);

          await fetch(`http://localhost:8000/Refacciones/update/${refaccion_id}/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              activo: 'false',
            }),
          });
        })
      );

      setRefacciones((prev) =>
        prev.filter((r) => !selectedItems.includes(r.refaccion_id))
      );
      setSelectedItems([]);
      setDeleteMode(false);
    } catch (error) {
      console.error("Error al eliminar las refacciones:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Inventario de Refacciones</h1>
      </div>

      {/* Botones */}
      <div className="flex flex-wrap gap-2 mb-4">


        <Link href="/dashboard_v2/vista-inventario/categorias">
          <Button variant="purple">Categorías</Button>
        </Link>
        <Link href="/dashboard_v2/vista-inventario/proveedores">
          <Button variant="yellow">Proveedores</Button>
        </Link>

        <Link href="/dashboard_v2/">
          <Button variant="blue">Volver</Button>
        </Link>
        <Button 
          variant="sky"
          onClick={() => setVistaGaleria(!vistaGaleria)}
          className="ml-auto"
        >
          {vistaGaleria ? "Vista Galería" : "Vista Tabla"}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-4 shadow-md rounded mb-4">
        <select
          value={searchField}
          onChange={(e) =>
            setSearchField(e.target.value as keyof Producto | "total")
          }
          className="p-2 border rounded"
        >
          <option value="numero_parte">Número de Parte</option>
          <option value="linas">Asignación</option> {/* <-- Añadido */}
          <option value="nombre">Nombre</option>
          <option value="proveedor">Proveedor</option>
          <option value="marca">Marca</option> {/* <-- Añadido */}
          <option value="cantidad">Cantidad</option>
          <option value="stock_minimo">Stock Mínimo</option>
          <option value="costo">Costo</option>
          <option value="total">Total</option>
        </select>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-1"
        />
      </div>

      {/* Vista Tabla */}
      {!vistaGaleria ? (
        <div className="bg-white rounded shadow-md overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                {deleteMode && <th className="px-4 py-2 text-center"></th>}
                {[
                  { key: "numero_parte", label: "Número de Parte" },
                  { key: "linas", label: "Asignación" }, // Nueva columna
                  { key: "nombre", label: "Nombre" },
                  { key: "proveedor", label: "Proveedor" },
                  { key: "marca", label: "Marca" },
                  { key: "cantidad", label: "Cantidad" },
                  { key: "stock_minimo", label: "Stock Mínimo" },
                  { key: "costo", label: "Costo" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof Producto)}
                    className="px-4 py-2 cursor-pointer select-none text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      {label}
                      {sortField === key ? (
                        sortDirection === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4 text-gray-600" />
                        )
                      ) : (
                        <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
                <th 
                  className="px-4 py-2 text-center cursor-pointer select-none"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex justify-center items-center gap-1">
                    Total
                    {sortField === "total" ? (
                      sortDirection === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-gray-600" />
                      )
                    ) : (
                      <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </th>
                {!deleteMode && <th className="px-4 py-2 text-center">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((refa) => (
                <tr key={refa.refaccion_id} className="border-t hover:bg-gray-50">
                  {deleteMode && (
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(refa.refaccion_id)}
                        onChange={() => handleSelect(refa.refaccion_id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-2 text-center">{refa.numero_parte}</td>
                  <td className="px-4 py-2 text-center">{refa.linas}</td> 
                  <td className="px-4 py-2 text-center relative">
                    <span
                      className="cursor-pointer"
                      onClick={() => setExpandedImage(refa.imagen_refa || "/placeholder.png")}

                      onMouseEnter={(e) => {
                        const timeout = setTimeout(() => {
                          setHoveredImage(refa.imagen_refa || "/placeholder.png");
                          setTooltipPosition({ x: e.clientX, y: e.clientY });
                        }, 300); // Retraso de 300ms antes de mostrar la imagen
                        setHoverTimeout(timeout);
                      }}
                      onMouseMove={(e) => {
                        if (hoveredImage) {
                          setTooltipPosition({ x: e.clientX, y: e.clientY });
                        }
                      }}
                      onMouseLeave={() => {
                        if (hoverTimeout) {
                          clearTimeout(hoverTimeout); // Limpiar el temporizador si el cursor sale antes de que se muestre la imagen
                        }
                        setHoveredImage(null);
                        setTooltipPosition(null);
                      }}
                    >
                      {refa.nombre}
                    </span>
                    {hoveredImage === refa.imagen_refa && tooltipPosition && (
                      <div
                        className="fixed bg-white border rounded shadow-lg p-2 z-50"
                        style={{
                          top: tooltipPosition.y + 10, // Posicionar ligeramente debajo del cursor
                          left: tooltipPosition.x + 10, // Posicionar ligeramente a la derecha del cursor
                        }}
                      >
                        <img
                          src={hoveredImage}
                          alt={refa.nombre}
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                    )}
                  </td>



                  <td className="px-4 py-2 text-center">{refa.proveedor}</td>
                  <td className="px-4 py-2 text-center">{refa.marca}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`font-semibold ${
                      refa.cantidad > refa.stock_minimo 
                        ? 'text-green-600' 
                        : refa.cantidad === refa.stock_minimo 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {refa.cantidad}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{refa.stock_minimo}</td>
                  <td className="px-4 py-2 text-center">${refa.costo.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    ${(refa.costo * refa.cantidad).toFixed(2)}
                  </td>
                  {!deleteMode && (
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center">
                        <Button
                          variant="blue"
                          size="small"
                          onClick={() => onModificar(refa)}
                        >
                          Detalles
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Vista Galería
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded shadow-md">
          {filteredAndSorted.map((refa) => (
            <div
              key={refa.refaccion_id}
              className="border rounded shadow hover:shadow-md transition duration-200 p-4 flex flex-col items-center"
            >
              <img
                src={refa.imagen_refa || "/placeholder.png"}
                alt={refa.nombre}
                className="h-32 w-32 object-contain mb-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-md cursor-pointer"
                onClick={() => setExpandedImage(refa.imagen_refa || "/placeholder.png")}
              />
              <h3 className="text-lg font-semibold text-center">{refa.nombre}</h3>
              <p className="text-sm text-gray-600 text-center">{refa.linas}</p>
              {!deleteMode && (
                <Button
                  variant="blue"
                  size="small"
                  onClick={() => onModificar(refa)}
                >
                  Detalles
                </Button>
              )}
              {deleteMode && (
                <div className="mt-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(refa.refaccion_id)}
                    onChange={() => handleSelect(refa.refaccion_id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredAndSorted.length === 0 && (
        <div className="mt-4 text-center text-gray-500">No hay refacciones que coincidan.</div>
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
              onClick={() => setExpandedImage(null)}
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
