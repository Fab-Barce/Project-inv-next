"use client";

import { useState } from "react";
import PantallaVehiculos from "./componentes/pantalla_vehiculos";  // Asegúrate de que el archivo se llame así
import VehiculoDetalle from "./componentes/vehiculo";              // Asegúrate de que el archivo se llame así
import Headerv2 from "@/app/components/headerv2";

type Vehiculo = {
    id: number;
    num_serie: number;
    placas: string;
    operador: string;
    imagen: string;
    anio: number;
    empresa: string;
    marca: string;
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
            <Headerv2 />
            {modo === "listado" ? (
                <PantallaVehiculos onModificar={handleModificar} />
            ) : (
                <VehiculoDetalle vehiculo={vehiculoSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
