"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";

type Operador = {
  operador_id: number;
  nombre: string;
  // unidad: string;
  empresa: string;
};

type Props = {
  onModificar: (operador: Operador) => void;
};

export default function PantallaOperador({ onModificar }: Props) {
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Estados para filtros y ordenación
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<keyof Operador>("nombre");
  const [sortField, setSortField] = useState<keyof Operador | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    axios.get("http://localhost:8000/Operadores/")
      .then(response => {
        setOperadores(response.data);
      })
      .catch(error => {
        console.error("Error al obtener operadores:", error);
      });
  }, []);

  // Seleccionar o deseleccionar un operador para eliminación
  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Eliminación en lote de los operadores seleccionados
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("¿Estás seguro de eliminar los operadores seleccionados?");
    if (confirmar) {
      selectedItems.forEach((id) => {
        axios.delete(`http://localhost:8000/Operadores/delete/${id}/`)
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.error("Error al eliminar operador:", error);
          });
      });
      setOperadores(operadores.filter((v) => !selectedItems.includes(v.operador_id)));
      setSelectedItems([]);
      setDeleteMode(false);
    }
  };

  // Función de ordenación
  const handleSort = (campo: keyof Operador) => {
    if (sortField === campo) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(campo);
      setSortDirection("asc");
    }
  };

  // Filtrar y ordenar operadores
  const operadoresFiltradosOrdenados = [...operadores]
    .filter((o) =>
      o[searchField]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valorA = a[sortField];
      const valorB = b[sortField];
      if (typeof valorA === "number" && typeof valorB === "number") {
        return sortDirection === "asc" ? valorA - valorB : valorB - valorA;
      }
      return sortDirection === "asc"
        ? valorA.toString().localeCompare(valorB.toString())
        : valorB.toString().localeCompare(valorA.toString());
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título */}
      <h1 className="text-xl text-black font-bold mb-4">Operadores</h1>

      {/* Área de botones y filtros */}
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 shadow rounded-lg">
       
        <Link href="/dashboard_v2/vista-vehiculos">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Volver
          </button>
        </Link>
        {/* Filtros: Seleccionar campo de búsqueda e input */}
        <div className="flex ml-auto gap-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as keyof Operador)}
            className="p-2 border rounded"
          >
            <option value="nombre">Nombre</option>
            <option value="empresa">Empresa</option>
          </select>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Tabla de operadores */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {deleteMode && <th className="px-4 py-2"></th>}
              <th
                className="px-4 py-2 text-left cursor-pointer select-none"
                onClick={() => handleSort("nombre")}
              >
                <div className="flex items-center gap-1">
                  Nombre
                  {sortField === "nombre" ? (
                    sortDirection === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )
                  ) : (
                    <ArrowsUpDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-4 py-2 text-left">Unidad</th>
              <th
                className="px-4 py-2 text-left cursor-pointer select-none"
                onClick={() => handleSort("empresa")}
              >
                <div className="flex items-center gap-1">
                  Empresa
                  {sortField === "empresa" ? (
                    sortDirection === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )
                  ) : (
                    <ArrowsUpDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              {!deleteMode && (
                <th className="px-4 py-2 text-center">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {operadoresFiltradosOrdenados.map((operador) => (
              <tr key={operador.operador_id} className="border-b hover:bg-gray-50">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(operador.operador_id)}
                      onChange={() => handleSelect(operador.operador_id)}
                    />
                  </td>
                )}
                <td className="px-4 py-2">
                  <button
                    onClick={() => onModificar(operador)}
                    className="text-blue-600 hover:underline"
                  >
                    {operador.nombre}
                  </button>
                </td>
                <td className="px-4 py-2">NA</td>
                <td className="px-4 py-2">{operador.empresa}</td>
                {!deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => onModificar(operador)}
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

      {operadores.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          No hay operadores registrados.
        </div>
      )}
    </div>
  );
}
