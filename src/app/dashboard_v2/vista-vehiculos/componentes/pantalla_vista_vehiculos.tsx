"use client";

import { useState } from "react";
import Link from "next/link"; // Para el botón de regreso

type Vehiculo = {
    id: number;
    modelo: string;
    marca: string;
    año: number;
    color: string;
    placa: string;
    empresa: string;
    descripcion: string;
};

type Props = {
    onVerDetalles: (vehiculo: Vehiculo) => void;
};

export default function Pantalla_vehiculos({ onVerDetalles }: Props) {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([
        {
            id: 1,
            modelo: "Camioneta Ford",
            marca: "Ford",
            año: 2020,
            color: "Blanco",
            placa: "ABC-123",
            empresa: "Empresa A",
            descripcion: "Camioneta de transporte de carga."
        },
        {
            id: 2,
            modelo: "Toyota Hilux",
            marca: "Toyota",
            año: 2019,
            color: "Gris",
            placa: "XYZ-456",
            empresa: "Empresa B",
            descripcion: "Vehículo de uso comercial."
        },
    ]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Título y Botón de Regreso */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl text-black font-bold">Vehículos</h1>
                <Link href="/dashboard">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Volver
                    </button>
                </Link>
            </div>

            {/* Tabla de vehículos */}
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-2 text-left">Modelo</th>
                            <th className="px-4 py-2">Marca</th>
                            <th className="px-4 py-2">Año</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id}>
                                <td>
                                    <button
                                        onClick={() => onVerDetalles(vehiculo)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {vehiculo.modelo}
                                    </button>
                                </td>
                                <td className="text-center">{vehiculo.marca}</td>
                                <td className="text-center">{vehiculo.año}</td>
                                <td className="text-center">👁️ Ver</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {vehiculos.length === 0 && (
                <div className="mt-4 text-gray-500">
                    No hay vehículos en el sistema.
                </div>
            )}
        </div>
    );
}
