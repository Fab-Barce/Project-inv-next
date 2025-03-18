"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearUsuario() {
    const [nombre, setNombre] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [correo, setCorreo] = useState("");
    const [rol, setRol] = useState("visualizacion"); 
    const router = useRouter();

    const handleCrearUsuario = async () => {
        if (!nombre || !contrasena || !correo) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const nuevoUsuario = { 
            nombre, 
            contrasena, 
            correo, 
            rol 
        };

        try {
            const response = await fetch("http://localhost:8000/api/usuarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    contrasena,
                    correo,
                    rol
                })
            });
            

            const data = await response.json();

            if (response.ok) {
                alert("Usuario creado correctamente.");
                router.push("/dashboard_admin/users");  // Redirigir después de crear el usuario
            } else {
                alert(`Error: ${data.detail || "No se pudo crear el usuario."}`);
            }

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            alert("Error al conectar con el servidor.");
        }

        // Limpiar campos después de la creación
        setNombre("");
        setContrasena("");
        setCorreo("");
        setRol("visualizacion");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Crear Nuevo Usuario</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Nombre de Usuario:</label>
                    <input 
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Correo Electrónico:</label>
                    <input 
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Contraseña:</label>
                    <input 
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Rol:</label>
                    <select 
                        value={rol} 
                        onChange={(e) => setRol(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="visualizacion">Visualización</option>
                        <option value="modificacion">Modificación</option>
                    </select>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handleCrearUsuario}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full font-semibold"
                    >
                        Crear Usuario
                    </button>

                    <button
                        onClick={() => router.push("/dashboard_admin/users")}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full font-semibold"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
