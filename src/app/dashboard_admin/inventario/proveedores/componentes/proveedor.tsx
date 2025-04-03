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
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Proveedor</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />
        <Field label="RFC" name="RFC" value={formData.RFC} onChange={handleInputChange} editable={editable} />
        <Field label="Representante" name="nombre_representante" value={formData.nombre_representante} onChange={handleInputChange} editable={editable} />
        <Field label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} editable={editable} />
        <Field label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} editable={editable} />
        <Field label="Teléfono" name="num_telef" value={formData.num_telef} onChange={handleInputChange} editable={editable} />
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
          onClick={handleActualizar}
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

        <Link href="/dashboard_admin/inventario">
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