"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";

type Empresa = {
  empresa_id: number;
  nombre: string;
};

type Operador = {
  operador_id: number;
  nombre: string;
  empresa_id:number;
};


export default function NuevoVehiculo() {
  const router = useRouter();

  const [formDatas, setFormDatas] = useState({
    num_serie: "",
    placas: "",
    anio: "",
    marca: "",
  });
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [id_operador, setIdOperador] = useState(0);
  const [id_empresa, setIdEmpresa] = useState(0);
  const [imagen_vehi, setImagen_vehi] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/Empresas/")
    .then (response => {
      setEmpresas(response.data)
    }) 
  },[])

  useEffect(() => {
    axios.get("http://localhost:8000/Operadores/")
    .then (response => {
      setOperadores(response.data)
    }) 
  },[])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const handleOperadorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdOperador(Number(e.target.value));
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdEmpresa(Number(e.target.value));
  };

  const handleFileChange = (e: any) => {
    setImagen_vehi(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('num_serie', formDatas.num_serie);
      formData.append('placas', formDatas.placas);
      formData.append('operador_id', id_operador.toString());
      formData.append('imagen_vehi', imagen_vehi || '');
      formData.append('empresa_id', id_empresa.toString());
      formData.append('marca', formDatas.marca );
      formData.append('anio', formDatas.anio );
      // Crear materia
      const response = await axios.post(`http://localhost:8000/Vehiculos/create/`, formData,{
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      alert("Vehiculo guardado correctamente.");
      router.push("/dashboard/inventario"); // Redirige al listado después de guardar
      console.log(response)
      try{
        axios.post(`http://localhost:8000/Movimientos/create/`, 
          {
            vehiculo_id:response.data.vehiculo_id,
            tipo_movimiento:"entrada",
            user_id:localStorage.getItem("user_id"),
          }
        )
        .then(res => {
          console.log(res);
          alert("Movimiento almacenado correctamente")
      })
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al guardar el movimiento");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar la refacción.");
    }
  };


  return (
    <div>
      <Headerv2 />
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
                value={formDatas.num_serie}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Placas</label>
              <input
                type="text"
                name="placas"
                value={formDatas.placas}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label htmlFor="operador" className="block text-gray-700">Operador</label>
              <select id="operador" value={id_operador} onChange={handleOperadorChange} className="w-full border px-2 py-1">
                  <option value="">Seleccione un operadorr</option>
                  {operadores.map((operador: { operador_id: number; nombre: string }) => (
                      <option key={operador.operador_id} value={operador.operador_id}>{operador.nombre}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Año</label>
              <input
                type="number"
                name="anio"
                value={formDatas.anio}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label htmlFor="empresa" className="block text-gray-700">Empresa</label>
              <select id="empresa" value={id_empresa} onChange={handleEmpresaChange} className="w-full border px-2 py-1">
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((empresa: { empresa_id: number; nombre: string }) => (
                      <option key={empresa.empresa_id} value={empresa.empresa_id}>{empresa.nombre}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Marca</label>
              <input
                type="text"
                name="marca"
                value={formDatas.marca}
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
                onClick={() => router.push('/dashboard/vehiculos')}
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
