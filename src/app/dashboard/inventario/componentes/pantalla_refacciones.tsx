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
};

type Props = {
  onModificar: (producto: Producto) => void;
};

// Estilo base para todos los botones
const buttonBaseStyle = "text-white px-4 py-2 rounded-md font-semibold shadow-sm shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1";

const buttonBaseStyle2 = "text-white px-3 py-1 rounded-md font-semibold shadow-sm shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1";

// Objeto con variantes de colores para los botones
const buttonVariants = {
  lime: `bg-lime-500 hover:bg-lime-600 ${buttonBaseStyle}`,
  green: `bg-green-500 hover:bg-green-600 ${buttonBaseStyle}`,
  emerald: `bg-emerald-500 hover:bg-emerald-600 ${buttonBaseStyle}`,
  teal: `bg-teal-500 hover:bg-teal-600 ${buttonBaseStyle}`,
  orange: `bg-orange-500 hover:bg-orange-600 ${buttonBaseStyle}`,
  cyan: `bg-cyan-500 hover:bg-cyan-600 ${buttonBaseStyle}`,
  sky: `bg-sky-500 hover:bg-sky-600 ${buttonBaseStyle}`,
  tealLight: `bg-teal-400 hover:bg-teal-600 ${buttonBaseStyle2}`,
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
        const refaccionesFiltradas = data.map((item: any) => ({
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
              activo: false,
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
        <Link href="/dashboard/inventario/nuevo">
          <Button variant="lime">Nuevo</Button>
        </Link>
        <Link href="/dashboard/inventario/categorias">
          <Button variant="green">Categorías</Button>
        </Link>
        <Link href="/dashboard/inventario/proveedores">
          <Button variant="emerald">Proveedores</Button>
        </Link>
        <Button
          variant="teal"
          onClick={() => {
            setDeleteMode(!deleteMode);
            setSelectedItems([]);
          }}
        >
          {deleteMode ? "Cancelar Eliminación" : "Eliminar Refacción"}
        </Button>
        {deleteMode && (
          <Button
            variant="orange"
            onClick={handleBulkDelete}
            disabled={selectedItems.length === 0}
          >
            Confirmar Eliminación
          </Button>
        )}
        <Button
          variant="cyan"
          onClick={() => setVistaGaleria(!vistaGaleria)}
        >
          {vistaGaleria ? "Vista Tabla" : "Vista Galería"}
        </Button>
        <Link href="/dashboard">
          <Button variant="sky">Volver</Button>
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
                      <div className="flex justify-center">
                        <label className="flex items-center space-x-2 cursor-pointer bg-gray-100 p-2 rounded-md hover:bg-gray-200">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(refa.refaccion_id)}
                            onChange={() => handleSelect(refa.refaccion_id)}
                            className="w-5 h-5 cursor-pointer"
                          />     
                        </label>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-2">{refa.numero_parte}</td>
                  <td className="px-4 py-2">{refa.nombre}</td>
                  <td className="px-4 py-2 text-center">{refa.cantidad}</td>
                  <td className="px-4 py-2 text-center">{refa.stock_minimo}</td>
                  <td className="px-4 py-2 text-center">${refa.costo.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">${(refa.costo * refa.cantidad).toFixed(2)}</td>
                  {!deleteMode && (
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center">
                        <Button
                          variant="tealLight"
                          size="small"
                          onClick={() => onModificar(refa)}
                        >
                          Editar
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
                className="h-32 w-32 object-contain mb-2"
              />
              <h3 className="text-lg font-semibold text-center">{refa.nombre}</h3>
              <p className="text-sm text-gray-600 text-center">{refa.numero_parte}</p>
              {!deleteMode && (
                <div className="mt-2">
                  <Button
                    variant="tealLight"
                    size="small"
                    onClick={() => onModificar(refa)}
                  >
                    Editar
                  </Button>
                </div>
              )}
              {deleteMode && (
                <div className="mt-2 flex justify-center">
                  <label className="flex items-center space-x-2 cursor-pointer bg-gray-100 p-2 rounded-md hover:bg-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(refa.refaccion_id)}
                      onChange={() => handleSelect(refa.refaccion_id)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    
                  </label>
                </div>
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
