"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon
} from "@heroicons/react/24/solid";

type Categoria = {
  categoria_id: number;
  nombre: string;
  descripcion: string;
};

type Props = {
  onModificar: (categoria: Categoria) => void;
};

export default function PantallaCategoria({ onModificar }: Props) {
  const [categorias, setCategoria] = useState<Categoria[]>([]);
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Variable de estado para la búsqueda
  const [filterKey, setFilterKey] = useState<keyof Categoria>("nombre"); // Estado para almacenar el filtro seleccionado
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Categoria | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    axios.get("http://localhost:8000/Categorias/").then((response) => {
      setCategoria(response.data);
      setFilteredCategorias(response.data); // Inicializamos las categorías filtradas
    });
  }, []);

  useEffect(() => {
    // Filtrar categorías según el campo de búsqueda y el filtro seleccionado
    setFilteredCategorias(
      categorias.filter((categoria) =>
        categoria[filterKey]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, categorias, filterKey]); // Filtrar cuando cambien las categorías, la búsqueda o el filtro

  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm(
      "¿Estás seguro de eliminar las categorías seleccionadas?"
    );
    if (confirmar) {
      for (var i = 0; i < selectedItems.length; i += 1) {
        axios
          .delete(`http://localhost:8000/Categorias/delete/${selectedItems[i]}/`)
          .then((res) => {
            console.log(res);
            console.log(res.data);
          });
      }
      setCategoria(categorias.filter((v) => !selectedItems.includes(v.categoria_id)));
      setSelectedItems([]);
      setDeleteMode(false);
    }
  };

  const handleSort = (key: keyof Categoria) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Categoria) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowsUpDownIcon className="w-4 h-4 inline-block ml-1 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="w-4 h-4 inline-block ml-1 text-blue-500" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 inline-block ml-1 text-blue-500" />
    );
  };

  const sortedCategorias = [...filteredCategorias].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título principal */}
      <h1 className="text-2xl font-bold text-black mb-6">Gestión de Categorías</h1>

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 shadow-md rounded-lg">
        <Link href="/dashboard/inventario/categorias/nuevo">
          <button className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition duration-200">
            Nuevo
          </button>
        </Link>

        <button
          onClick={() => {
            setDeleteMode(!deleteMode);
            setSelectedItems([]);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
        >
          {deleteMode ? "Cancelar Eliminación" : "Eliminar"}
        </button>

        {deleteMode && (
          <button
            onClick={handleBulkDelete}
            disabled={selectedItems.length === 0}
            className={`${
              selectedItems.length === 0
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } text-white font-semibold px-4 py-2 rounded transition duration-200`}
          >
            Confirmar Eliminación
          </button>
        )}

        <Link href="/dashboard/inventario">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition duration-200">
            Volver
          </button>
        </Link>

        {/* Filtro */}
        <div className="ml-auto flex items-center gap-2 border rounded px-3 py-1 bg-white shadow-sm">
          <select
            value={filterKey}
            onChange={(e) => setFilterKey(e.target.value as keyof Categoria)}
            className="outline-none bg-transparent text-black"
          >
            <option value="nombre">Nombre</option>
            <option value="descripcion">Descripción</option>
          </select>
        </div>

        {/* Buscador */}
        <div className="ml-3 flex items-center gap-2 border rounded px-3 py-1 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Buscar..."
            className="outline-none bg-transparent text-black placeholder-gray-500"
            value={searchQuery} // Enlazamos el valor con el estado
            onChange={(e) => setSearchQuery(e.target.value)} // Actualizamos el estado con el texto de búsqueda
          />
          <span>🔍</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-200 text-gray-700 font-semibold">
            <tr>
              {deleteMode && <th className="px-4 py-3 text-center">✓</th>}
              <th
                onClick={() => handleSort("nombre")}
                className="px-4 py-3 text-left cursor-pointer select-none"
              >
                Nombre {getSortIcon("nombre")}
              </th>
              <th
                onClick={() => handleSort("descripcion")}
                className="px-4 py-3 text-left cursor-pointer select-none"
              >
                Descripción {getSortIcon("descripcion")}
              </th>
              {!deleteMode && <th className="px-4 py-3 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sortedCategorias.map((categoria) => (
              <tr
                key={categoria.categoria_id}
                className="border-b hover:bg-gray-100"
              >
                {deleteMode && (
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(categoria.categoria_id)}
                      onChange={() => handleSelect(categoria.categoria_id)}
                    />
                  </td>
                )}
                <td className="px-4 py-3">{categoria.nombre}</td>
                <td className="px-4 py-3">{categoria.descripcion}</td>
                {!deleteMode && (
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onModificar(categoria)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
