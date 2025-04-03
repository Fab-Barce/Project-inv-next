"use client";

import { useState } from "react";
import Pantalla_vehiculos from "./componentes/pantalla_vista_vehiculos";
import Vista_vehiculo from "./componentes/vista_vehiculo";
import Headerv2 from "@/app/components/headerv2";

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
};


export default function Vehiculos() {
    const [modo, setModo] = useState<"listado" | "ver">("listado");  
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);

    const handleVerDetalles = (vehiculo: Vehiculo) => {
        setVehiculoSeleccionado(vehiculo);
        setModo("ver");
    };

    const handleCancelar = () => {
        setVehiculoSeleccionado(null);
        setModo("listado");
    };

    return (
        <div>
            <Headerv2 />
            {modo === "listado" ? (
                <Pantalla_vehiculos onVerDetalles={handleVerDetalles} />
            ) : (
                <Vista_vehiculo vehiculo={vehiculoSeleccionado} onCancelar={handleCancelar} />
            )}
        </div>
    );
}
