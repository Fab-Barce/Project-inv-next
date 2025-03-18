"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para manejar la redirección
import PantallaUsuarios from "./componentes/pantalla_usuarios";
import Usuario from "./componentes/usuario";

type Usuario = {
    id: number;
    nombre: string;
    rol: "visualizacion" | "modificacion";
    username: string;
    password: string;
    correo: string;
};

export default function UsuariosPage() {
    const [modo, setModo] = useState<"listado" | "editar">("listado");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

    const router = useRouter(); // Hook para redirigir

    const handleModificar = (usuario: Usuario) => {
        setUsuarioSeleccionado(usuario);
        setModo("editar");
    };

    const handleCancelarEdicion = () => {
        setUsuarioSeleccionado(null);
        setModo("listado");
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl text-black font-bold">Gestión de Usuarios</h1>

            </div>

            {modo === "listado" ? (
                <PantallaUsuarios onModificar={handleModificar} />
            ) : (
                <Usuario usuario={usuarioSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
