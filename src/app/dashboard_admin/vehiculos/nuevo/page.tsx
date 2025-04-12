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
  empresa_id: number;
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
  const [imagen_vehi, setImagen_vehi] = useState<any>(null);

  // Obtener empresas
  useEffect(() => {
    axios
      .get("http://localhost:8000/Empresas/")
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener empresas:", error);
      });
  }, []);

  // Obtener operadores
  useEffect(() => {
    axios
      .get("http://localhost:8000/Operadores/")
      .then((response) => {
        setOperadores(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener operadores:", error);
      });
  }, []);

  // Manejo de cambios en inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const handleOperadorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIdOperador(Number(e.target.value));
  };

  const handleEmpresaChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIdEmpresa(Number(e.target.value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      setImagen_vehi(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("num_serie", formDatas.num_serie);
      formData.append("placas", formDatas.placas);
      formData.append("operador_id", id_operador.toString());
      formData.append("imagen_vehi", imagen_vehi || "");
      formData.append("empresa_id", id_empresa.toString());
      formData.append("marca", formDatas.marca);
      formData.append("anio", formDatas.anio);

      // Crear vehículo
      const response = await axios.post(
        `http://localhost:8000/Vehiculos/create/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Vehículo guardado correctamente.");
      router.push("/dashboard_admin/inventario");
      console.log(response);

      // Registrar movimiento de entrada
      try {
        axios
          .post(`http://localhost:8000/Movimientos/create/`, {
            vehiculo_id: response.data.vehiculo_id,
            tipo_movimiento: "entrada",
            user_id: localStorage.getItem("user_id"),
          })
          .then((res) => {
            console.log(res);
            alert("Movimiento almacenado correctamente");
          });
      } catch (error) {
        console.error("Error al guardar el movimiento:", error);
        alert("Hubo un problema al guardar el movimiento");
      }
    } catch (error) {
      console.error("Error al guardar el vehículo:", error);
      alert("Hubo un problema al guardar el vehículo.");
    }
  };

  return (
    <div>
      <Headerv2 />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
          <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Nuevo Vehículo
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna Izquierda */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold">
                  Número de Serie
                </label>
                <input
                  type="text"
                  name="num_serie"
                  value={formDatas.num_serie}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Placas
                </label>
                <input
                  type="text"
                  name="placas"
                  value={formDatas.placas}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label
                  htmlFor="operador"
                  className="block text-gray-700 font-semibold"
                >
                  Operador
                </label>
                <select
                  id="operador"
                  value={id_operador}
                  onChange={handleOperadorChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Seleccione un operador</option>
                  {operadores.map((operador) => (
                    <option
                      key={operador.operador_id}
                      value={operador.operador_id}
                    >
                      {operador.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Año
                </label>
                <input
                  type="number"
                  name="anio"
                  value={formDatas.anio}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            {/* Columna Derecha */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="empresa"
                  className="block text-gray-700 font-semibold"
                >
                  Empresa
                </label>
                <select
                  id="empresa"
                  value={id_empresa}
                  onChange={handleEmpresaChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((empresa) => (
                    <option
                      key={empresa.empresa_id}
                      value={empresa.empresa_id}
                    >
                      {empresa.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Marca
                </label>
                <input
                  type="text"
                  name="marca"
                  value={formDatas.marca}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Imagen
                </label>
                <input
                  type="file"
                  name="imagen"
                  onChange={handleFileChange}
                  className="w-full border px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none"
                />
              </div>

            </div>
                        
          </div>

                  <div className="flex justify-end space-x-4 mt-8">
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
                        onClick={() => router.push("/dashboard_admin/vehiculos")}
                      >
                        Volver
                      </button>
                      <button
                        type="button"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
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
