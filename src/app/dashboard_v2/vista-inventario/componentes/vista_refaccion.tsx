import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import Button from "@/app/components/Button";   

// Definición del tipo de datos Producto
type Producto = {
    refaccion_id: number;
    proveedor_id: string;
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
    marca: string;
    num_unidad: string;
    linas: string;
};

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
  type Vehiculo = {
    vehiculo_id: number;
    placas: string;
    num_unidad: string;
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
    const [lineasSeleccionadas, setLineasSeleccionadas] = useState<string[]>([]);
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
    axios.get("http://localhost:8000/Vehiculos/")
    .then (response => {
        setVehiculos(response.data)
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

      const agregarLinea = () => {
    setLineasSeleccionadas([...lineasSeleccionadas, ""]);
  };

  const eliminarLinea = (index: number) => {
    const nuevas = [...lineasSeleccionadas];
    nuevas.splice(index, 1);
    setLineasSeleccionadas(nuevas);
  };

  const cambiarLinea = (index: number, valor: string) => {
    const nuevas = [...lineasSeleccionadas];
    nuevas[index] = valor;
    setLineasSeleccionadas(nuevas);
  };


    const handleSave = async () => {
        if (!formData) return;

        const updatedFields: Partial<Producto> = {};
        Object.keys(formData).forEach(key => {
            if (formData[key as keyof Producto] !== initialData?.[key as keyof Producto]) {
                updatedFields[key as keyof Producto] = formData[key as keyof Producto];
            }
        });

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
            try{
                axios.post(`http://localhost:8000/Movimientos/create/`, 
                {
                    refaccion_id:producto.refaccion_id,
                    tipo_movimiento:"actualizacion",
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
            // Verifica que la cantidad modificada sea válida
            if (!cantidadModificada || cantidadModificada < 0) {
                alert("Por favor, ingresa una cantidad válida.");
                return;
            }
    
            // Buscar el vehículo seleccionado por su ID
            const vehiculoSeleccionado = vehiculos.find(v => v.vehiculo_id === id_vehiculo);
            const placaVehiculo = vehiculoSeleccionado ? vehiculoSeleccionado.placas : "desconocido";
    
            // Si el tipo de movimiento es "salida", se genera el motivo automáticamente
            let motivoFinal = datosMovimiento.motivo;
            if (tipoMovimiento === "salida") {
                motivoFinal = `Pieza ${producto.nombre} establecida en vehículo ${placaVehiculo}`;
            }
    
            // 1️⃣ PATCH - Actualizar la cantidad en Refacciones
            await axios.patch(`http://localhost:8000/Refacciones/update/${producto.refaccion_id}/`, {
                cantidad: cantidadModificada
            });
    
            // 2️⃣ Si el tipo de movimiento es "salida", actualizar vehiculo_id
            if (tipoMovimiento === "salida") {
                await axios.patch(`http://localhost:8000/Refacciones/update/${producto.refaccion_id}/`, {
                    vehiculo_id: id_vehiculo
                });
            }
    
            // 3️⃣ POST - Crear un nuevo movimiento
            const movimientoData = {
                refaccion_id: producto.refaccion_id,
                cantidad: cantidadModificada,
                tipo_movimiento: tipoMovimiento,
                motivo: motivoFinal,
                user_id: userId,
            };
            console.log("envindo", movimientoData)
    
            await axios.post("http://localhost:8000/Movimientos/create/", movimientoData);
    
            alert("Operación realizada con éxito");
            setIsOpen(false); // Cierra el modal después de guardar
    
        } catch (error) {
            console.error("Error al guardar los cambios", error);
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
              <label className="block text-gray-700 font-semibold">
                Líneas:
              </label>
              {lineasSeleccionadas.map((linea, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={linea}
                    onChange={(e) => cambiarLinea(index, e.target.value)}
                    className="flex-1 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Seleccione una línea</option>
                    <option value="Linea1">Linea1</option>
                    <option value="Linea2">Linea2</option>
                    <option value="Linea3">Linea3</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => eliminarLinea(index)}
                    className="text-red-500 font-bold text-xl"
                    title="Eliminar línea"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={agregarLinea}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                + Agregar Línea
              </button>
            </div>
          ) : (
            <Field
              label="Asignación"
              name="lineas"
              value={(formData?.linas || "").split(",").join(", ")}
              editable={false}
            />
          )}
      
             
      
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

              <Field label="Marca" name="marca" value={formData?.marca || ""} onChange={handleInputChange} editable={editable} />
      
              <div className="flex items-center space-x-2">
                <Field label="Cantidad" name="cantidad" value={formData?.cantidad || 0} onChange={handleInputChange} editable={false} />

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
                variant="blue"
                onClick={onCancelar}
              >
                Volver
              </Button>
            </div>
      
            {/* Ventana Modal para modificar la cantidad */}

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