"use client";

import { useState } from "react";

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

type Props = {
    onModificar: (vehiculo: Vehiculo) => void;
};

export default function PantallaVehiculos({ onModificar }: Props) {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([
        {
            id: 1,
            num_serie: 1234,
            placas: "ASDC245",
            operador: "Jose",
            imagen: "imagen1.png",
            anio: 2019,
            empresa: "Empresa1",
            marca: "Marca X",
        },
        {
            id: 2,
            num_serie: 4321,
            placas: "NMSX234",
            operador: "Juan",
            imagen: "imagen2.png",
            anio: 2018,
            empresa: "Empresa2",
            marca: "Marca Y",
        },
    ]);

    const handleEliminar = (id: number) => {
        const confirmar = confirm(`¿Estás seguro de eliminar el vehículo con ID ${id}?`);
        if (confirmar) {
            setVehiculos(vehiculos.filter(v => v.id !== id));
            alert(`Vehículo con ID ${id} eliminado.`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-xl text-black font-bold mb-4">Inventario de Vehículos</h1>

            <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">

                <button className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    <span>Nuevo</span>
                    <span>+</span>
                </button>

                <div className="flex ml-auto space-x-2">
                    <div className="flex text-black items-center border rounded px-2">
                        <input
                            type="text"
                            placeholder="Buscar"
                            className="outline-none py-1 bg-transparent"
                        />
                        <span>🔍</span>
                    </div>
                </div>
            </div>

            {/* Tabla de vehículos */}
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-2 text-left">Número de Serie</th>
                            <th className="px-4 py-2 text-center">Placas</th>
                            <th className="px-4 py-2 text-center">Operador</th>
                            <th className="px-4 py-2 text-center">Empresa</th>
                            <th className="px-4 py-2 text-center">Marca</th>
                            <th className="px-4 py-2 text-center">Año</th>
                            <th className="px-4 py-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id} className="border-b">
                                <td className="px-4 py-2">
                                    <button 
                                        onClick={() => onModificar(vehiculo)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {vehiculo.num_serie}
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center">{vehiculo.placas}</td>
                                <td className="px-4 py-2 text-center">{vehiculo.operador}</td>
                                <td className="px-4 py-2 text-center">{vehiculo.empresa}</td>
                                <td className="px-4 py-2 text-center">{vehiculo.marca}</td>
                                <td className="px-4 py-2 text-center">{vehiculo.anio}</td>
                                <td className="px-4 py-2 flex space-x-2 justify-center">
                                    <button
                                        onClick={() => handleEliminar(vehiculo.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Eliminar X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {vehiculos.length === 0 && (
                <div className="mt-4 text-gray-500">
                    No hay vehículos en el inventario.
                </div>
            )}
        </div>
    );
}
