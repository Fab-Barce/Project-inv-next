import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

type Proveedor = {
  proveedor_id: number;
  nombre: string;
  direccion: string;
  RFC: string;
  nombre_representante: string;
  descripcion: string;
  num_telef: string;
};


type Props = {
  proveedor: Proveedor | null;
  onCancelar: () => void;
};

export default function ProveedorDetalle({ proveedor, onCancelar }: Props) {
  const [formData, setFormData] = useState<Proveedor>({
    proveedor_id: 0,
    nombre: "",
    direccion: "",
    RFC: "",
    nombre_representante: "",
    descripcion: "",
    num_telef: "",
  });
  const [originalData, setOriginalData] = useState<Proveedor | null>(null); 
  const [editable, setEditable] = useState(false); // Controla si los campos son editables

  useEffect(() => {
    if (proveedor) {
      setFormData(proveedor);
      setOriginalData(proveedor); // Guarda los datos originales
    }
  }, [proveedor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getChangedFields = () => {
    if (!originalData) return {};

    const changes: Partial<Proveedor> = {};

    for (const key in formData) {
      if (formData[key as keyof Proveedor] !== originalData[key as keyof Proveedor]) {
        if (formData[key as keyof Proveedor] !== undefined) {
          changes[key as keyof Proveedor] = formData[key as keyof Proveedor] as Proveedor[keyof Proveedor];
        }
      }
    }

    return changes;
  };

  const handleActualizar = async () => {
    const changes = getChangedFields();

    if (Object.keys(changes).length === 0) {
      alert("No hay cambios para actualizar.");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/Proveedores/update/${formData.proveedor_id}/`, changes);
      alert("Proveedor actualizado con éxito.");
      setEditable(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al actualizar el proveedor.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
        
        <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Detalle de Proveedor</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />
          <Field label="RFC" name="RFC" value={formData.RFC} onChange={handleInputChange} editable={editable} />
          <Field label="Representante" name="nombre_representante" value={formData.nombre_representante} onChange={handleInputChange} editable={editable} />
          <Field label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} editable={editable} />
          <Field label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} editable={editable} />
          <Field label="Teléfono" name="num_telef" value={formData.num_telef} onChange={handleInputChange} editable={editable} />
        </div>
  
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-10">
  
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
            onClick={onCancelar}
          >
            Volver
          </button>
        </div>
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
    <label className="block text-gray-700 font-semibold mb-1">{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={!editable}
      className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
        editable ? "bg-white focus:ring-2 focus:ring-blue-400" : "bg-gray-200 cursor-not-allowed"
      }`}
    />
  </div>
);
