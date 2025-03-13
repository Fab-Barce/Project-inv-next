"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importar el enrutador

export default function Login() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const router = useRouter(); // Instancia del enrutador

    const handleLogin = () => {
        // Simulación de autenticación (remplaza esto con tu lógica real)
        const usuarios = [
            { nombre: "admin", contrasena: "1234", rol: "modificacion" }, 
            { nombre: "viewer", contrasena: "4321", rol: "visualizacion" },
            { nombre: "Sadmin", contrasena: "9876", rol: "SuperA" }  // Super Administrador
        ];

        const usuarioValido = usuarios.find(user => 
            user.nombre === nombreUsuario && user.contrasena === contrasena
        );

        if (usuarioValido) {
            if (usuarioValido.rol === "modificacion") {
                router.push("/dashboard");
            } else if (usuarioValido.rol === "visualizacion") {
                router.push("/dashboard_v2");
            } else if (usuarioValido.rol === "SuperA") {
                router.push("/dashboard_admin");  // Redirección al panel de superadministrador
            }
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Iniciar Sesión</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Nombre de Usuario:</label>
                    <input
                        type="text"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
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
    );
}
