"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoVehiculo() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    num_serie: "",
    placas: "",
    operador: "",
    imagen: null as File | null,
    anio: "",
    empresa: "",
    marca: "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      imagen: file,
    });
  };

  const handleSubmit = () => {
    console.log("Datos a guardar:", formData);
    // Aquí se integraría la lógica para enviar los datos a la API
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold mb-4">Nuevo Vehículo</h1>
      <div className="bg-white p-4 rounded shadow-md grid grid-cols-2 gap-4">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Número de Serie</label>
            <input
              type="text"
              name="num_serie"
              value={formData.num_serie}
              onChange={handleInputChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Placas</label>
            <input
              type="text"
              name="placas"
              value={formData.placas}
              onChange={handleInputChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Operador</label>
            <input
              type="text"
              name="operador"
              value={formData.operador}
              onChange={handleInputChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Año</label>
            <input
              type="number"
              name="anio"
              value={formData.anio}
              onChange={handleInputChange}
              className="w-full border px-2 py-1"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Empresa</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleInputChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Marca</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleInputChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Imagen</label>
            <input
              type="file"
              name="imagen"
              onChange={handleFileChange}
              className="w-full border px-2 py-1"
            />
          </div>
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
  );
}
