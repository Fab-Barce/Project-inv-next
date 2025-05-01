"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "./components/header";
import { LockClosedIcon, UserIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Button from "@/app/components/Button";

export default function Login() {
    const [nombre, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [correo, setCorreo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Verificar si ya hay un token al cargar la página
    useEffect(() => {
        const checkExistingAuth = () => {
            try {
                const token = localStorage.getItem("token");
                const rol = localStorage.getItem("rol");
                
                console.log("Verificando autenticación existente:", { token, rol });
                
                if (token) {
                    // Verificar que el token sea válido (podrías hacer una llamada a la API aquí)
                    if (rol === "modificacion") {
                        console.log("Redirigiendo a dashboard");
                        router.push("/dashboard");
                    } else if (rol === "visualizacion") {
                        console.log("Redirigiendo a dashboard_v2");
                        router.push("/dashboard_v2");
                    } else if (rol === "superA" || rol === "admin") {
                        console.log("Redirigiendo a dashboard_admin");
                        router.push("/dashboard_admin");
                    } else {
                        console.log("Rol no reconocido:", rol);
                        // Si el rol no es reconocido, limpiar el token
                        localStorage.removeItem("token");
                        localStorage.removeItem("rol");
                    }
                }
            } catch (error) {
                console.error("Error al verificar autenticación:", error);
                // En caso de error, limpiar el almacenamiento
                localStorage.removeItem("token");
                localStorage.removeItem("rol");
            } finally {
                setIsCheckingAuth(false);
            }
        };
        
        checkExistingAuth();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        // Validar que todos los campos estén llenos
        if (!nombre.trim() || !correo.trim() || !contrasena.trim()) {
            setError("Por favor, complete todos los campos");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Intentando login con:", { nombre, correo });
            
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  nombre: nombre.trim(),
                  correo: correo.trim(),
                  password: contrasena,
                  
                }),
            });
              
            const data = await response.json();
              
            console.log("Respuesta completa del servidor:", data);
            console.log("Valor de activo:", data.activo);
            console.log("Tipo de activo:", typeof data.activo);
              
            if (response.ok) {
                // Normaliza el valor recibido para evitar problemas de espacios o mayúsculas
                const activoValue = (data.activo ?? "").toString().trim().toLowerCase();

                if (activoValue === "false" || activoValue === "0") {
                    console.log("Usuario inactivo detectado");
                    setError("El usuario ha sido eliminado. Por favor, contacte al administrador.");
                    setIsLoading(false);
                    return;
                }

                // Guardar token en localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("rol", data.rol);
                localStorage.setItem("nombre", nombre);
                
                // Guardar token en cookies para el middleware
                document.cookie = `token=${data.token}; path=/`;
                
                console.log("Login exitoso, redirigiendo según rol:", data.rol);
                
                // Redirigir según el rol
                if (data.rol === "modificacion") {
                  router.push("/dashboard");
                } else if (data.rol === "visualizacion") {
                  router.push("/dashboard_v2");
                } else if (data.rol === "superA" || data.rol === "admin") {
                  router.push("/dashboard_admin");
                } else {
                  setError("Rol no reconocido: " + data.rol);
                }
            } else {
                console.error("Error de login:", data);
                setError(data.message || "Credenciales incorrectas. Por favor, verifica tu nombre de usuario, correo y contraseña.");
            }
        } catch (error: any) {
            console.error("Error de login:", error);
            setError("Error en el servidor. Por favor, intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar indicador de carga mientras se verifica la autenticación
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />

            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white text-center">
                            <h2 className="text-2xl font-bold">Bienvenido</h2>
                            <p className="text-blue-100 mt-1">Inicia sesión para continuar</p>
                        </div>
                        
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            
                            <form onSubmit={handleLogin} className="space-y-6">
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
                                            onChange={(e) => setNombreUsuario(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                            placeholder="Ingresa tu nombre de usuario"
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
                                            placeholder="Ingresa tu correo electrónico"
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
                                            placeholder="Ingresa tu contraseña"
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
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    ¿Olvidaste tu contraseña? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Ponte en contacto con el administrador</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>© {new Date().getFullYear()} Sistema de Inventario. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
