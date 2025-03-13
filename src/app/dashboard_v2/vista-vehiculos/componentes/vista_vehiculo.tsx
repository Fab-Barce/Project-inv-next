"use client";

type Vehiculo = {
    id: number;
    modelo: string;
    marca: string;
    año: number;
    color: string;
    placa: string;
    empresa: string;
    descripcion: string;
};

type Props = {
    vehiculo: Vehiculo | null;
    onCancelar: () => void;
};

export default function Vista_vehiculo({ vehiculo, onCancelar }: Props) {
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalles del Vehículo</h2>

            {vehiculo ? (
                <div className="grid grid-cols-2 gap-4">
                    <p><b>Modelo:</b> {vehiculo.modelo}</p>
                    <p><b>Marca:</b> {vehiculo.marca}</p>
                    <p><b>Año:</b> {vehiculo.año}</p>
                    <p><b>Color:</b> {vehiculo.color}</p>
                    <p><b>Placa:</b> {vehiculo.placa}</p>
                    <p><b>Empresa:</b> {vehiculo.empresa}</p>
                    <p className="col-span-2"><b>Descripción:</b> {vehiculo.descripcion}</p>
                </div>
            ) : (
                <p className="text-gray-500">No hay información del vehículo.</p>
            )}

            <div className="flex justify-end mt-4">
                <button
                    onClick={onCancelar}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}
