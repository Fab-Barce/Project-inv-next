"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";

export default function NuevaCategoria() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Datos a guardar:", formData);
    axios.post(`http://localhost:8000/Categorias/create/`, formData )
    .then(res => {
      console.log(res);
      console.log(res.data)
      alert("Categoria almacenada correctamente")
  })
  };

  return (
    <div>
      <Headerv2 />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">Nueva Categoria</h1>
        <div className="bg-white p-4 rounded shadow-md grid grid-cols-2 gap-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">Descrpcion</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
          
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => router.push('/dashboard_admin/inventario')}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
