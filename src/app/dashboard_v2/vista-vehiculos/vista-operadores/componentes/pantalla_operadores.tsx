"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Button from "@/app/components/Button";

type Operador = {
    operador_id: number;
    nombre: string;
    // unidad: string;
    empresa: string;
};

type Props = {
    onModificar: (operador: Operador) => void;
};

export default function PantallaOperador({ onModificar }: Props) {
    const [operadores, setOperadores] = useState<Operador[]>([]);

    // Estado para el modo eliminación y los elementos seleccionados
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        axios.get("http://localhost:8000/Operadores/")
        .then (response => {
            setOperadores(response.data)
        }) 
    },[])

    // Seleccionar o deseleccionar un operador para eliminación
    const handleSelect = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Eliminación en lote de los operadores seleccionados
    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        const confirmar = confirm("¿Estás seguro de eliminar los operadores seleccionados?");
        if (confirmar) {
            setOperadores(operadores.filter((v) => !selectedItems.includes(v.operador_id)));
            setSelectedItems([]);
            setDeleteMode(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Título */}
            <h1 className="text-xl text-black font-bold mb-4">Operadores</h1>

            {/* Área de botones */}
            <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">

                <Link href="/dashboard_v2/vista-vehiculos/">
                    <Button variant="blue">
                        Volver
                    </Button>
                </Link>

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

            {/* Tabla de operadores */}
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            {/* Mostrar columna para checkboxes en modo eliminación */}
                            {deleteMode && <th className="px-4 py-2"></th>}
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Unidad</th>
                            <th className="px-4 py-2 text-left">Empresa</th>
                            {!deleteMode && <th className="px-4 py-2 text-center">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {operadores.map((operador) => (
                            <tr key={operador.operador_id} className="border-b">
                                {deleteMode && (
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(operador.operador_id)}
                                            onChange={() => handleSelect(operador.operador_id)}
                                        />
                                    </td>
                                )}
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => onModificar(operador)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {operador.nombre}
                                    </button>
                                </td>
                                <td className="px-4 py-2">NA</td>
                                <td className="px-4 py-2">{operador.empresa}</td>
                                {!deleteMode && (
                                    <td className="px-4 py-2 flex space-x-2 justify-center">
                                        <Button
                                            onClick={() => onModificar(operador)}
                                            variant="blue"
                                            size="small"
                                        >
                                            Ver Detalles
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {operadores.length === 0 && (
                <div className="mt-4 text-gray-500">No hay operadores registrados.</div>
            )}
        </div>
    );
}
