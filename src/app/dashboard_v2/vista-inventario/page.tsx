"use client";

import { useState } from "react";
import Pantalla_Vista_Refacciones from "./componentes/pantalla_vista_refacciones";
import VistaRefaccion from "./componentes/vista_refaccion"; // Cambiado para solo visualización
import Headerv2 from "@/app/components/headerv2";

type Producto = {
    id: number;
    nombre: string;
    categoria: string;
    stock_minimo: number;
    descripcion: string;
    unidad: string;
    proveedor: string;
    imagen: string;
    cantidad: number;
    empresa: string;
    numero_parte: string;
    costo: number,
    marca: string,
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
            <Headerv2 />
            {modo === "listado" ? (
                <Pantalla_Vista_Refacciones onModificar={handleVer} />
            ) : (
                <VistaRefaccion producto={productoSeleccionado} onCancelar={handleCancelarVista} />
            )}
        </div>
    );
}
