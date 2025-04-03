"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";

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
            <label htmlFor="empresa_id" className="block text-gray-700">Empresa</label>
              <select name="empresa_id" id="empresa_id" value={formData.empresa_id} onChange={handleEmpresaChange} className="w-full border px-2 py-1">
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((empresa: { empresa_id: number; nombre: string }) => (
                      <option key={empresa.empresa_id} value={empresa.empresa_id}>{empresa.nombre}</option>
                  ))}
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