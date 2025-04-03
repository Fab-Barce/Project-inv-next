"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

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
        const confirmar = confirm(
          "¿Estás seguro de eliminar los operadores seleccionados?"
        );
        if (confirmar) {
            for (var i = 0; i < selectedItems.length; i+=1)
            {
            axios.delete(`http://localhost:8000/Operadores/delete/${selectedItems[i]}/`)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
            }
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
                <Link href="/dashboard_admin/vehiculos/operadores/nuevo">
                    <button className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Nuevo
                    </button>
                </Link>

                {/* Botón para activar/desactivar el modo eliminación */}
                <button
                    onClick={() => {
                        setDeleteMode(!deleteMode);
                        setSelectedItems([]); // Reiniciamos la selección al cambiar de modo
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    {deleteMode ? "Cancelar Eliminación" : "Eliminar"}
                </button>

                {/* Botón para confirmar eliminación en modo borrado */}
                {deleteMode && (
                    <button
                        onClick={handleBulkDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        disabled={selectedItems.length === 0}
                    >
                        Confirmar Eliminación
                    </button>
                )}

                <Link href="/dashboard_admin">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Volver
                    </button>
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
                                        <button
                                            onClick={() => onModificar(operador)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            Ver Detalles
                                        </button>
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