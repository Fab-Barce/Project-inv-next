import React, { useState, useEffect } from "react";

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
};

type Props = {
    producto: Producto | null;
    onCancelar: () => void;
};

export default function Refaccion({ producto, onCancelar }: Props) {
    const [formData, setFormData] = useState<Producto>({
        id: 0,
        nombre: "",
        cantidad: 0,
        categoria: "",
        stock_minimo: 0,
        descripcion: "",
        unidad: "",
        proveedor: "",
        imagen: "",
        empresa: "",
        numero_parte: "",
    });

    useEffect(() => {
        if (producto) {
            setFormData(producto);  // Prellenar con el producto seleccionado
        }
    }, [producto]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <div>
                <label>Nombre:</label>
                <input name="nombre" value={formData.nombre} onChange={handleInputChange} className="border" />
            </div>
            
            <div>
                <label>Categoría:</label>
                <input name="categoria" value={formData.categoria} onChange={handleInputChange} className="border" />
            </div>
            
            <div>
                <label>Descripción:</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} className="border" />
            </div>
            
            <div>
                <label>Stock minimo:</label>
                <input name="stock_minimo" value={formData.stock_minimo} onChange={handleInputChange} className="border" />
            </div>

            <div>
                <label>Unidad:</label>
                <input name="unidad" value={formData.unidad} onChange={handleInputChange} className="border" />
            </div>
            
            <div>
                <label>Proveedor:</label>
                <input name="proveedor" value={formData.proveedor} onChange={handleInputChange} className="border" />
            </div>

            <div>
                <label>Imagen:</label>
                <input name="imagen" value={formData.imagen} onChange={handleInputChange} className="border" />
            </div>

            <div>
                <label>Cantidad:</label>
                <input name="Cantidad" value={formData.cantidad} onChange={handleInputChange} className="border" />
            </div>

            <div>
                <label>empresa:</label>
                <input name="empresa" value={formData.empresa} onChange={handleInputChange} className="border" />
            </div>

            <div>
                <label>Numrero Parte:</label>
                <input name="numero_parte" value={formData.numero_parte} onChange={handleInputChange} className="border" />
            </div>

            

            



            {/* Puedes agregar el resto de campos igual */}
            <div className="flex space-x-2 mt-4">
                <button className="bg-red-500 text-white px-4 py-2" onClick={onCancelar}>
                    Cancelar
                </button>
                <button className="bg-green-500 text-white px-4 py-2" onClick={() => alert('Guardado')}>
                    Guardar
                </button>
            </div>
        </div>
    );
}
