import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import axios from "axios";

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
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Producto</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" name="nombre" value={formData?.nombre || ""} onChange={handleInputChange} editable={editable} />
                <Field label="numero_parte" name="numero_parte" value={formData?.numero_parte || ""} onChange={handleInputChange} editable={editable} />
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
                        <label className="block text-gray-700 font-semibold">Categoria:</label>
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
                <Field label="costo" name="costo" value={formData?.costo || ""} onChange={handleInputChange} editable={editable} />
                <Field label="stock_minimo" name="stock_minimo" value={formData?.stock_minimo || ""} onChange={handleInputChange} editable={editable} />
                <div className="flex-col">
                    {editable && <input type="file" onChange={handleFileChange} className="hover:bg-gray-400" />}
                    {formData?.imagen_refa && <img src={formData.imagen_refa} alt="Imagen" className="h-20" />}
                </div>
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
            </div>

            <div className="flex space-x-3 mt-6">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setEditable(!editable)}>
                    {editable ? "Bloquear" : "Modificar"}
                </button>
                {editable &&               
                    <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSave}
                    >
                        Guardar
                    </button>
                }
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" onClick={onCancelar}>
                    Cancelar
                </button>
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
                        <button className="bg-gray-400 px-4 py-2 rounded-lg" onClick={() => setIsOpen(false)}>Cancelar</button>
                        <button className="bg-green-500 px-4 py-2 text-white rounded-lg" onClick={handleGuardar}>Guardar</button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

const Field = ({ label, name, value, onChange, editable }: any) => (
    <div>
        <label className="block text-gray-700 font-semibold">{label}:</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            disabled={!editable}
            className={`w-full p-2 border rounded-md ${editable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
        />
    </div>
);

