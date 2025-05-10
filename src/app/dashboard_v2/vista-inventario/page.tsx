"use client";

import { useState } from "react";
import Pantalla_Vista_Refacciones from "./componentes/pantalla_vista_refacciones";
import VistaRefaccion from "./componentes/vista_refaccion"; // Cambiado para solo visualización
import Header_viewer from "@/app/components/header_viewer";

type Producto = {
    refaccion_id: number;
    proveedor_id: string;
    vehiculo_id: string;
    numero_parte: string;
    nombre: string;
    cantidad: number;
    stock_minimo: number;
    costo: number;
    categoria_id: string;
    imagen_refa: string;
    empresa_id: string;
    categoria: string;
    proveedor: string;
    empresa: string;
    marca: string;
};

export default function Inventario() {
    const [modo, setModo] = useState<"listado" | "ver">("listado"); // Cambiado "editar" por "ver"
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

    // Función que se pasa a PantallaRefacciones para activar el modo de visualización
    const handleVer = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setModo("ver"); // Se cambia a modo visualización
    };

    const handleCancelarVista = () => {
        setProductoSeleccionado(null);
        setModo("listado");
    };

    return (
        <div>
            <Header_viewer />
            {modo === "listado" ? (
                <Pantalla_Vista_Refacciones onModificar={handleVer} />
            ) : (
                <VistaRefaccion producto={productoSeleccionado} onCancelar={handleCancelarVista} />
            )}
        </div>
    );
}
