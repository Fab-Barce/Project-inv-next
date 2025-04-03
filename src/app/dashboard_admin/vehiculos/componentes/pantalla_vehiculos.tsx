"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  onModificar: (vehiculo: Vehiculo) => void;
};

export default function PantallaVehiculos({ onModificar }: Props) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

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

  // Seleccionar o deseleccionar un vehículo para eliminación
  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Eliminación en lote de los vehículos seleccionados
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("¿Estás seguro de eliminar los vehículos seleccionados?");
    if (confirmar) {
      try {
        await Promise.all(
            selectedItems.map(async (vehiculo_id) => {
                // Obtener la refacción eliminada para enviar su nombre en la segunda petición
                const vehiculo = vehiculos.find((r) => r.vehiculo_id === vehiculo_id);

                // Eliminar la refacción
                await fetch(`http://localhost:8000/Vehiculos/delete/${vehiculo_id}/`, {
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
                        nombre: vehiculo?.placas || "Desconocido", // Evita fallos si no encuentra la refacción
                    }),
                });
            })
        );

        // Actualizar la lista eliminando las refacciones seleccionadas
        setVehiculos((prev) => prev.filter((u) => !selectedItems.includes(u.vehiculo_id)));
        setSelectedItems([]);
        setDeleteMode(false);
    } catch (error) {
        console.error("Error al eliminar vehiculos y registrar movimientos:", error);
    }
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título */}
      <h1 className="text-xl text-black font-bold mb-4">Vehículos</h1>

      {/* Área de botones */}
      <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard_admin/vehiculos/nuevo">
          <button className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nuevo
          </button>
        </Link>

        {/* Botón para activar/desactivar el modo eliminación */}
        <button
          onClick={() => {
            setDeleteMode(!deleteMode);
            // Reiniciamos la selección al cambiar de modo
            setSelectedItems([]);
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

        <Link href="/dashboard_admin/vehiculos/operadores">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Operadores
          </button>
        </Link>

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

      {/* Tabla de vehículos */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {/* Mostrar columna para checkboxes en modo eliminación */}
              {deleteMode && <th className="px-4 py-2"></th>}
              <th className="px-4 py-2 text-left">Número de Serie</th>
              <th className="px-4 py-2 text-center">Placas</th>
              <th className="px-4 py-2 text-center">Operador</th>
              <th className="px-4 py-2 text-center">Empresa</th>
              <th className="px-4 py-2 text-center">Marca</th>
              <th className="px-4 py-2 text-center">Año</th>
              {/* Columna de acciones solo se muestra cuando no está en modo eliminación */}
              {!deleteMode && <th className="px-4 py-2 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.vehiculo_id} className="border-b">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(vehiculo.vehiculo_id)}
                      onChange={() => handleSelect(vehiculo.vehiculo_id)}
                    />
                  </td>
                )}
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
                {!deleteMode && (
                  <td className="px-4 py-2 flex space-x-2 justify-center">
                    <button
                      onClick={() => onModificar(vehiculo)}
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

      {vehiculos.length === 0 && (
        <div className="mt-4 text-gray-500">
          No hay vehículos en el inventario.
        </div>
      )}
    </div>
  );
}