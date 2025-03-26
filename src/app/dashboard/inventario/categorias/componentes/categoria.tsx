"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Categoria = {
  categoria_id: number;
  nombre: string;
  descripcion: string;
};

export default function Categoria() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaId = searchParams.get("id"); // Obtiene el ID desde la URL

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Obtener la categoría específica desde la API
  useEffect(() => {
    if (!categoriaId) return;

    const fetchCategoria = async () => {
      try {
        const response = await fetch(`http://localhost:8000/Categorias/${categoriaId}/`);
        if (!response.ok) throw new Error("Error al obtener la categoría");

        const data: Categoria = await response.json();
        setCategoria(data);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
      }
    };

    fetchCategoria();
  }, [categoriaId]);

  // Guardar cambios en la API
  const handleGuardar = async () => {
    try {
      const response = await fetch(`http://localhost:8000/Categorias/${categoriaId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, descripcion }),
      });

      if (!response.ok) throw new Error("Error al actualizar la categoría");

      alert("Categoría actualizada correctamente");
      router.push("/dashboard/inventario/categorias");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
    }
  };

  if (!categoria) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-xl font-bold text-black mb-4">Editar Categoría</h1>

      <div className="bg-white p-4 shadow rounded-lg">
        <label className="block mb-2">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        ></textarea>

        <button
          onClick={handleGuardar}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          Guardar Cambios
        </button>

        <button
          onClick={() => router.push("/dashboard/inventario/categorias")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
