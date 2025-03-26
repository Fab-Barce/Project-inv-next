// /pages/historial/movimientos.tsx
"use client";
import Headerv2 from "@/app/components/headerv2";
import Link from "next/link";

const HistorialMovimientos = () => {
  const movimientos = [
    {
      id_movimiento: 1,
      refaccion_id: "Refacción A",
      vehiculo_id: "Vehículo 1",
      cantidad: 10,
      fecha: "2025-03-25",
      hora: "14:30",
      motivo: "Venta",
      tipo_movimiento: "Ingreso",
      user_id: "Usuario 1",
    },
    {
      id_movimiento: 2,
      refaccion_id: "Refacción B",
      vehiculo_id: "Vehículo 2",
      cantidad: 5,
      fecha: "2025-03-24",
      hora: "09:45",
      motivo: "Compra",
      tipo_movimiento: "Egreso",
      user_id: "Usuario 2",
    },
    {
      id_movimiento: 3,
      refaccion_id: "Refacción C",
      vehiculo_id: "Vehículo 3",
      cantidad: 3,
      fecha: "2025-03-23",
      hora: "11:00",
      motivo: "Mantenimiento",
      tipo_movimiento: "Ingreso",
      user_id: "Usuario 3",
    },
  ];

  return (
    <div>
        <Headerv2 />

        <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Historial de Movimientos
        </h1>

              {/* Área de botones */}
      <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
        <Link href="/dashboard_admin">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Volver
          </button>
        </Link>
      </div>    

        <div className="bg-white rounded-lg shadow-lg p-6">
            <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200 text-gray-600">
                <tr>
                <th className="px-4 py-2 text-left">ID Movimiento</th>
                <th className="px-4 py-2 text-left">Refacción</th>
                <th className="px-4 py-2 text-left">Vehículo</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Hora</th>
                <th className="px-4 py-2 text-left">Motivo</th>
                <th className="px-4 py-2 text-left">Tipo Movimiento</th>
                <th className="px-4 py-2 text-left">Usuario</th>
                </tr>
            </thead>
            <tbody>
                {movimientos.map((movimiento) => (
                <tr key={movimiento.id_movimiento} className="border-b">
                    <td className="px-4 py-2">{movimiento.id_movimiento}</td>
                    <td className="px-4 py-2">{movimiento.refaccion_id}</td>
                    <td className="px-4 py-2">{movimiento.vehiculo_id}</td>
                    <td className="px-4 py-2">{movimiento.cantidad}</td>
                    <td className="px-4 py-2">{movimiento.fecha}</td>
                    <td className="px-4 py-2">{movimiento.hora}</td>
                    <td className="px-4 py-2">{movimiento.motivo}</td>
                    <td className="px-4 py-2">{movimiento.tipo_movimiento}</td>
                    <td className="px-4 py-2">{movimiento.user_id}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </div>
  );
};

export default HistorialMovimientos;
