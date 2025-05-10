"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Header_admin from "@/app/components/header_admin";

export default function CrearUsuario() {
    const [nombre, setNombre] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [correo, setCorreo] = useState("");
    const [rol, setRol] = useState("visualizacion");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useRouter();

    const handleCrearUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        if (!nombre.trim() || !contrasena.trim() || !correo.trim()) {
            setError("Por favor, complete todos los campos");
            setIsLoading(false);
            return;
        }

        const nuevoUsuario = { 
            nombre: nombre.trim(), 
            contrasena, 
            correo: correo.trim(), 
            rol 
        };

        try {
            const response = await fetch("http://localhost:8000/api/usuarios/create/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Usuario creado correctamente");
                // Limpiar el formulario
                setNombre("");
                setContrasena("");
                setCorreo("");
                setRol("visualizacion");
                // Mostrar alerta y redirigir después de 2 segundos
                window.alert("Usuario creado correctamente");
                setTimeout(() => {
                    router.push("/dashboard_admin/users");
                }, 2000);
            } else {
                setError(data.detail || "No se pudo crear el usuario");
            }
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            setError("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header_admin />
            
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white text-center">
                            <h2 className="text-2xl font-bold">Crear Nuevo Usuario</h2>
                            <p className="text-blue-100 mt-1">Complete los datos del nuevo usuario</p>
                        </div>
                        
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            
                            {success && (
                                <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                                    <p className="text-sm">{success}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleCrearUsuario} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de Usuario
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                            placeholder="Ingrese el nombre de usuario"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                            placeholder="Ingrese el correo electrónico"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={contrasena}
                                            onChange={(e) => setContrasena(e.target.value)}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                            placeholder="Ingrese la contraseña"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rol del Usuario
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            value={rol}
                                            onChange={(e) => setRol(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none bg-white"
                                            required
                                        >
                                            <option value="visualizacion">Visualización</option>
                                            <option value="modificacion">Modificación</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {isLoading ? 'Creando...' : 'Crear Usuario'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => router.push("/dashboard_admin/users")}
                                        className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

