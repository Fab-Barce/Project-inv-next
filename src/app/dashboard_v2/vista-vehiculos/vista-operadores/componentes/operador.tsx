import React, { useState, useEffect } from "react";
import Link from "next/link";

type Operador = {
    operador_id: number;
    nombre: string;
    empresa_id: number;
    empresa: string;
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

    useEffect(() => {
        if (operador) {
            setFormData(operador);
        }
    }, [operador]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Operador</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />

                <div>
                    <label className="block text-gray-700 font-semibold">Empresa:</label>
                    <select
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        disabled={!editable}
                        className={`w-full p-2 border rounded-md ${editable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                    >
                        <option value="Empresa A">Empresa A</option>
                        <option value="Empresa B">Empresa B</option>
                    </select>
                </div>
            </div>

            <div className="flex space-x-3 mt-6">


                <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={onCancelar}
                >
                    Volver
                </button>

                <Link href="/dashboard_v2/vista-vehiculos">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Volver a vehiculos
                    </button>
                </Link>
            </div>
        </div>
    );
}

type FieldProps = {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editable: boolean;
};

const Field = ({ label, name, value, onChange, editable }: FieldProps) => (
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