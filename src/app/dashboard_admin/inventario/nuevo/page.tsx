"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";

type Proveedor = {
  proveedor_id: number;
  nombre: string;
};
type Categoria = {
  categoria_id: number;
  nombre: string;
};
type Empresa = {
  empresa_id: number;
  nombre: string;
};

export default function NuevoRefaccion() {
  const router = useRouter();

  const [formDatas, setFormData] = useState({
    numero_parte: "",
    nombre: "",
    cantidad: 0,
    stock_minimo: 0,
    costo: 0,
  });
  const [proveedores, setProveedor] = useState<Proveedor[]>([]);
  const [categorias, setCategoria] = useState<Categoria[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [id_proveedor, setIdProveedor] = useState(0);
  const [id_categoria, setIdCategoria] = useState(0);
  const [id_empresa, setIdEmpresa] = useState(0);
  const [imagen_refa, setImagen_refa] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    axios.get("http://localhost:8000/Proveedores/")
    .then (response => {
      setProveedor(response.data)
    }) 
  },[])

  useEffect(() => {
    axios.get("http://localhost:8000/Categorias/")
    .then (response => {
      setCategoria(response.data)
    }) 
  },[])

  useEffect(() => {
    axios.get("http://localhost:8000/Empresas/")
    .then (response => {
      setEmpresas(response.data)
    }) 
  },[])

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    setUserId(storedUserId);
    console.log("Mi user Id", localStorage.getItem("user_id"))
}, []);


  const handleInputChange = ( 
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formDatas,
      [name]: name === "cantidad" || name === "stock_minimo" || name === "costo" ? Number(value) : value,
    });
  };

  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdProveedor(Number(e.target.value));
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdCategoria(Number(e.target.value));
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdEmpresa(Number(e.target.value));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('proveedor_id', id_proveedor.toString());
      formData.append('numero_parte', formDatas.numero_parte);
      formData.append('nombre', formDatas.nombre );
      formData.append('cantidad', formDatas.cantidad.toString());
      formData.append('stock_minimo', formDatas.stock_minimo.toString());
      formData.append('costo', formDatas.costo.toString());
      formData.append('categoria_id', id_categoria.toString());
      formData.append('imagen_refa', imagen_refa || '');
      formData.append('empresa_id', id_empresa.toString());
      // Crear materia
      const response = await axios.post(`http://localhost:8000/Refacciones/create/`, formData,{
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      alert("Refacción guardada correctamente.");
      router.push("/dashboard_admin/inventario"); // Redirige al listado después de guardar
      console.log(response)
      try{
        axios.post(`http://localhost:8000/Movimientos/create/`, 
          {
            refaccion_id:response.data.refaccion_id,
            cantidad: formDatas.cantidad,
            tipo_movimiento:"entrada",
            user_id:userId,
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

  const handleArchivoChange = (e:any) => {
    setImagen_refa(e.target.files[0]); // Usar el archivo seleccionado
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
                value={formDatas.nombre}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
            <label htmlFor="proveedor" className="block text-gray-700">Proveedor</label>
              <select id="proveedor" value={id_proveedor} onChange={handleProveedorChange} className="w-full border px-2 py-1">
                  <option value="">Seleccione un proveedor</option>
                  {proveedores.map((proveedor: { proveedor_id: number; nombre: string }) => (
                      <option key={proveedor.proveedor_id} value={proveedor.proveedor_id}>{proveedor.nombre}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                value={formDatas.cantidad}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Stock Mínimo</label>
              <input
                type="number"
                name="stock_minimo"
                value={formDatas.stock_minimo}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
            <label htmlFor="empresa" className="block text-gray-700">Empresa</label>
              <select id="empresa" value={id_empresa} onChange={handleEmpresaChange} className="w-full border px-2 py-1">
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((empresa: { empresa_id: number; nombre: string }) => (
                      <option key={empresa.empresa_id} value={empresa.empresa_id}>{empresa.nombre}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Número de Parte</label>
              <input
                type="text"
                name="numero_parte"
                value={formDatas.numero_parte}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
            <label htmlFor="categoria" className="block text-gray-700">Categoria</label>
              <select id="categoria" value={id_categoria} onChange={handleCategoriaChange} className="w-full border px-2 py-1">
                  <option value="">Seleccione un categoria</option>
                  {categorias.map((categoria: { categoria_id: number; nombre: string }) => (
                      <option key={categoria.categoria_id} value={categoria.categoria_id}>{categoria.nombre}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Costo</label>
              <input
                type="number"
                name="costo"
                value={formDatas.costo}
                onChange={handleInputChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label htmlFor="imagen" className="block text-gray-700">Imagen de materia</label>
                <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    className="w-full border px-2 py-1 hover:bg-gray-400"
                    onChange={handleArchivoChange} 
                />
            </div>
            <div className="block h-14"></div>
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
