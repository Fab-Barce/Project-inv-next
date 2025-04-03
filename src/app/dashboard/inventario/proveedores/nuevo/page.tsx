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
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">Nuevo Proveedor</h1>
        <div className="bg-white p-4 rounded shadow-md grid grid-cols-2 gap-4">
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
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => router.push('/dashboard/inventario/proveedores/')}
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
    <label className="block text-gray-700">{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border px-2 py-1"
    />
  </div>
);
