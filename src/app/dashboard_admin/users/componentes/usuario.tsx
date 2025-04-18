"use client";

import { useState, useEffect } from "react";
import Button from "@/app/components/Button";

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

    const [editable, setEditable] = useState(false);

    useEffect(() => {
        if (usuario) {
            setFormData(usuario);
        }
    }, [usuario]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalles del Usuario</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />
                <Field label="Correo" name="correo" value={formData.correo} onChange={handleInputChange} editable={editable} /> {/* Campo de correo añadido */}
                <Field label="Rol" name="rol" value={formData.rol} onChange={handleInputChange} editable={editable} />
                <Field label="Contraseña" name="password" value={formData.contrasena} onChange={handleInputChange} editable={editable} />
            </div>

            <div className="flex justify-end space-x-3 mt-6">

            <Button
                    variant="green"
                    onClick={() => alert("Guardado")}
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
