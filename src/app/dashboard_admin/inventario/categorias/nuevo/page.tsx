"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";
import Button from "@/app/components/Button";

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

    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Nueva Categoría</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
      
            <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            <Field label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} />

        </div>

        {/* Botones */}
        <div className="flex space-x-4 mt-8 justify-end">
          <Button
            variant="blue"
            onClick={() => router.push('/dashboard_admin/inventario/categorias')}
          >
            Volver
          </Button>
          <Button
            variant="green"
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  </div>
);



}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Field = ({ label, name, value, onChange }: FieldProps) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-1">{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);
