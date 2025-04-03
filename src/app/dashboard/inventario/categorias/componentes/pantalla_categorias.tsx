"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
 
type Categoria = {
  id: number;
  nombre: string;
  descripcion: string;
};

export default function PantallaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8000/Categorias/");
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("¿Estás seguro de eliminar las categorías seleccionadas?");
    if (confirmar) {
      try {
        await Promise.all(
          selectedItems.map(async (id) => {
            await fetch(`http://localhost:8000/Categorias/delete/${id}/`, {
              method: "DELETE",
            });
          })
        );

        setCategorias((prev) => prev.filter((c) => !selectedItems.includes(c.id)));
        setSelectedItems([]);
        setDeleteMode(false);
      } catch (error) {
        console.error("Error al eliminar categorías:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">Categorías</h1>
      </div>

      <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard/inventario/categorias/nuevo">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nueva Categoría
          </button>
        </Link>

        <button
          onClick={() => {
            setDeleteMode(!deleteMode);
            setSelectedItems([]);
          }}
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

        <Link href="/dashboard/inventario">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Volver
          </button>
        </Link>
      </div>

      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {deleteMode && <th className="px-4 py-2"></th>}
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="border-t">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(categoria.id)}
                      onChange={() => handleSelect(categoria.id)}
                    />
                  </td>
                )}
                <td className="px-4 py-2">{categoria.nombre}</td>
                <td className="px-4 py-2">{categoria.descripcion}</td>
                {!deleteMode && (
                  <td className="px-4 py-2">
                    <Link href={`/dashboard/inventario/categorias/${categoria.id}`}>
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                        Ver Detalles
                      </button>
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categorias.length === 0 && (
        <div className="mt-4 text-gray-500">No hay categorías registradas.</div>
      )}
    </div>
  );
}
