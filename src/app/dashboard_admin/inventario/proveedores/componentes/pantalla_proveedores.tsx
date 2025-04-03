"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type Proveedor = {
  proveedor_id: number;
  nombre: string;
  direccion: string;
  RFC: string;
  nombre_representante: string;
  descripcion: string;
  num_telef: string;
};

type Props = {
  onModificar: (proveedor: Proveedor) => void;
};

export default function PantallaProveedor({ onModificar }: Props) {
  const [proveedores, setProveedor] = useState<Proveedor[]>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/Proveedores/")
    .then (response => {
      setProveedor(response.data)
    })
  },[])

  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm(
      "¿Estás seguro de eliminar los proveedores seleccionados?"
    );
    if (confirmar) {
      for (var i = 0; i < selectedItems.length; i+=1)
      {
        axios.delete(`http://localhost:8000/Proveedores/delete/${selectedItems[i]}/`)
        .then(res => {
          console.log(res);
          console.log(res.data);
        })
      }
      setProveedor(proveedores.filter((v) => !selectedItems.includes(v.proveedor_id)));
      setSelectedItems([]);
      setDeleteMode(false);
    }
  };

  const handleEliminar = (id: number) => {
    const confirmar = confirm(
      `¿Estás seguro de eliminar el proveedor con ID ${id}?`
    );
    if (confirmar) {
      setProveedor(proveedores.filter((v) => v.proveedor_id !== id));
      alert(`Proveedor con ID ${id} eliminado.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl text-black font-bold mb-4">Proveedores</h1>

      <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard_admin/inventario/proveedores/nuevo">
          <button className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nuevo
          </button>
        </Link>

        <button
          onClick={() => {
            setDeleteMode(!deleteMode);
            setSelectedItems([]);
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {deleteMode ? "Cancelar Eliminación" : "Eliminar"}
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

        <Link href="/dashboard_admin/inventario">
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

      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {deleteMode && <th className="px-4 py-2"></th>}
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">RFC</th>
              <th className="px-4 py-2 text-left">Representante</th>
              <th className="px-4 py-2 text-left">Dirección</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              {!deleteMode && <th className="px-4 py-2 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.proveedor_id} className="border-b">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(proveedor.proveedor_id)}
                      onChange={() => handleSelect(proveedor.proveedor_id)}
                    />
                  </td>
                )}
                <td className="px-4 py-2">
                  <button
                    onClick={() => onModificar(proveedor)}
                    className="text-blue-600 hover:underline"
                  >
                    {proveedor.nombre}
                  </button>
                </td>
                <td className="px-4 py-2">{proveedor.RFC}</td>
                <td className="px-4 py-2">{proveedor.nombre_representante}</td>
                <td className="px-4 py-2">{proveedor.direccion}</td>
                <td className="px-4 py-2">{proveedor.descripcion}</td>
                <td className="px-4 py-2">{proveedor.num_telef}</td>
                {!deleteMode && (
                  <td className="px-4 py-2 flex space-x-2 justify-center">
                    <button
                      onClick={() => onModificar(proveedor)}
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

      {proveedores.length === 0 && (
        <div className="mt-4 text-gray-500">No hay proveedores en el inventario.</div>
      )}
    </div>
  );
}
