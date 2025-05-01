"use client";

import { useState } from "react";
import Pantalla_refacciones from "./componentes/pantalla_refacciones";
import Refaccion from "./componentes/refaccion";
import Headerv2 from "@/app/components/headerv2";

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
            <Headerv2 />
            
            {modo === "listado" ? (
                <Pantalla_refacciones onModificar={handleModificar} />
            ) : (
                <Refaccion producto={productoSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
