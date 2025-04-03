"use client";

import { useState } from "react";
import PantallaCategoria from "./componentes/pant2";  // Asegúrate de que el archivo se llame así
import CategoriaDetalle from "./componentes/cat2";              // Asegúrate de que el archivo se llame así
import Headerv2 from "@/app/components/headerv2";


type Categoria = {
    categoria_id: number;
    nombre: string;
    descripcion: string;
  };
export default function Inventario() {
    const [modo, setModo] = useState<"listado" | "editar">("listado");  // Controla si muestra tabla o formulario
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Categoria | null>(null);

    // Función que se pasa a PantallaVehiculos para activar el modo de edición
    const handleModificar = (categoria: Categoria) => {
        setVehiculoSeleccionado(categoria);
        setModo("editar");
    };

    const handleCancelarEdicion = () => {
        setVehiculoSeleccionado(null);
        setModo("listado");
    };

    return (
        <div>
            <Headerv2 />
            {modo === "listado" ? (
                <PantallaCategoria onModificar={handleModificar} />
            ) : (
                <CategoriaDetalle categoria={vehiculoSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
