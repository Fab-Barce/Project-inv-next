import React, { useEffect, useState } from "react";

// Definición del tipo de datos Producto
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
                <Field label="numero_parte" value={formData?.numero_parte || ""} />
                <Field label="Proveedor" value={formData?.proveedor || ""} />
                <Field label="Categoría" value={formData?.categoria || ""} />
                <Field label="Costo $" value={formData?.costo || 0} />
                <Field label="Stock Mínimo" value={formData?.stock_minimo || 0} />
                <div className="flex-col">
                    {formData?.imagen_refa && <img src={formData.imagen_refa} alt="Imagen" className="h-20" />}
                </div>
                <Field label="Empresa" value={formData?.empresa || ""}/>
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
