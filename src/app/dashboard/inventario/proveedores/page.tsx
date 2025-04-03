"use client";

import { useState } from "react";
import PantallaProveedor from "./componentes/pantalla_proveedores";  // Asegúrate de que el archivo se llame así
import ProveedorDetalle from "./componentes/proveedor";              // Asegúrate de que el archivo se llame así
import Headerv2 from "@/app/components/headerv2";


type Proveedor = {
    proveedor_id: number;
    nombre: string;
    direccion: string;
    RFC: string;
    nombre_representante: string;
    descripcion: string;
    num_telef: string;
};


export default function Inventario() {
    const [modo, setModo] = useState<"listado" | "editar">("listado");  // Controla si muestra tabla o formulario
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Proveedor | null>(null);

    // Función que se pasa a PantallaVehiculos para activar el modo de edición
    const handleModificar = (proveedor: Proveedor) => {
        setVehiculoSeleccionado(proveedor);
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
                <PantallaProveedor onModificar={handleModificar} />
            ) : (
                <ProveedorDetalle proveedor={vehiculoSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
