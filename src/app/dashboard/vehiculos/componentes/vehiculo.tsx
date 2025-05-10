import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "@/app/components/Button";

type Empresa = {
    empresa_id: number;
    nombre: string;
};

type Operador = {
    operador_id: number;
    nombre: string;
    empresa_id: number;
    activo:string
};

type Vehiculo = {
    vehiculo_id: number;
    num_serie: string;
    placas: string;
    operador_id: number;
    imagen_vehi: string;
    anio: number;
    empresa_id: number;
    marca: string;
    empresa: string;
    operador: string;
    linea: string;
    activo:string;
    num_unidad:string;
    };

type Props = {
    vehiculo: Vehiculo | null;
    onCancelar: () => void;
};

export default function VehiculoDetalle({ vehiculo, onCancelar }: Props) {
    const [formData, setFormData] = useState<Vehiculo | null>(null);
    const [operadores, setOperadores] = useState<Operador[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [editable, setEditable] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [initialData, setInitialData] = useState<Vehiculo | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("user_id");
        setUserId(storedUserId);
        console.log("Mi user Id", localStorage.getItem("user_id"))
    }, []);

    useEffect(() => {
        if (vehiculo) {
            setFormData(vehiculo);
            setInitialData(vehiculo);
        }
        console.log("tengo esto", vehiculo)
    }, [vehiculo]);

    useEffect(() => {
        axios.get("http://localhost:8000/Empresas/")
            .then(response => {
                setEmpresas(response.data)
            })
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8000/Operadores/")
            .then(response => {
                const operadoresActivos = response.data.filter((cat: any) => cat.activo !== "false");
                setOperadores(operadoresActivos)
            })
    }, []);

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
    
        const updatedFields: Partial<Vehiculo> = {};
        let operadorCambioMotivo = ""; // Aquí guardaremos el motivo si cambia el operador
    
        // Detectar solo campos modificados
        Object.keys(formData).forEach(key => {
            const current = formData[key as keyof Vehiculo];
            const initial = initialData?.[key as keyof Vehiculo];
    
            if (current !== initial) {
                updatedFields[key as keyof Vehiculo] = current;
    
                // Detectar cambio de operador
                if (key === "operador_id") {
                    const operadorAnterior = operadores.find(op => op.operador_id === Number(initial));
                    const operadorNuevo = operadores.find(op => op.operador_id === Number(current));
    
                    const nombreAnterior = operadorAnterior ? operadorAnterior.nombre : `ID ${initial}`;
                    const nombreNuevo = operadorNuevo ? operadorNuevo.nombre : `ID ${current}`;
    
                    operadorCambioMotivo = `Cambio de operador (${nombreAnterior}) a operador (${nombreNuevo})`;
                }
            }
        });
    
        // Si no hubo cambios y no se subió archivo, no hacer nada
        const noChanges = Object.keys(updatedFields).length === 0 && !file;
        if (noChanges) {
            alert("No se realizaron cambios.");
            return;
        }
    
        // Preparar FormData
        const formDataToSend = new FormData();
        for (const key in updatedFields) {
            formDataToSend.append(key, updatedFields[key as keyof Vehiculo] as string);
        }
        if (file) {
            formDataToSend.append("imagen_vehi", file);
        }
    
        try {
            // PATCH solo si hubo cambios
            await axios.patch(`http://localhost:8000/Vehiculos/update/${vehiculo.vehiculo_id}/`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
    
            // POST del movimiento
            await axios.post(`http://localhost:8000/Movimientos/create/`, {
                vehiculo_id: vehiculo.vehiculo_id,
                tipo_movimiento: "actualizacion",
                user_id: userId,
                motivo: operadorCambioMotivo || "Actualización general"
            });
    
            alert("Vehiculo actualizado con éxito");
            setEditable(false);
    
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            alert("Hubo un error al guardar los cambios.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Detalle de Vehículo</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Número de Unidad" name="num_unidad" value={formData?.num_unidad || ""} onChange={handleInputChange} editable={editable} />
                    <Field label="Número de Motor" name="num_serie" value={formData?.num_serie || ""} onChange={handleInputChange} editable={editable} />
                    <Field label="Placas" name="placas" value={formData?.placas || ""} onChange={handleInputChange} editable={editable} />

                    {editable ? (
                        <div>
                            <label className="block text-gray-700 font-semibold">Operador:</label>
                            <select
                                name="operador_id"
                                value={formData?.operador_id || 0}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                {operadores.map((operador) => (
                                    <option key={operador.operador_id} value={operador.operador_id}>{operador.nombre}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <Field label="Operador" name="operador_id" value={formData?.operador || ""} editable={false} />
                    )}

                    {editable ? (
                        <div>
                            <label className="block text-gray-700 font-semibold">Empresa:</label>
                            <select
                                name="empresa_id"
                                value={formData?.empresa_id || 0}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                {empresas.map((empresa) => (
                                    <option key={empresa.empresa_id} value={empresa.empresa_id}>{empresa.nombre}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <Field label="Empresa" name="empresa_id" value={formData?.empresa || ""} editable={false} />
                    )}

                    <Field label="Marca" name="marca" value={formData?.marca || ""} onChange={handleInputChange} editable={editable} />
                    <Field label="Modelo" name="anio" value={formData?.anio || ""} onChange={handleInputChange} editable={editable} />
                    <Field label="Linea" name="linea" value={formData?.linea || ""} onChange={handleInputChange} editable={editable} />

                    <div className="flex justify-center flex-col items-center">
                        {editable && (
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-200 w-48"
                            />
                        )}
                        {formData?.imagen_vehi && (
                            <img
                                src={formData.imagen_vehi}
                                alt="Imagen"
                                className="mt-4 w-64 h-64 object-contain rounded-lg shadow-lg"
                            />
                        )}
                    </div>
                </div>

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