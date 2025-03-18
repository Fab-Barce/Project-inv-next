import React, { useEffect, useState } from "react";

// Definición del tipo de datos Producto
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
    producto: Producto | null;
    onCancelar: () => void;
};

export default function VistaRefaccion({ producto, onCancelar }: Props) {
    const [formData, setFormData] = useState<Producto | null>(null);

    useEffect(() => {
        if (producto) {
            setFormData(producto);
        }
    }, [producto]);

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalles de la Refacción</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" value={formData?.nombre || ""} />
                <Field label="Categoría" value={formData?.categoria || ""} />
                <Field label="Stock Mínimo" value={formData?.stock_minimo || 0} />
                <Field label="Unidad" value={formData?.unidad || ""} />
                <Field label="Proveedor" value={formData?.proveedor || ""} />
                <Field label="Costo $" value={formData?.costo || 0} />
                <Field label="Marca" value={formData?.marca || ""} />
                <Field label="Cantidad" value={formData?.cantidad || 0} />
            </div>

            <div className="flex space-x-3 mt-6">
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    onClick={onCancelar}
                >
                    Cerrar
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
