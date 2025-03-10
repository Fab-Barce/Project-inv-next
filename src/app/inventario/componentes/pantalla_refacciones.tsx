"use client";

import { useState } from "react";

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

export default function Pantalla_refacciones ({ onModificar }: Props){
    const [productos, setProductos] = useState<Producto[]>([
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
            costo: 100.00,
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
            marca: "Marca y"
        },
    ]);



    const handleEliminar = (id: number) => {
        const confirmar = confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`);
        if (confirmar) {
            setProductos(productos.filter(p => p.id !== id));
            alert(`Producto con ID ${id} eliminado.`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-xl text-black font-bold mb-4">Inventario</h1>

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

            {/* Tabla de productos */}
            <div className="bg-white rounded shadow-md overflow-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2">Categoría</th>
                            <th className="px-4 py-2">cantidad</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                {productos.map((producto) => (
                    <tr key={producto.id}>
                        <td><button  onClick={() => onModificar(producto)} className="text-blue-600 hover:underline">{producto.nombre}</button></td>
                        <td className="text-center">{producto.categoria}</td>
                        <td className="text-center">{producto.cantidad}</td>
                        <td className="flex space-x-2">
                            
                            <button onClick={() => handleEliminar(producto.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                 // Notifica al padre (Inventario)
                            >
                                Eliminar X
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
                </table>
            </div>

            {productos.length === 0 && (
                <div className="mt-4 text-gray-500">
                    No hay productos en el inventario.
                </div>
            )}
        </div>
    );
}