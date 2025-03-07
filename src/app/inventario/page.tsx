"use client";

import { useState } from "react";
import Pantalla_refacciones from "./componentes/pantalla_refacciones";
import Refaccion from "./componentes/refaccion";

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
};

export default function Inventario() {
    const [modo, setModo] = useState<"listado" | "editar">("listado");  // Controla si muestra tabla o formulario
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

    // Función que se pasa a PantallaRefacciones para activar el modo de edición
    const handleModificar = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setModo("editar");
    };

    const handleCancelarEdicion = () => {
        setProductoSeleccionado(null);
        setModo("listado");
    };

    return (
        <div>
            {modo === "listado" ? (
                <Pantalla_refacciones onModificar={handleModificar} />
            ) : (
                <Refaccion producto={productoSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
