"use client";

import { useState } from "react";
import Link from "next/link";

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

  // Estado para el modo eliminación y los elementos seleccionados
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Seleccionar o deseleccionar un vehículo para eliminación
  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Eliminación en lote de los vehículos seleccionados
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("¿Estás seguro de eliminar los vehículos seleccionados?");
    if (confirmar) {
      setVehiculos(vehiculos.filter((v) => !selectedItems.includes(v.id)));
      setSelectedItems([]);
      setDeleteMode(false);
    }
  };

  // Eliminación individual (solo se muestra cuando NO está en modo eliminación)
  const handleEliminar = (id: number) => {
    const confirmar = confirm(`¿Estás seguro de eliminar el vehículo con ID ${id}?`);
    if (confirmar) {
      setVehiculos(vehiculos.filter((v) => v.id !== id));
      alert(`Vehículo con ID ${id} eliminado.`);
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
              <tr key={vehiculo.id} className="border-b">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(vehiculo.id)}
                      onChange={() => handleSelect(vehiculo.id)}
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
