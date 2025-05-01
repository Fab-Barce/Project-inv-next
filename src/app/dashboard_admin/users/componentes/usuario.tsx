"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/Button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type Usuario = {
    user_id: number;
    nombre: string;
    correo: string; // Campo de correo añadido
    rol: "visualizacion" | "modificacion";
    contrasena: string;
  };
  

type Props = {
    usuario: Usuario | null;
    onCancelar: () => void;
};

export default function Usuario({ usuario, onCancelar }: Props) {
    const [formData, setFormData] = useState<Usuario>({
        user_id: 0,
        nombre: "",
        correo: "", // Inicialización del campo correo
        rol: "visualizacion",
        contrasena: ""
    });

    const [originalData, setOriginalData] = useState<Usuario | null>(null);
    const [editable, setEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (usuario) {
            setFormData(usuario);
            setOriginalData(usuario);
        }
    }, [usuario]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getChangedFields = () => {
        if (!originalData) return {};

        const changes: Partial<Usuario> = {};

        for (const key in formData) {
            const typedKey = key as keyof Usuario;
            if (formData[typedKey] !== originalData[typedKey]) {
                (changes[typedKey] as any) = formData[typedKey];
            }
        }

        return changes;
    };

    const handleGuardar = async () => {
        const changes = getChangedFields();

        if (Object.keys(changes).length === 0) {
            alert("No hay cambios para actualizar.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/usuarios/update/${formData.user_id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(changes)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el usuario");
            }

            alert("Usuario actualizado con éxito");
            setEditable(false);
            setOriginalData(formData);
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Hubo un error al actualizar el usuario.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalles del Usuario</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />
                <Field label="Correo" name="correo" value={formData.correo} onChange={handleInputChange} editable={editable} />
                <div>
                    <label className="block text-gray-700 font-semibold">Rol:</label>
                    <select
                        name="rol"
                        value={formData.rol}
                        onChange={handleInputChange}
                        disabled={!editable}
                        className={`w-full p-2 border rounded-md ${editable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                    >
                        <option value="visualizacion">Visualización</option>
                        <option value="modificacion">Modificación</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold">Contraseña:</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleInputChange}
                            disabled={!editable}
                            className={`w-full p-2 border rounded-md ${editable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
                        />
                        {editable && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <Button
                    variant="green"
                    onClick={handleGuardar}
                    disabled={!editable}
                >
                    Guardar
                </Button>
                <Button
                    variant="teal"
                    onClick={() => {
                        setEditable(!editable);
                        if (!editable) {
                            setShowPassword(false);
                        }
                    }}
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
