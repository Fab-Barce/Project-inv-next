"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import Button from "@/app/components/Button";

type Usuario = {
  user_id: number;
  nombre: string;
  correo: string; // Campo de correo añadido
  rol: "visualizacion" | "modificacion";
  contrasena: string;
};

type Props = {
  onModificar: (usuario: Usuario) => void;
};


export default function PantallaUsuarios({ onModificar }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Estados para filtros y ordenación
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<keyof Usuario>("nombre");
  const [sortField, setSortField] = useState<keyof Usuario | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/usuarios/");
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("Eliminar los usuarios seleccionados?");
    if (confirmar) {
      try {
        await Promise.all(
          selectedItems.map(async (id) => {
            await fetch(`http://localhost:8000/api/usuarios/${id}/`, {
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
        setUsuarios((prev) =>
          prev.filter((u) => !selectedItems.includes(u.user_id))
        );
        setSelectedItems([]);
        setDeleteMode(false);
      } catch (error) {
        console.error("Error al eliminar usuarios:", error);
      }
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = confirm(`¿Estás seguro de eliminar al usuario con ID ${id}?`);
    if (confirmar) {
      try {
        await fetch(`http://localhost:8000/api/usuarios/${id}/`, { method: "DELETE" });
        setUsuarios(usuarios.filter((u) => u.user_id !== id));
        alert(`Usuario con ID ${id} eliminado.`);
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  const handleSort = (campo: keyof Usuario) => {
    if (sortField === campo) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(campo);
      setSortDirection("asc");
    }
  };

  const usuariosFiltradosOrdenados = [...usuarios]
    .filter((u) =>
      u[searchField]
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
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">Gestión de Usuarios</h1>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard_admin/users/nuevo">
          <Button variant="green">
            Nuevo
          </Button>
        </Link>
        <Button
          variant="yellow"
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
          >
            Confirmar Eliminación
          </Button>
        )}
        <Link href="/dashboard_admin">
          <Button variant="blue">
            Volver
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded shadow flex gap-2 items-center mb-4">
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as keyof Usuario)}
          className="p-2 border rounded"
        >
          <option value="nombre">Nombre</option>
          <option value="correo">Correo</option>
          <option value="rol">Rol</option>
        </select>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-1"
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {deleteMode && <th className="px-4 py-2"></th>}
              {[
                { campo: "nombre", label: "Nombre" },
                { campo: "correo", label: "Correo" },
                { campo: "rol", label: "Rol" },
              ].map(({ campo, label }) => (
                <th
                  key={campo}
                  onClick={() => handleSort(campo as keyof Usuario)}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortField === campo ? (
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
              ))}
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltradosOrdenados.map((usuario) => (
              <tr key={usuario.user_id} className="border-t hover:bg-gray-50">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(usuario.user_id)}
                      onChange={() => handleSelect(usuario.user_id)}
                    />
                  </td>
                )}
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2">{usuario.correo}</td>
                <td className="px-4 py-2">{usuario.rol}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center">
                    <Button
                      variant="tealLight"
                      size="small"
                      onClick={() => onModificar(usuario)}
                    >
                      Editar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          No hay usuarios registrados.
        </div>
      )}
    </div>
  );
}
