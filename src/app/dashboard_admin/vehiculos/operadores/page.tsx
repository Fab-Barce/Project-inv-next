"use client";

import { useState } from "react";
import PantallaOperador from "./componentes/pantalla_operadores";  // Asegúrate de que el archivo se llame así
import OperadorDetalle from "./componentes/operador";              // Asegúrate de que el archivo se llame así
import Header_admin from "@/app/components/header_admin";


type Operador = {
  id: number;
  nombre: string;
  unidad: string;
  empresa: string;

};
export default function Inventario() {
    const [modo, setModo] = useState<"listado" | "editar">("listado");  // Controla si muestra tabla o formulario
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Operador | null>(null);

    // Función que se pasa a PantallaVehiculos para activar el modo de edición
    const handleModificar = (operador: Operador) => {
        setVehiculoSeleccionado(operador);
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
                <PantallaOperador onModificar={handleModificar} />
            ) : (
                <OperadorDetalle operador={vehiculoSeleccionado} onCancelar={handleCancelarEdicion} />
            )}
        </div>
    );
}
