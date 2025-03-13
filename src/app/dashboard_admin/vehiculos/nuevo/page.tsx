"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";  // Importamos useRouter

export default function Nuevo() {
    const router = useRouter();  // Inicializamos el router

    const [formData, setFormData] = useState({
        nombre: "",
        categoria_id: "",
        stock_minimo: "",
        descripcion: "",
        unidad: "",
        proveedor_id: "",
        imagen_refa: null as File | null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            imagen_refa: file,
        });
    };

    const handleSubmit = () => {
        console.log("Datos a guardar:", formData);
        // Aquí iría la integración futura con la API
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-xl font-bold mb-4">Nuevo Registro</h1>

            <div className="bg-white p-4 rounded shadow-md grid grid-cols-2 gap-4">

                {/* Lado izquierdo */}
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
                        <label className="block text-gray-700">Categoría</label>
                        <select
                            name="categoria_id"
                            value={formData.categoria_id}
                            onChange={handleInputChange}
                            className="w-full border px-2 py-1"
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="1">Categoría 1</option>
                            <option value="2">Categoría 2</option>
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

                {/* Lado derecho */}
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
                            name="proveedor_id"
                            value={formData.proveedor_id}
                            onChange={handleInputChange}
                            className="w-full border px-2 py-1"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Imagen</label>
                        <input
                            type="file"
                            name="imagen_refa"
                            onChange={handleFileChange}
                            className="w-full border px-2 py-1"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => router.push('/inventario')}  // Regresamos a /inventario
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
