"use client";

import { useState } from "react";

type Usuario = {
    id: number;
    nombre: string;
    rol: "visualizacion" | "modificacion";
    username: string;
    password: string;
};

type Props = {
    onModificar: (usuario: Usuario) => void;
};

export default function PantallaUsuarios({ onModificar }: Props) {
    const [usuarios, setUsuarios] = useState<Usuario[]>([
        { id: 1, nombre: "Juan Pérez", rol: "visualizacion", username: "juanp", password: "1234" },
        { id: 2, nombre: "Jose Carlos", rol: "modificacion", username: "josec", password: "abcd" }
    ]);

    const handleEliminar = (id: number) => {
        const confirmar = confirm(`¿Estás seguro de eliminar al usuario con ID ${id}?`);
        if (confirmar) {
            setUsuarios(usuarios.filter(u => u.id !== id));
            alert(`Usuario con ID ${id} eliminado.`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-xl text-black font-bold mb-4">Gestión de Usuarios</h1>

            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2">Rol</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>
                                    <button onClick={() => onModificar(usuario)} className="text-blue-500 hover:underline">
                                        {usuario.nombre}
                                    </button>
                                </td>
                                <td className="text-center">{usuario.rol}</td>
                                <td className="flex space-x-2">
                                    <button
                                        onClick={() => handleEliminar(usuario.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {usuarios.length === 0 && (
                <div className="mt-4 text-gray-500">
                    No hay usuarios registrados.
                </div>
            )}
        </div>
    );
}
