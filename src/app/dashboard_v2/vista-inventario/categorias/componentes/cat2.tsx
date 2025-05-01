import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Button from "@/app/components/Button";
type Categoria = {
    categoria_id: number;
    nombre: string;
    descripcion: string;
  };

type Props = {
    categoria: Categoria | null;
    onCancelar: () => void;
};

export default function CategoriaDetalle({ categoria, onCancelar }: Props) {
  const [formData, setFormData] = useState<Categoria>({
    categoria_id: 0,
    nombre: "",
    descripcion: "",
  });

  const [originalData, setOriginalData] = useState<Categoria | null>(null);
  const [editable, setEditable] = useState(false);


  useEffect(() => {
    if (categoria) {
      setFormData(categoria);
      setOriginalData(categoria);
    }
  }, [categoria]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getChangedFields = () => {
    if (!originalData) return {};

    const changes: Partial<Categoria> = {};

    for (const key in formData) {
      const formValue = formData[key as keyof Categoria];
      const originalValue = originalData[key as keyof Categoria];

      // Convertir ambos valores a string para comparación precisa
      if (String(formValue) !== String(originalValue)) {
        changes[key as keyof Categoria] = formValue as Categoria[keyof Categoria];
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
      await axios.put(
        `http://localhost:8000/Categorias/update/${formData.categoria_id}/`,
        changes
      );
      alert("Categoria actualizada con éxito.");
      setEditable(false);
      setOriginalData(formData); // Actualizar originalData después de la actualización
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al actualizar la categoria.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md border border-gray-300">
        
        <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Detalle de Categoria</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campos de la categoria */}
          <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />
          <Field label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInputChange} editable={editable} />
        </div>
  
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-10">

  
          <Button
            variant="blue"
            onClick={onCancelar}
          >
            Volver
          </Button>
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