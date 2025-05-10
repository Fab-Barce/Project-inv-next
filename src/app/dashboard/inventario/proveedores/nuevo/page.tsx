"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header_user from "@/app/components/header_user";
import axios from "axios";
import Button from "@/app/components/Button";

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
  const [isSubmitting, setIsSubmitting] = useState(false); 

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

    if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.RFC.trim() || !formData.nombre_representante.trim() || !formData.descripcion.trim() || !formData.num_telef.trim()) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return; // Detiene el envío si falta algún campo
    }
    setIsSubmitting(true);

    console.log("Datos a guardar:", formData);
    axios.post(`http://localhost:8000/Proveedores/create/`, formData )
    .then(res => {
      console.log(res);
      console.log(res.data)
      alert("Proveedor almacenado correctamente")
  })
  .finally(() => {
    setIsSubmitting(false); // Desbloquea el botón
  });
  };

  return (
    <div>
      <Header_user />
  
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
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              variant="green"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Guardar
            </Button>
  
            <Button
              variant="blue"
              onClick={() => router.push('/dashboard/inventario/proveedores/')}
            >
              Volver
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



//{`w-full p-2 border rounded-md ${editable ? "bg-white" : "bg-gray-200 cursor-not-allowed"}`}




