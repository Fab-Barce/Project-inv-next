"use client";

import { useState } from "react";
import Link from "next/link";

type Producto = {
    id: number;
    nombre: string;
    categoria: string;
    stock_minimo: number;
    descripcion: string;
    unidad: string;
    proveedor: string;
    imagen: string;
    cantidad: number;
    empresa: string;
    numero_parte: string;
    costo: number;
    marca: string;
};

type Props = {
    onModificar: (producto: Producto) => void;
};

export default function Pantalla_Vista_Refacciones({ onModificar }: Props) {
    const [productos] = useState<Producto[]>([
        {
            id: 1,
            nombre: "Refacción A",
            cantidad: 6,
            categoria: "Categoría 1",
            stock_minimo: 5,
            descripcion: "Descripción de Refacción A",
            unidad: "Unidad 1",
            proveedor: "Proveedor X",
            imagen: "imagen_a.png",
            empresa: "empresa 1",
            numero_parte: "parte 31231",
            costo: 100,
            marca: "Marca x",
        },
        {
            id: 2,
            nombre: "Refacción B",
            cantidad: 7,
            categoria: "Categoría 2",
            stock_minimo: 3,
            descripcion: "Descripción de Refacción B",
            unidad: "Unidad 2",
            proveedor: "Proveedor Y",
            imagen: "imagen_b.png",
            empresa: "empresa 2",
            numero_parte: "parte 12321",
            costo: 234,
            marca: "Marca y",
        },
    ]);

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-xl text-black font-bold mb-4">Inventario de Refacciones (Solo Vista)</h1>

            <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">

                <Link href="/dashboard_v2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Volver
                    </button>
                </Link> 
                
            </div>

            {/* Tabla de productos */}
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2">Categoría</th>
                            <th className="px-4 py-2">Cantidad</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id} className="border-b">
                                <td className="px-4 py-2">{producto.nombre}</td>
                                <td className="px-4 py-2 text-center">{producto.categoria}</td>
                                <td className="px-4 py-2 text-center">{producto.cantidad}</td>
                                <td className="px-4 py-2 text-center">
                                    <button 
                                        onClick={() => onModificar(producto)}
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

            {productos.length === 0 && (
                <div className="mt-4 text-gray-500">
                    No hay refacciones disponibles para visualizar.
                </div>
            )}
        </div>
    );
}
