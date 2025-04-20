"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";

type Producto = {
  refaccion_id: number;
  proveedor_id: string;
  vehiculo_id: string;
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
};

type Props = {
  onModificar: (producto: Producto) => void;
};

export default function Pantalla_refacciones({ onModificar }: Props) {
  const [refacciones, setRefacciones] = useState<Producto[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<keyof Producto>("nombre");
  const [sortField, setSortField] = useState<keyof Producto | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [vistaGaleria, setVistaGaleria] = useState<boolean>(false);

  useEffect(() => {
    const fetchRefacciones = async () => {
      try {
        const response = await fetch("http://localhost:8000/Refacciones/");
        const data = await response.json();
  
        const refaccionesFiltradas = data
          .filter((item: any) => item.activo !== 'false') // Filtra los inactivos
          .map((item: any) => ({
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
          }));
  
        setRefacciones(refaccionesFiltradas);
      } catch (error) {
        console.error("Error al obtener refacciones:", error);
      }
    };
  
    fetchRefacciones();
  }, []);
  

  const filteredAndSorted = [...refacciones]
    .filter((r) =>
      r[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });

  const handleSort = (field: keyof Producto) => {
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
    const confirmar = confirm("¿Eliminar las refacciones seleccionadas?");
    if (!confirmar) return;

    try {
      await Promise.all(
        selectedItems.map(async (refaccion_id) => {
          const refa = refacciones.find((r) => r.refaccion_id === refaccion_id);

          await fetch(`http://localhost:8000/Refacciones/delete/${refaccion_id}/`, {
            method: "DELETE",
          });

          await fetch("http://localhost:8000/Movimientos/create/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo_movimiento: "eliminacion",
              user_id: localStorage.getItem("user_id"),
              nombre: refa?.nombre || "Desconocido",
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
      console.error("Error al eliminar refacciones:", error);
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
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Categorías</button>
        </Link>
        <Link href="/dashboard_v2/vista-inventario/proveedores">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Proveedores</button>
        </Link>

        <button
          onClick={() => setVistaGaleria(!vistaGaleria)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          {vistaGaleria ? "Vista Tabla" : "Vista Galería"}
        </button>
        <Link href="/dashboard_v2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Volver</button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-4 shadow-md rounded mb-4">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as keyof Producto)}
          className="p-2 border rounded"
        >
          <option value="nombre">Nombre</option>
          <option value="numero_parte">Número de Parte</option>
          <option value="proveedor">Proveedor</option>
          <option value="categoria">Categoría</option>
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
                {deleteMode && <th className="px-4 py-2"></th>}
                {[
                  { key: "numero_parte", label: "Número de Parte" },
                  { key: "nombre", label: "Nombre" },
                  { key: "cantidad", label: "Cantidad" },
                  { key: "stock_minimo", label: "Stock Mínimo" },
                  { key: "costo", label: "Costo" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof Producto)}
                    className="px-4 py-2 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
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
                <th className="px-4 py-2">Total</th>
                {!deleteMode && <th className="px-4 py-2">Acciones</th>}
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
                  <td className="px-4 py-2">{refa.numero_parte}</td>
                  <td className="px-4 py-2">{refa.nombre}</td>
                  <td className="px-4 py-2 text-center">{refa.cantidad}</td>
                  <td className="px-4 py-2 text-center">{refa.stock_minimo}</td>
                  <td className="px-4 py-2 text-center">${refa.costo.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    ${(refa.costo * refa.cantidad).toFixed(2)}
                  </td>
                  {!deleteMode && (
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => onModificar(refa)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Detalles
                      </button>
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
                className="h-32 w-32 object-contain mb-2"
              />
              <h3 className="text-lg font-semibold text-center">{refa.nombre}</h3>
              <p className="text-sm text-gray-600 text-center">{refa.numero_parte}</p>
              {!deleteMode && (
                <button
                  onClick={() => onModificar(refa)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Detalles
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredAndSorted.length === 0 && (
        <div className="mt-4 text-center text-gray-500">No hay refacciones que coincidan.</div>
      )}
    </div>
  );
}
