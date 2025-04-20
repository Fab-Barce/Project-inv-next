"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon
} from "@heroicons/react/24/solid";
import Button from "@/app/components/Button";

type Proveedor = {
  proveedor_id: number;
  nombre: string;
  direccion: string;
  RFC: string;
  nombre_representante: string;
  descripcion: string;
  num_telef: string;
  activo: string;
};

type Props = {
  onModificar: (proveedor: Proveedor) => void;
};

export default function PantallaProveedor({ onModificar }: Props) {
  const [proveedores, setProveedor] = useState<Proveedor[]>([]);
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Variable de estado para la búsqueda
  const [filterKey, setFilterKey] = useState<keyof Proveedor>("nombre"); // Estado para almacenar el filtro seleccionado
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Proveedor | null;
    direction: "asc" | "desc";
  }>( {
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    axios.get("http://localhost:8000/Proveedores/").then((response) => {
      const proveedoresActivos = response.data.filter((cat: any) => cat.activo !== "false");
      setProveedor(proveedoresActivos);
      setFilteredProveedores(proveedoresActivos); // Inicializamos los proveedores filtrados
    });
  }, []);

  useEffect(() => {
    // Filtrar proveedores según el campo de búsqueda y el filtro seleccionado
    setFilteredProveedores(
      proveedores.filter((proveedor) =>
        proveedor[filterKey]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, proveedores, filterKey]); // Filtrar cuando cambien los proveedores, la búsqueda o el filtro

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
      "¿Estás seguro de eliminar los proveedores seleccionados?"
    );
    if (confirmar) {
      // Usamos Promise.all para esperar a que terminen todas las peticiones
      Promise.all(
        selectedItems.map((id) =>
          axios.patch(`http://localhost:8000/Proveedores/update/${id}/`, {
            activo: "false",
          })
        )
      )
        .then(() => {
          setProveedor((prevProveedores) =>
            prevProveedores.filter((v) => !selectedItems.includes(v.proveedor_id))
          );
          setSelectedItems([]);
          setDeleteMode(false);
          alert("Proveedores desactivadas correctamente.");
        })
        .catch((error) => {
          console.error("Error al desactivar proveedores:", error);
          alert("Hubo un error al desactivar los proveedores.");
        });
    }
  };

  const handleSort = (key: keyof Proveedor) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Proveedor) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowsUpDownIcon className="w-4 h-4 inline-block ml-1 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="w-4 h-4 inline-block ml-1 text-blue-500" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 inline-block ml-1 text-blue-500" />
    );
  };

  const sortedProveedores = [...filteredProveedores].sort((a, b) => {
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
      <h1 className="text-2xl font-bold text-black mb-6">Gestión de Proveedores</h1>

      {/* Barra de acciones */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 shadow-md rounded-lg">
        <Link href="/dashboard/inventario/proveedores/nuevo">
          <Button variant="lime">
            Nuevo
          </Button>
        </Link>

        <Button
          variant="green"
          onClick={() => {
            setDeleteMode(!deleteMode);
            setSelectedItems([]);
          }}
        >
          {deleteMode ? "Cancelar Eliminación" : "Eliminar"}
        </Button>

        {deleteMode && (
          <Button
            variant="red"
            onClick={handleBulkDelete}
            disabled={selectedItems.length === 0}
            className={selectedItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
          >
            Confirmar Eliminación
          </Button>
        )}

        <Link href="/dashboard/inventario">
          <Button variant="emerald">
            Volver
          </Button>
        </Link>

        {/* Filtro */}
        <div className="ml-auto flex items-center gap-2 border rounded px-3 py-1 bg-white shadow-sm">
          <select
            value={filterKey}
            onChange={(e) => setFilterKey(e.target.value as keyof Proveedor)}
            className="outline-none bg-transparent text-black"
          >
            <option value="nombre">Nombre</option>
            <option value="RFC">RFC</option>
            <option value="direccion">Dirección</option>
            <option value="nombre_representante">Representante</option>
            <option value="descripcion">Descripción</option>
            <option value="num_telef">Teléfono</option>
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
                onClick={() => handleSort("RFC")}
                className="px-4 py-3 text-left cursor-pointer select-none"
              >
                RFC {getSortIcon("RFC")}
              </th>
              <th
                onClick={() => handleSort("nombre_representante")}
                className="px-4 py-3 text-left cursor-pointer select-none"
              >
                Representante {getSortIcon("nombre_representante")}
              </th>
              <th
                onClick={() => handleSort("direccion")}
                className="px-4 py-3 text-left cursor-pointer select-none"
              >
                Dirección {getSortIcon("direccion")}
              </th>
              <th
                onClick={() => handleSort("descripcion")}
                className="px-4 py-3 text-left cursor-pointer select-none"
              >
                Descripción {getSortIcon("descripcion")}
              </th>
              <th
                onClick={() => handleSort("num_telef")}
                className="px-4 py-3 text-left cursor-pointer select-none"
              >
                Teléfono {getSortIcon("num_telef")}
              </th>
              {!deleteMode && <th className="px-4 py-3 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sortedProveedores.map((proveedor) => (
              <tr
                key={proveedor.proveedor_id}
                className="border-b hover:bg-gray-100"
              >
                {deleteMode && (
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(proveedor.proveedor_id)}
                      onChange={() => handleSelect(proveedor.proveedor_id)}
                    />
                  </td>
                )}
                <td className="px-4 py-3">{proveedor.nombre}</td>
                <td className="px-4 py-3">{proveedor.RFC}</td>
                <td className="px-4 py-3">{proveedor.nombre_representante}</td>
                <td className="px-4 py-3">{proveedor.direccion}</td>
                <td className="px-4 py-3">{proveedor.descripcion}</td>
                <td className="px-4 py-3">{proveedor.num_telef}</td>
                {!deleteMode && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <Button
                        variant="tealLight"
                        size="small"
                        onClick={() => onModificar(proveedor)}
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
    </div>
  );
}
