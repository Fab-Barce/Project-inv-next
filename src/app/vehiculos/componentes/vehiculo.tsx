import React, { useState, useEffect } from "react";

type Vehiculo = {
    id: number;
    num_serie: number;
    placas: string;
    operador: string;
    imagen: string;
    anio: number;
    empresa: string;
    marca: string;
};

type Props = {
    vehiculo: Vehiculo | null;
    onCancelar: () => void;
};

export default function VehiculoDetalle({ vehiculo, onCancelar }: Props) {
    const [formData, setFormData] = useState<Vehiculo>({
        id: 0,
        num_serie: 0,
        placas: "",
        operador: "",
        imagen: "",
        anio: 0,
        empresa: "",
        marca: "",
    });

    const [editable, setEditable] = useState(false); // Controla si los campos son editables

    useEffect(() => {
        if (vehiculo) {
            setFormData(vehiculo);
        }
    }, [vehiculo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'anio' || name === 'num_serie' ? Number(value) : value
        });
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Vehículo</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Número de Serie" name="num_serie" value={formData.num_serie} onChange={handleInputChange} editable={editable} />
                <Field label="Placas" name="placas" value={formData.placas} onChange={handleInputChange} editable={editable} />
                <Field label="Operador" name="operador" value={formData.operador} onChange={handleInputChange} editable={editable} />
                <Field label="Empresa" name="empresa" value={formData.empresa} onChange={handleInputChange} editable={editable} />
                <Field label="Marca" name="marca" value={formData.marca} onChange={handleInputChange} editable={editable} />
                <Field label="Año" name="anio" value={formData.anio} onChange={handleInputChange} editable={editable} />
                <Field label="Imagen (URL)" name="imagen" value={formData.imagen} onChange={handleInputChange} editable={editable} />
            </div>

            <div className="flex space-x-3 mt-6">
                <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={() => setEditable(!editable)}
                >
                    {editable ? "Bloquear" : "Modificar"}
                </button>

                <button
                    type="button"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={() => alert('Guardado')}
                    disabled={!editable}
                >
                    Guardar
                </button>

                <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

type FieldProps = {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editable: boolean;
};

const Field = ({ label, name, value, onChange, editable }: FieldProps) => (
    <div>
        <label className="block text-gray-700 font-semibold">{label}:</label>
        <input
            type={name === 'anio' || name === 'num_serie' ? 'number' : 'text'}
            name={name}
            value={value}
            onChange={onChange}
            disabled={!editable}
            className={`w-full p-2 border rounded-md ${editable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
        />
    </div>
);
