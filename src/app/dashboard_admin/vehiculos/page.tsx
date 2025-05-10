"use client";

import { useState } from "react";
import PantallaVehiculos from "./componentes/pantalla_vehiculos";  // Asegúrate de que el archivo se llame así
import VehiculoDetalle from "./componentes/vehiculo";              // Asegúrate de que el archivo se llame así
import Header_admin from "@/app/components/header_admin";

type Vehiculo = {
    vehiculo_id: number;
    num_serie: string;
    placas: string;
    operador_id: number;
    imagen_vehi: string;
    anio: number;
    empresa_id: number;
    marca: string;
    empresa: string;
    operador:string;
    linea:string;
    activo:string;
    num_unidad:string;
};

export default function Inventario() {
    const [modo, setModo] = useState<"listado" | "editar">("listado");  // Controla si muestra tabla o formulario
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);

    // Función que se pasa a PantallaVehiculos para activar el modo de edición
    const handleModificar = (vehiculo: Vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setModo("editar");
    };

    const handleCancelarEdicion = () => {
        setVehiculoSeleccionado(null);
        setModo("listado");
    };

    return (
        <div>
            <Header_admin />
            {modo === "listado" ? (
                <PantallaVehiculos onModificar={handleModificar} />
            ) : (
                <VehiculoDetalle vehiculo={vehiculoSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
