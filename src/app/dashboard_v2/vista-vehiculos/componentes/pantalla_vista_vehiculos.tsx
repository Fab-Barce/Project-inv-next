"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Para el botón de regreso

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

type Props = {
    onVerDetalles: (vehiculo: Vehiculo) => void;
};

export default function Pantalla_vehiculos({ onVerDetalles }: Props) {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

    useEffect(() => {
    const fetchVehiculos = async () => {
        try {
        const response = await fetch("http://localhost:8000/Vehiculos/");
        if (!response.ok) {
            throw new Error("Error al obtener los vehiculos");
        }
        const data = await response.json();
        console.log("Datos recibidos de la API:", data); // Debug
        setVehiculos(data);
        } catch (error) {
        console.error("Error al obtener vehiculos:", error);
        }
    };
    fetchVehiculos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Título y Botón de Regreso */}
            
                <h1 className="text-xl text-black font-bold mb-4">Vehículos</h1>



                <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">

                    <Link href="/dashboard_v2/vista-vehiculos/vista-operadores">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                            Operadores
                        </button>
                    </Link>



                    <Link href="/dashboard_v2">
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
                            <tr key={vehiculo.vehiculo_id} className="border-b">
                                <td className="px-4 py-2">{vehiculo.marca}</td>
                                <td className="px-4 py-2 text-center">{vehiculo.anio}</td>
                                <td className="px-4 py-2 text-center">{vehiculo.placas}</td>
                                <td className="px-4 py-2 text-center">
                                    <button 
                                        onClick={() => onVerDetalles(vehiculo)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
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
