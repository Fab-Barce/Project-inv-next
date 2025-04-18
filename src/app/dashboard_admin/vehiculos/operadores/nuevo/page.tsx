"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";
import Button from "@/app/components/Button";

type Empresa = {
  empresa_id: number;
  nombre: string;
};

export default function NuevoOperador() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [id_empresa, setIdEmpresa] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa_id: id_empresa,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Datos a guardar:", formData);
    axios.post(`http://localhost:8000/Operadores/create/`, formData )
    .then(res => {
      console.log(res);
      console.log(res.data)
      alert("Operador almacenado correctamente")
  })
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setIdEmpresa(selectedId);
    setFormData((prevData) => ({
      ...prevData,
      empresa_id: selectedId, // Actualizar el valor en formData
    }));
  };
  


  useEffect(() => {
    axios.get("http://localhost:8000/Empresas/")
    .then (response => {
      setEmpresas(response.data)
    }) 
  },[])

  return (
    <div>
      <Headerv2 />
  
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-300">
          <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Nuevo Operador</h1>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <Field
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </div>
  
            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label htmlFor="empresa_id" className="block text-gray-700 font-semibold mb-1">
                  Empresa
                </label>
                <select
                  name="empresa_id"
                  id="empresa_id"
                  value={formData.empresa_id}
                  onChange={handleEmpresaChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                >
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((empresa: { empresa_id: number; nombre: string }) => (
                    <option key={empresa.empresa_id} value={empresa.empresa_id}>
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
  
          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              variant="blue"
              onClick={() => router.push('/dashboard_admin/vehiculos/operadores')}
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
