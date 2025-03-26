"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";

export default function NuevoOperador() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    unidad: "",
    empresa: "Empresa A",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Datos a guardar:", formData);
    // Aquí se integraría la lógica para enviar los datos a la API
  };

  return (
    <div>
      <Headerv2 />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">Nuevo Operador</h1>
        <div className="bg-white p-4 rounded shadow-md grid grid-cols-2 gap-4">
          {/* Campos del formulario */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Unidad</label>
              <input
                type="text"
                name="unidad"
                value={formData.unidad}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Empresa</label>
              <select
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="Empresa A">Empresa A</option>
                <option value="Empresa B">Empresa B</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => router.push('/dashboard_admin/vehiculos')}
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
