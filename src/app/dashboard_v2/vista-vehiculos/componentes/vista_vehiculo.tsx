import React, { useEffect, useState } from "react";


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
    vehiculo: Vehiculo | null;
    onCancelar: () => void;
};

export default function Vista_vehiculo({ vehiculo, onCancelar }: Props) {

    const [formData, setFormData] = useState<Vehiculo | null>(null);
    
        useEffect(() => {
            if (vehiculo) {
                setFormData(vehiculo);
            }
        }, [vehiculo]);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalles del Vehículo</h2>


            <div className="grid grid-cols-2 gap-4">
                <Field label="Número de Serie" value={formData?.num_serie || ""} />
                <Field label="Placas" value={formData?.placas || ""} />
                <Field label="Operador" value={formData?.operador || 0} />
                <Field label="Empresa" value={formData?.empresa || ""} />
                <Field label="Marca" value={formData?.marca || ""} />
                <Field label="Año" value={formData?.anio || ""} />
                <div className="flex-col">
                    {formData?.imagen_vehi && <img src={formData.imagen_vehi} alt="Imagen" className="h-20" />}
                </div>
            </div>


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


// Componente para mostrar un campo solo lectura
const Field = ({ label, value }: { label: string; value: string | number }) => (
    <div>
        <label className="block text-gray-700 font-semibold">{label}:</label>
        <input
            type="text"
            value={value}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed"
        />
    </div>
);
