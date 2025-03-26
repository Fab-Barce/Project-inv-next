"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";

export default function NuevoRefaccion() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    cantidad: "",
    categoria: "",
    stock_minimo: "",
    descripcion: "",
    unidad: "",
    proveedor: "",
    imagen: null as File | null,
    empresa: "",
    numero_parte: "",
    costo: "",
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
    // Aquí iría la integración con la API para enviar los datos
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
              <label className="block text-gray-700">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              >
                <option value="">Selecciona una categoría</option>
                <option value="1">Categoría 1</option>
                <option value="2">Categoría 2</option>
                {/* Puedes agregar más opciones según tus necesidades */}
              </select>
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
            <div>
              <label className="block text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Unidad</label>
              <select
                name="unidad"
                value={formData.unidad}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              >
                <option value="">Selecciona una unidad</option>
                <option value="unidad1">Unidad 1</option>
                <option value="unidad2">Unidad 2</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Proveedor</label>
              <input
                type="text"
                name="proveedor"
                value={formData.proveedor}
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
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => router.push("/dashboard_admin/inventario")}
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
