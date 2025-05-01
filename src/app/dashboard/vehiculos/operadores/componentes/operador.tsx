import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/app/components/Button";

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

    const [editable, setEditable] = useState(false);
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
            .then(response => {
                setEmpresas(response.data)
            });
    }, []);

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
            setOriginalData(formData);
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Hubo un error al actualizar el operador.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
                <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Detalle de Operador</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        editable={editable}
                    />

                    {editable ? (
                        <div>
                            <label className="block text-gray-700 font-semibold">Empresa:</label>
                            <select
                                name="empresa_id"
                                value={formData.empresa_id}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                {empresas.map((empresa: Empresa) => (
                                    <option key={empresa.empresa_id} value={empresa.empresa_id}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <Field
                            label="Empresa"
                            name="empresa"
                            value={formData.empresa}
                            editable={false}
                        />
                    )}
                </div>

                <div className="flex justify-end space-x-4 mt-10">
                    <Button
                        variant="green"
                        onClick={handleActualizar}
                        disabled={!editable}
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