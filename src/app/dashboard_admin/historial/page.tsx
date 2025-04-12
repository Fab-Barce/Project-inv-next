"use client";
import Headerv2 from "@/app/components/headerv2";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";

type Movimiento = {
  id_movimiento: number;
  nombre_refaccion?: string | null;
  nombre?: string | null;
  placas?: string | null;
  placa_vehiculo?: string | null;
  cantidad?: string | null;
  fecha: string;
  hora: string;
  motivo?: string | null;
  tipo_movimiento: string;
  user_nombre: string;
};

type CampoBusqueda = keyof Movimiento;

const campos: { label: string; value: CampoBusqueda }[] = [
  { label: "ID Movimiento", value: "id_movimiento" },
  { label: "Refacción", value: "nombre_refaccion" },
  { label: "Vehículo", value: "placa_vehiculo" },
  { label: "Cantidad", value: "cantidad" },
  { label: "Fecha", value: "fecha" },
  { label: "Hora", value: "hora" },
  { label: "Motivo", value: "motivo" },
  { label: "Tipo Movimiento", value: "tipo_movimiento" },
  { label: "Usuario", value: "user_nombre" },
];

const HistorialMovimientos = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState<CampoBusqueda>("nombre_refaccion");
  const [sortField, setSortField] = useState<CampoBusqueda | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    axios.get("http://localhost:8000/Movimientos/")
      .then(response => setMovimientos(response.data))
      .catch(error => console.error("Error al obtener los movimientos:", error));
  }, []);

  const handleSort = (campo: CampoBusqueda) => {
    if (sortField === campo) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(campo);
      setSortDirection("asc");
    }
  };

  const movimientosFiltrados = movimientos.filter((movimiento) => {
    const valor = (movimiento[searchField] ?? "").toString().toLowerCase();
    return valor.includes(searchTerm.toLowerCase());
  });

  const movimientosOrdenados = sortField
    ? [...movimientosFiltrados].sort((a, b) => {
        const aValue = a[sortField] ?? "";
        const bValue = b[sortField] ?? "";

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return sortDirection === "asc"
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      })
    : movimientosFiltrados;

  return (
    <div>
      <Headerv2 />

      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Historial de Movimientos
          </h1>

          {/* Botón Volver */}
          <div className="flex justify-end mb-6">
            <Link href="/dashboard_admin">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 shadow-sm">
                Volver
              </button>
            </Link>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-center">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as CampoBusqueda)}
              className="p-2 border rounded"
            >
              {campos.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="p-2 border rounded flex-1"
            />
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow-md overflow-auto border border-gray-300">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 border-b">
                <tr>
                  {campos.map(({ label, value }) => (
                    <th
                      key={value}
                      className="px-4 py-3 cursor-pointer select-none"
                      onClick={() => handleSort(value)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {sortField === value ? (
                          sortDirection === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {movimientosOrdenados.map((m) => (
                  <tr key={m.id_movimiento} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{m.id_movimiento}</td>
                    <td className="px-4 py-2">{m.nombre || m.nombre_refaccion || "-"}</td>
                    <td className="px-4 py-2">{m.placa_vehiculo || m.placas || "-"}</td>
                    <td className="px-4 py-2">{m.cantidad || "-"}</td>
                    <td className="px-4 py-2">{m.fecha}</td>
                    <td className="px-4 py-2">{m.hora}</td>
                    <td className="px-4 py-2">{m.motivo || "-"}</td>
                    <td className="px-4 py-2">{m.tipo_movimiento}</td>
                    <td className="px-4 py-2">{m.user_nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {movimientos.length === 0 && (
            <div className="mt-4 text-center text-gray-500">No hay movimientos registrados.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialMovimientos;
