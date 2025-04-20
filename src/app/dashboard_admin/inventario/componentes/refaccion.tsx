import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import Button from "@/app/components/Button";

// Definición del tipo de datos Producto
type Producto = {
    refaccion_id: number;
    proveedor_id: string;
    vehiculo_id: string;
    numero_parte: string;
    nombre: string;
    cantidad: number;
    stock_minimo: number;
    costo: number;
    categoria_id: string;
    imagen_refa: string;
    empresa_id: string;
    categoria: string;
    proveedor: string;
    empresa: string;
};

type Proveedor = {
    proveedor_id: number;
    nombre: string;
    activo: string
  };
  type Categoria = {
    categoria_id: number;
    nombre: string;
    activo: string
  };
  type Empresa = {
    empresa_id: number;
    nombre: string;
  };
  type Vehiculo = {
    vehiculo_id: number;
    placas: string;
    activo: string
  };

type Props = {
    producto: Producto | null;
    onCancelar: () => void;
};

export default function Refaccion({ producto, onCancelar }: Props) {
    const [formData, setFormData] = useState<Producto | null>(null);
    const [editable, setEditable] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
    const [cantidadModificada, setCantidadModificada] = useState(0);
    const [datosMovimiento, setDatosMovimiento] = useState({
        numUnidad: "",
        motivo: "",
    });
    const [proveedores, setProveedor] = useState<Proveedor[]>([]);
    const [categorias, setCategoria] = useState<Categoria[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [initialData, setInitialData] = useState<Producto | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [id_vehiculo, setIdVehiculo] = useState(0);

    useEffect(() => {
        const storedUserId = localStorage.getItem("user_id");
    
        setUserId(storedUserId);
        console.log("Mi user Id", localStorage.getItem("user_id"))
    }, []);

    useEffect(() => {
        if (producto) {
            setFormData(producto);
            setInitialData(producto);
            setCantidadModificada(producto.cantidad);
        }
    }, [producto]);

    useEffect(() => {
      axios.get("http://localhost:8000/Proveedores/")
      .then (response => {
        const proveedoresActivos = response.data.filter((cat: any) => cat.activo !== "false");
        setProveedor(proveedoresActivos)
      }) 
    },[])
    
      useEffect(() => {
        axios.get("http://localhost:8000/Categorias/")
        .then (response => {
          const categoriasActivas = response.data.filter((cat: any) => cat.activo !== "false");
          setCategoria(categoriasActivas)
        }) 
      },[])
    
      useEffect(() => {
        axios.get("http://localhost:8000/Empresas/")
        .then (response => {
          setEmpresas(response.data)
        }) 
      },[])

      useEffect(() => {
        axios.get("http://localhost:8000/Vehiculos/")
        .then (response => {
          const vehiculosActivos = response.data.filter((cat: any) => cat.activo !== "false");
            setVehiculos(vehiculosActivos)
        }) 
        },[])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => (prev ? { ...prev, [name]: value } : null));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
      if (!formData || !initialData) return;
  
      const updatedFields: Partial<Producto> = {};
      let hasChanges = false;
  
      Object.keys(formData).forEach(key => {
          const current = formData[key as keyof Producto];
          const original = initialData[key as keyof Producto];
  
          if (current !== original) {
              updatedFields[key as keyof Producto] = current;
              hasChanges = true;
          }
      });
  
      if (!hasChanges && !file) {
          alert("No se han realizado cambios.");
          return;
      }
  
      const formDataToSend = new FormData();
      for (const key in updatedFields) {
          formDataToSend.append(key, updatedFields[key as keyof Producto] as string);
      }
  
      if (file) {
          formDataToSend.append("imagen_refa", file);
      }
  
      try {
          await axios.patch(`http://localhost:8000/Refacciones/update/${producto.refaccion_id}/`, formDataToSend, {
              headers: { "Content-Type": "multipart/form-data" }
          });
  
          await axios.post(`http://localhost:8000/Movimientos/create/`, {
              refaccion_id: producto.refaccion_id,
              tipo_movimiento: "actualizacion",
              user_id: userId,
          });
  
          alert("Producto actualizado con éxito");
          setEditable(false);
      } catch (error) {
          console.error("Error al actualizar el producto", error);
      }
  };

    const handleVehiculoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIdVehiculo(Number(e.target.value));
      };

      const handleGuardar = async () => {
        try {
            const cantidadOriginal = Number(producto.cantidad);
            const nuevaCantidad = Number(cantidadModificada);
    
            if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
                alert("Por favor, ingresa una cantidad válida.");
                return;
            }
    
            // ❗ Solo proceder si la cantidad cambió
            if (cantidadOriginal === nuevaCantidad) {
                alert("No hubo cambios en la cantidad.");
                return;
            }
    
            // 🧠 Generar motivo automático si es salida
            const vehiculoSeleccionado = vehiculos.find(v => v.vehiculo_id === id_vehiculo);
            const placaVehiculo = vehiculoSeleccionado ? vehiculoSeleccionado.placas : "desconocido";
            let motivoFinal = datosMovimiento.motivo;
    
            if (tipoMovimiento === "salida") {
                motivoFinal = `Pieza ${producto.nombre} establecida en vehículo ${placaVehiculo}`;
            }
    
            // 1️⃣ PATCH - Actualizar la cantidad
            await axios.patch(`http://localhost:8000/Refacciones/update/${producto.refaccion_id}/`, {
                cantidad: nuevaCantidad
            });
    
            // 2️⃣ POST - Registrar movimiento
            const movimientoData = {
                refaccion_id: producto.refaccion_id,
                cantidad: nuevaCantidad,
                tipo_movimiento: tipoMovimiento,
                motivo: motivoFinal,
                user_id: userId,
            };
    
            await axios.post("http://localhost:8000/Movimientos/create/", movimientoData);
    
            alert("Operación realizada con éxito");
            setIsOpen(false);
    
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error al guardar los cambios", error.response?.data || error.message);
            } else {
                console.error("Error al guardar los cambios", error);
            }
            alert("Hubo un error al guardar los cambios.");
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
            <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Detalle de Producto</h2>
      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nombre" name="nombre" value={formData?.nombre || ""} onChange={handleInputChange} editable={editable} />
              <Field label="Número de Parte" name="numero_parte" value={formData?.numero_parte || ""} onChange={handleInputChange} editable={editable} />
              
              {editable ? (
                <div>
                  <label className="block text-gray-700 font-semibold">Proveedor:</label>
                  <select
                    name="proveedor_id"
                    value={formData?.proveedor_id || 0}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    {proveedores.map((proveedor: any) => (
                      <option key={proveedor.proveedor_id} value={proveedor.proveedor_id}>{proveedor.nombre}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <Field label="Proveedor" name="proveedor_id" value={formData?.proveedor || ""} editable={false} />
              )}
              
              {editable ? (
                <div>
                  <label className="block text-gray-700 font-semibold">Categoría:</label>
                  <select
                    name="categoria_id"
                    value={formData?.categoria_id || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    {categorias.map((categoria: any) => (
                      <option key={categoria.categoria_id} value={categoria.categoria_id}>{categoria.nombre}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <Field label="Categoría" name="categoria_id" value={formData?.categoria || ""} editable={false} />
              )}
              
              <Field label="Costo" name="costo" value={formData?.costo || ""} onChange={handleInputChange} editable={editable} />
              <Field label="Stock Mínimo" name="stock_minimo" value={formData?.stock_minimo || ""} onChange={handleInputChange} editable={editable} />
      
             
      
              {editable ? (
                <div>
                  <label className="block text-gray-700 font-semibold">Empresa:</label>
                  <select
                    name="empresa_id"
                    value={formData?.empresa_id || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    {empresas.map((empresa: any) => (
                      <option key={empresa.empresa_id} value={empresa.empresa_id}>{empresa.nombre}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <Field label="Empresa" name="empresa_id" value={formData?.empresa || ""} editable={false} />
              )}
      
              <div className="flex items-center space-x-2">
                <Field label="Cantidad" name="cantidad" value={formData?.cantidad || 0} onChange={handleInputChange} editable={false} />
                <button className="text-blue-500 hover:text-blue-700" onClick={() => setIsOpen(true)}>
                  <FaEdit size={20} />
                </button>
              </div>

              <div className="flex justify-center flex-col items-center">
                {editable && (
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-200"
                  />
                )}
                {formData?.imagen_refa && (
                  <img
                    src={formData.imagen_refa}
                    alt="Imagen"
                    className="mt-4 w-64 h-64 object-contain  rounded-lg shadow-lg"
                  />
                )}
              </div>





            </div>
      
            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mt-10">
              <Button
                variant="green"
                onClick={handleSave}
              >
                Guardar
              </Button>
      
              <Button
                variant="teal"
                onClick={() => setEditable(!editable)}
              >
                {editable ? "Bloquear" : "Modificar"}
              </Button>
      
              <Button
                variant="blue"
                onClick={onCancelar}
              >
                Volver
              </Button>
            </div>
      
            {/* Ventana Modal para modificar la cantidad */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Modificar Cantidad</h3>
                <label className="block text-gray-700">Nueva Cantidad:</label>
                <input
                  type="number"
                  value={cantidadModificada}
                  onChange={(e) => setCantidadModificada(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                />
                <label className="block text-gray-700 mt-3">Tipo de Movimiento:</label>
                <select
                  value={tipoMovimiento}
                  onChange={(e) => setTipoMovimiento(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                  <option value="correccion">Corrección</option>
                </select>
                {tipoMovimiento === "salida" && (
                  <>
                    <div>
                      <label htmlFor="vehiculo" className="block text-gray-700">Numero de unidad</label>
                      <select id="vehiculo" value={id_vehiculo} onChange={handleVehiculoChange} className="w-full border px-2 py-1">
                        <option value="">Seleccione un vehiculo</option>
                        {vehiculos.map((vehiculo: { vehiculo_id: number; placas: string }) => (
                          <option key={vehiculo.vehiculo_id} value={vehiculo.vehiculo_id}>{vehiculo.placas}</option>
                        ))}
                      </select>
                    </div>
                    <label className="block text-gray-700 mt-3">Descripción Motivo (Opcional)</label>
                    <textarea
                      name="descripcionMotivo"
                      value={datosMovimiento.motivo}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </>
                )}
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="gray" onClick={() => setIsOpen(false)}>Cancelar</Button>
                  <Button variant="green" onClick={handleGuardar}>Guardar</Button>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      );
}

const Field = ({ label, name, value, onChange, editable }: any) => (
    <div>
      <label className="block text-gray-700 font-semibold mb-1">{label}:</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editable}
        className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
          editable ? "bg-white focus:ring-2 focus:ring-blue-400" : "bg-gray-200 cursor-not-allowed"
        }`}
      />
    </div>
  );