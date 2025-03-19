"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Usuario = {
  user_id: number;
  nombre: string;
  correo: string;
  rol: "visualizacion" | "modificacion";
};

export default function PantallaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // 🔹 Obtener usuarios desde la API al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/usuarios2/");
        if (!response.ok) throw new Error("Error al obtener los usuarios");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  // 🔹 Seleccionar o deseleccionar un usuario para eliminar
  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 🔹 Eliminar en lote los usuarios seleccionados (API)
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("¿Estás seguro de eliminar los usuarios seleccionados?");
    if (confirmar) {
      try {
        await Promise.all(
          selectedItems.map(async (id) => {
            await fetch(`http://localhost:8000/api/usuarios2/${id}/`, {
              method: "DELETE",
            });
          })
        );

        setUsuarios((prev) => prev.filter((u) => !selectedItems.includes(u.user_id)));
        setSelectedItems([]);
        setDeleteMode(false);
      } catch (error) {
        console.error("Error al eliminar usuarios:", error);
      }
    }
  };

  // 🔹 Eliminar un usuario individual
  const handleEliminar = async (id: number) => {
    const confirmar = confirm(`¿Estás seguro de eliminar al usuario con ID ${id}?`);
    if (confirmar) {
      try {
        await fetch(`http://localhost:8000/api/usuarios2/${id}/`, { method: "DELETE" });
        setUsuarios(usuarios.filter((u) => u.user_id !== id));
        alert(`Usuario con ID ${id} eliminado.`);
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl text-black font-bold mb-4">Gestión de Usuarios</h1>

      {/* Botones de acción */}
      <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard_admin/users/nuevo">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nuevo
          </button>
        </Link>

        <button
          onClick={() => setDeleteMode(!deleteMode)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {deleteMode ? "Cancelar Eliminación" : "Eliminar"}
        </button>

        {deleteMode && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={selectedItems.length === 0}
          >
            Confirmar Eliminación
          </button>
        )}

        <Link href="/dashboard_admin">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Volver
          </button>
        </Link>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {deleteMode && <th className="px-4 py-2"></th>}
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Correo</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.user_id}>
                {deleteMode && (
                  <td className="px-4 py-2 text-center ">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(usuario.user_id)}
                      onChange={() => handleSelect(usuario.user_id)}
                    />
                  </td>
                )}
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td className="text-center">{usuario.rol}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center">
                    <Link href={`/dashboard_admin/users/${usuario.user_id}`}>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600  "
                      >
                        Ver Detalles
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && (
        <div className="mt-4 text-gray-500">No hay usuarios registrados.</div>
      )}
    </div>
  );
}
