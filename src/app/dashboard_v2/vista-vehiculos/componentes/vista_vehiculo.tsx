import axios from "axios";
import React, { useState, useEffect } from "react";

type Empresa = {
    empresa_id: number;
    nombre: string;
};

type Operador = {
    operador_id: number;
    nombre: string;
    empresa_id: number;
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
                setOperadores(response.data)
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
        Object.keys(formData).forEach(key => {
            if (formData[key as keyof Vehiculo] !== initialData?.[key as keyof Vehiculo]) {
                updatedFields[key as keyof Vehiculo] = formData[key as keyof Vehiculo];
            }
        });

        const formDataToSend = new FormData();
        for (const key in updatedFields) {
            formDataToSend.append(key, updatedFields[key as keyof Vehiculo] as string);
        }
        if (file) {
            formDataToSend.append("imagen_vehi", file);
        }

        try {
            await axios.patch(`http://localhost:8000/Vehiculos/update/${vehiculo.vehiculo_id}/`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            try {
                axios.post(`http://localhost:8000/Movimientos/create/`,
                    {
                        vehiculo_id: vehiculo.vehiculo_id,
                        tipo_movimiento: "actualizacion",
                        user_id: userId,
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

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Detalle de Vehículo</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Número de Serie" name="num_serie" value={formData?.num_serie || ""} onChange={handleInputChange} editable={editable} />
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
                    <Field label="Año" name="anio" value={formData?.anio || ""} onChange={handleInputChange} editable={editable} />

                    <div className="flex justify-center flex-col items-center">
                        {editable && (
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-200"
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
                   

                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
                        onClick={onCancelar}
                    >
                        Volver
                    </button>
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
