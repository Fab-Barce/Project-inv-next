"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type Categoria = {
  categoria_id: number;
  nombre: string;
  descripcion: string;
};


export default function PantallaCategoria() {
  const [categorias, setCategoria] = useState<Categoria[]>([]);

    useEffect(() => {
      axios.get("http://localhost:8000/Categorias/")
      .then (response => {
        setCategoria(response.data)
      }) 
    },[])
    

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título */}
      <h1 className="text-xl text-black font-bold mb-4">Categorías</h1>

      {/* Botón de regreso */}
      <div className="mb-4">
        <Link href="/dashboard_v2/vista-inventario">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Volver
          </button>
        </Link>
      </div>

      {/* Tabla de categorías */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-center">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.categoria_id} className="border-b">
                <td className="px-4 py-2">{categoria.nombre}</td>
                <td className="px-4 py-2 text-center">{categoria.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categorias.length === 0 && (
        <div className="mt-4 text-gray-500">No hay categorías disponibles.</div>
      )}
    </div>
  );
}
