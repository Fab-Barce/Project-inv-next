"use client";

import { useState } from "react";
import Pantalla_vehiculos from "./componentes/pantalla_vista_vehiculos";
import Vista_vehiculo from "./componentes/vista_vehiculo";
import Header_viewer from "@/app/components/header_viewer";

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
            <Header_viewer />
            {modo === "listado" ? (
                <Pantalla_vehiculos onModificar={handleModificar} />
            ) : (
                <Vista_vehiculo vehiculo={vehiculoSeleccionado} onCancelar={handleCancelarEdicion}/>
            )}
        </div>
    );
}
