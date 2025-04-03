"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
 
type Producto = {
    refaccion_id: number;
    proveedor_id: string;
    vehiculo_id: string;
    numero_parte: string;
    nombre: string;
    cantidad: number;
    stock_minimo: number;
    costo: number;
    categoria_id: string;
    imagen_refa: string;
    empresa_id: string;
    categoria: string;
    proveedor: string;
    empresa: string;
  };

type Props = {
    onModificar: (producto: Producto) => void;
};

export default function Pantalla_Vista_Refacciones({ onModificar }: Props) {
    const [refacciones, setRefacciones] = useState<Producto[]>([]);

      useEffect(() => {
        const fetchRefacciones = async () => {
          try {
            const response = await fetch("http://localhost:8000/Refacciones/");
            if (!response.ok) {
              throw new Error("Error al obtener las refacciones");
            }
            const data = await response.json();
            
            console.log("Datos recibidos de la API:", data); // Debug
    
            const refaccionesFiltradas = data.map((item: any) => ({
              refaccion_id: item.refaccion_id || item.id,
              proveedor_id:item.proveedor_id || 0,
              vehiculo_id:item.vehiculo_id || 0,
              numero_parte: item.numero_parte || "N/A",
              nombre: item.nombre || "Sin nombre",
              cantidad: Number(item.cantidad) || 0,
              stock_minimo: Number(item.stock_minimo) || 0,
              costo: Number(item.costo) || 0,
              categoria_id: item.categoria_id || 0,
              imagen_refa: item.imagen_refa || null,
              empresa_id: item.empresa_id || 0,
              categoria:item.categoria || "",
              empresa: item.empresa || "",
              proveedor: item.proveedor || "",
            }));
    
            setRefacciones(refaccionesFiltradas);
          } catch (error) {
            console.error("Error al obtener refacciones:", error);
          }
        };
    
        fetchRefacciones();
      }, []);

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-xl text-black font-bold mb-4">Inventario de Refacciones (Solo Vista)</h1>

            <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">


                <Link href="/dashboard_v2/vista-inventario/vista-categorias">
                    <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                        Categorías
                    </button>
                </Link>

                <Link href="/dashboard_v2/vista-inventario/vista-proveedores">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                        Proveedores
                    </button>
                </Link>

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
                        {refacciones.map((refaccion) => (
                            <tr key={refaccion.refaccion_id} className="border-b">
                                <td className="px-4 py-2">{refaccion.nombre}</td>
                                <td className="px-4 py-2 text-center">{refaccion.categoria}</td>
                                <td className="px-4 py-2 text-center">{refaccion.cantidad}</td>
                                <td className="px-4 py-2 text-center">
                                    <button 
                                        onClick={() => onModificar(refaccion)}
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

            {refacciones.length === 0 && (
                <div className="mt-4 text-gray-500">
                    No hay refacciones disponibles para visualizar.
                </div>
            )}
        </div>
    );
}
