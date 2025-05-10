"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para manejar la redirección
import PantallaUsuarios from "./componentes/pantalla_usuarios";
import Usuario from "./componentes/usuario";
import Header_admin from "@/app/components/header_admin";

type Usuario = {
    user_id: number;
    nombre: string;
    correo: string; // Campo de correo añadido
    rol: "visualizacion" | "modificacion";
    contrasena: string;
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
        <div>
            <Header_admin />
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-4">

                </div>

                {modo === "listado" ? (
                    <PantallaUsuarios onModificar={handleModificar} />
                ) : (
                    <Usuario usuario={usuarioSeleccionado} onCancelar={handleCancelarEdicion} />
                )}
            </div>
        </div>
    );
}
