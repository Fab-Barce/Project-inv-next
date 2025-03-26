import React, { useState, useEffect } from "react";
import Link from "next/link";

type Proveedor = {
  id: number;
  nombre: string;
  direccion: string;
  rfc: string;
  nombre_representante: string;
  descripcion: string;
  num_telf: string;
};

type Props = {
  proveedor: Proveedor | null;
  onCancelar: () => void;
};

export default function ProveedorDetalle({ proveedor, onCancelar }: Props) {
  const [formData, setFormData] = useState<Proveedor>({
    id: 0,
    nombre: "",
    direccion: "",
    rfc: "",
    nombre_representante: "",
    descripcion: "",
    num_telf: "",
  });

  const [editable, setEditable] = useState(false); // Controla si los campos son editables

  useEffect(() => {
    if (proveedor) {
      setFormData(proveedor);
    }
  }, [proveedor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Proveedor</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />
        <Field label="RFC" name="rfc" value={formData.rfc} onChange={handleInputChange} editable={editable} />
        <Field label="Representante" name="nombre_representante" value={formData.nombre_representante} onChange={handleInputChange} editable={editable} />
        <Field label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} editable={editable} />
        <Field label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} editable={editable} />
        <Field label="Teléfono" name="num_telf" value={formData.num_telf} onChange={handleInputChange} editable={editable} />
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
          onClick={() => alert("Guardado")}
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

        <Link href="/dashboard/inventario">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Volver a inventario
          </button>
        </Link>
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
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={!editable}
      className={`w-full p-2 border rounded-md ${editable ? "bg-white" : "bg-gray-200 cursor-not-allowed"}`}
    />
  </div>
);
