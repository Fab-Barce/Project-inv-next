import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

type Operador = {
    operador_id: number;
    nombre: string;
    empresa_id: number;
    empresa: string;
};

type Empresa = {
    empresa_id: number;
    nombre: string;
};

type Props = {
    operador: Operador | null;
    onCancelar: () => void;
};

export default function OperadorDetalle({ operador, onCancelar }: Props) {
    const [formData, setFormData] = useState<Operador>({
        operador_id: 0,
        nombre: "",
        empresa_id: 0,
        empresa: "",
    });

    const [editable, setEditable] = useState(false); // Controla si los campos son editables
    const [originalData, setOriginalData] = useState<Operador | null>(null);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    useEffect(() => {
        if (operador) {
            setFormData(operador);
            setOriginalData(operador);
        }
    }, [operador]);

    useEffect(() => {
        axios.get("http://localhost:8000/Empresas/")
        .then (response => {
            setEmpresas(response.data)
        }) 
    },[])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getChangedFields = () => {
        if (!originalData) return {};
    
        const changes: Partial<Operador> = {};
    
        for (const key in formData) {
            const formValue = formData[key as keyof Operador];
            const originalValue = originalData[key as keyof Operador];
        
            // Convertir ambos valores a string para comparación precisa
            if (String(formValue) !== String(originalValue)) {
                changes[key as keyof Operador] = formValue as Operador[keyof Operador];
            }
        }
    
        return changes;
    };

    const handleActualizar = async () => {
        const changes = getChangedFields();
        if (Object.keys(changes).length === 0) {
            alert("No hay cambios para actualizar.");
            return;
        }
        try {
            await axios.put(
                `http://localhost:8000/Operadores/update/${formData.operador_id}/`,
                changes
            );
            alert("Operador actualizado con éxito.");
            setEditable(false);
            setOriginalData(formData); // Actualizar originalData después de la actualización
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Hubo un error al actualizar la categoria.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Operador</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />

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
            </div>

            <div className="flex space-x-3 mt-6">
                <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={() => setEditable(!editable)}
                >
                    {editable ? "Bloquear" : "Modificar"}
                </button>

                <button
                    type="button"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={handleActualizar}
                    disabled={!editable}
                >
                    Guardar
                </button>

                <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>

                <Link href="/dashboard_admin/vehiculos">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Volver
                    </button>
                </Link>
            </div>
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
