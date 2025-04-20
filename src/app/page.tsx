"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Para el botón de regreso
import Header from "./components/header"; // Importamos el Header


export default function Login() {
    const [nombre, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [correo, setCorreo] = useState("");

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        setError(null);  // Limpiar errores previos
        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",  // Asegúrate de enviar JSON
                },
                body: JSON.stringify({
                  nombre: nombre,
                  correo: correo,
                  password: contrasena,   // La contraseña

                }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                // El login fue exitoso, puedes almacenar el token
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("rol", data.rol);
                // Redirige al usuario según el rol
                if (data.rol === "modificacion") {
                  router.push("/dashboard");
                } else if (data.rol === "visualizacion") {
                  router.push("/dashboard_v2");
                }  else if (data.rol === "superA") {
                    router.push("/dashboard_admin");
                }
              } else {
                alert("Usuario o contraseña incorrectos.");
              }
              
        } catch (error: any) {
            setError(error.message || "Error en el servidor");
        }
        
    };

    return (
        <div>
            <Header />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Iniciar Sesión</h2>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre de Usuario:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombreUsuario(e.target.value)}
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

                    <button
                        onClick={handleLogin}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full font-semibold"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
