import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Dialog } from "@headlessui/react";

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

export default function Refaccion({ producto, onCancelar }: Props) {
    const [formData, setFormData] = useState<Producto | null>(null);
    const [editable, setEditable] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
    const [cantidadModificada, setCantidadModificada] = useState(0);
    const [datosMovimiento, setDatosMovimiento] = useState({
        operador: "",
        numUnidad: "",
        descripcionMotivo: ""
    });

    useEffect(() => {
        if (producto) {
            setFormData(producto);
            setCantidadModificada(producto.cantidad);
        }
    }, [producto]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => (prev ? { ...prev, [name]: value } : null));
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Producto</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" name="nombre" value={formData?.nombre || ""} onChange={handleInputChange} editable={editable} />
                <Field label="Categoría" name="categoria" value={formData?.categoria || ""} onChange={handleInputChange} editable={editable} />
                <Field label="Stock Mínimo" name="stock_minimo" value={formData?.stock_minimo || 0} onChange={handleInputChange} editable={editable} />
                <Field label="Unidad" name="unidad" value={formData?.unidad || ""} onChange={handleInputChange} editable={editable} />
                <Field label="Proveedor" name="proveedor" value={formData?.proveedor || ""} onChange={handleInputChange} editable={editable} />
                <Field label="Costo 💲" name="costo" value={formData?.costo || 0} onChange={handleInputChange} editable={editable} />
                <Field label="Marca" name="marca" value={formData?.marca || ""} onChange={handleInputChange} editable={editable} />
                
                <div className="flex items-center space-x-2">
                    <Field label="Cantidad" name="cantidad" value={formData?.cantidad || 0} onChange={handleInputChange} editable={false} />
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => setIsOpen(true)}>
                        <FaEdit size={20} />
                    </button>
                </div>
            </div>

            <div className="flex space-x-3 mt-6">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={() => setEditable(!editable)}>
                    {editable ? "Bloquear" : "Modificar"}
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" onClick={onCancelar}>
                    Cancelar
                </button>
            </div>

            {/* Ventana Modal para modificar la cantidad */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h3 className="text-lg font-bold mb-4">Modificar Cantidad</h3>
                    <label className="block text-gray-700">Nueva Cantidad:</label>
                    <input
                        type="number"
                        value={cantidadModificada}
                        onChange={(e) => setCantidadModificada(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                    />
                    <label className="block text-gray-700 mt-3">Tipo de Movimiento:</label>
                    <select
                        value={tipoMovimiento}
                        onChange={(e) => setTipoMovimiento(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                        <option value="correccion">Corrección</option>
                    </select>
                    {tipoMovimiento === "salida" && (
                        <>
                            <Field label="Operador" name="operador" value={datosMovimiento.operador} onChange={handleInputChange} editable={true} />
                            <Field label="Número de Unidad" name="numUnidad" value={datosMovimiento.numUnidad} onChange={handleInputChange} editable={true} />
                            <label className="block text-gray-700 mt-3">Descripción Motivo (Opcional)</label>
                            <textarea
                                name="descripcionMotivo"
                                value={datosMovimiento.descripcionMotivo}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </>
                    )}
                    <div className="mt-4 flex justify-end space-x-2">
                        <button className="bg-gray-400 px-4 py-2 rounded-lg" onClick={() => setIsOpen(false)}>Cancelar</button>
                        <button className="bg-green-500 px-4 py-2 text-white rounded-lg">Guardar</button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

const Field = ({ label, name, value, onChange, editable }: any) => (
    <div>
        <label className="block text-gray-700 font-semibold">{label}:</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            disabled={!editable}
            className={`w-full p-2 border rounded-md ${editable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
        />
    </div>
);
