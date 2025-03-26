"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";

export default function NuevoRefaccion() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    cantidad: 0,
    stock_minimo: 0,
    numero_parte: "",
    costo: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "cantidad" || name === "stock_minimo" || name === "costo" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/Refacciones/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al guardar la refacción.");
      }

      alert("Refacción guardada correctamente.");
      router.push("/dashboard/inventario"); // Redirige al listado después de guardar
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar la refacción.");
    }
  };

  return (
    <div>
      <Headerv2 />
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">Nueva Refacción</h1>
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
              <label className="block text-gray-700">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Stock Mínimo</label>
              <input
                type="number"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Número de Parte</label>
              <input
                type="text"
                name="numero_parte"
                value={formData.numero_parte}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Costo</label>
              <input
                type="number"
                name="costo"
                value={formData.costo}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => router.push("/dashboard/inventario")}
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
