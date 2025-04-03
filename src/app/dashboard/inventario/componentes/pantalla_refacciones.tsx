"use client";

import { useState, useEffect } from "react";
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

export default function Pantalla_refacciones({ onModificar }: Props) {
  const [refacciones, setRefacciones] = useState<Producto[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Función para obtener los datos de la API
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

  // Función para seleccionar o deseleccionar una refacción
  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Función para eliminar en lote las refacciones seleccionadas
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    const confirmar = confirm("¿Estás seguro de eliminar las refacciones seleccionadas?");
    if (!confirmar) return;

    try {
        await Promise.all(
            selectedItems.map(async (refaccion_id) => {
                // Obtener la refacción eliminada para enviar su nombre en la segunda petición
                const refaccion = refacciones.find((r) => r.refaccion_id === refaccion_id);

                // Eliminar la refacción
                await fetch(`http://localhost:8000/Refacciones/delete/${refaccion_id}/`, {
                    method: "DELETE",
                });

                // Registrar movimiento de eliminación
                await fetch("http://localhost:8000/Movimientos/create/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tipo_movimiento: "eliminacion",
                        user_id: localStorage.getItem("user_id"),
                        nombre: refaccion?.nombre || "Desconocido", // Evita fallos si no encuentra la refacción
                    }),
                });
            })
        );

        // Actualizar la lista eliminando las refacciones seleccionadas
        setRefacciones((prev) => prev.filter((u) => !selectedItems.includes(u.refaccion_id)));
        setSelectedItems([]);
        setDeleteMode(false);
    } catch (error) {
        console.error("Error al eliminar refacciones y registrar movimientos:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">Inventario de Refacciones</h1>
      </div>

      {/* Área de botones */}
      <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard/inventario/nuevo">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nuevo
          </button>
        </Link>

        <Link href="/dashboard/inventario/categorias">
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Categorías
          </button>
        </Link>

        <Link href="/dashboard/inventario/proveedores">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Proveedores
          </button>
        </Link>

        {/* Botón para activar/desactivar el modo eliminación */}
        <button
          onClick={() => {
            setDeleteMode(!deleteMode);
            setSelectedItems([]);
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {deleteMode ? "Cancelar Eliminación" : "Eliminar Refacción"}
        </button>

        {deleteMode && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={selectedItems.length === 0}
          >
            Confirmar Eliminación
          </button>
        )}

        <Link href="/dashboard">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Volver
          </button>
        </Link>
      </div>

      {/* Tabla de refacciones */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {deleteMode && <th className="px-4 py-2"></th>}
              <th className="px-4 py-2 text-left">Número de Parte</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Stock Mínimo</th>
              <th className="px-4 py-2">Costo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {refacciones.map((refaccion) => (
              <tr key={refaccion.refaccion_id} className="border-t">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(refaccion.refaccion_id)}
                      onChange={() => handleSelect(refaccion.refaccion_id)}
                    />
                  </td>
                )}
                <td className="px-4 py-2">{refaccion.numero_parte}</td>
                <td className="px-4 py-2">{refaccion.nombre}</td>
                <td className="px-4 py-2 text-center">{refaccion.cantidad}</td>
                <td className="px-4 py-2 text-center">{refaccion.stock_minimo}</td>
                <td className="px-4 py-2 text-center">${refaccion.costo.toFixed(2)}</td>
                {!deleteMode && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onModificar(refaccion)}
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

      {refacciones.length === 0 && (
        <div className="mt-4 text-gray-500">No hay refacciones en el inventario.</div>
      )}
    </div>
  );
}

