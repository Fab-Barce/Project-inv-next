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

export default function Pantalla_refacciones({ onModificar }: Props) {
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

  // Estado para activar o desactivar el modo de eliminación
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  // Arreglo con los IDs de los productos seleccionados para eliminar
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Función para seleccionar o deseleccionar un producto
  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Función para eliminar en lote los productos seleccionados
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    const confirmar = confirm("¿Estás seguro de eliminar los productos seleccionados?");
    if (confirmar) {
      setProductos(productos.filter((p) => !selectedItems.includes(p.id)));
      setSelectedItems([]);
      setDeleteMode(false);
    }
  };

  // Función de eliminación individual (solo se muestra cuando no está en modo eliminación)
  const handleEliminar = (id: number) => {
    const confirmar = confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`);
    if (confirmar) {
      setProductos(productos.filter((p) => p.id !== id));
      alert(`Producto con ID ${id} eliminado.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">Inventario</h1>
      </div>

      {/* Área de botones */}
      <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard_admin/inventario/nuevo">
          <button className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nuevo
          </button>
        </Link>

        <Link href="/dashboard_admin/inventario/categorias">
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Categorías
          </button>
        </Link>

        <Link href="/dashboard_admin/inventario/proveedores">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            Proveedores
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

      {/* Tabla de productos */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              {/* Columna para checkboxes en modo eliminación */}
              {deleteMode && <th className="px-4 py-2"></th>}
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Cantidad</th>
              {/* Se muestra la columna de acciones solo si no está en modo eliminación */}
              {!deleteMode && <th className="px-4 py-2">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-t">
                {deleteMode && (
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(producto.id)}
                      onChange={() => handleSelect(producto.id)}
                    />
                  </td>
                )}
                <td className="px-4 py-2">
                  <button
                    onClick={() => onModificar(producto)}
                    className="text-blue-600 hover:underline"
                  >
                    {producto.nombre}
                  </button>
                </td>
                <td className="px-4 py-2 text-center">{producto.categoria}</td>
                <td className="px-4 py-2 text-center">{producto.cantidad}</td>
                {!deleteMode && (
                  <td className="px-4 py-2 flex space-x-2">

                    <button 
                      onClick={() => onModificar(producto)}
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

      {productos.length === 0 && (
        <div className="mt-4 text-gray-500">No hay productos en el inventario.</div>
      )}
    </div>
  );
}
