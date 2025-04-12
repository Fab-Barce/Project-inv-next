"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";

export default function NuevoProveedor() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    RFC: "",
    nombre_representante: "",
    descripcion: "",
    num_telef: "",
  }); 

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    axios.post(`http://localhost:8000/Proveedores/create/`, formData )
    .then(res => {
      console.log(res);
      console.log(res.data)
      alert("Proveedor almacenado correctamente")
  })
  };

  return (
    <div>
      <Headerv2 />
  
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-300">
          <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Nuevo Proveedor</h1>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
              <Field label="RFC" name="RFC" value={formData.RFC} onChange={handleInputChange} />
              <Field label="Representante" name="nombre_representante" value={formData.nombre_representante} onChange={handleInputChange} />
            </div>
  
            {/* Columna derecha */}
            <div className="space-y-4">
              <Field label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
              <Field label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
              <Field label="Teléfono" name="num_telef" value={formData.num_telef} onChange={handleInputChange} />
            </div>
          </div>
  
          {/* Botones */}
          <div className="flex justify space-x-4 mt-8">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold"
              onClick={handleSubmit}
            >
              Guardar
            </button>
  
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
              onClick={() => router.push('/dashboard/inventario/proveedores/')}
            >
              Volver
            </button>
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



//{`w-full p-2 border rounded-md ${editable ? "bg-white" : "bg-gray-200 cursor-not-allowed"}`}




