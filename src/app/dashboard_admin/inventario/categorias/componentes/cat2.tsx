import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

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
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Categoria</h2>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} editable={editable} />
                <Field label="Descripcíon" name="descripcion" value={formData.descripcion} onChange={handleInputChange} editable={editable} />

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
                        Volver
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
            type={name === 'anio' || name === 'num_serie' ? 'number' : 'text'}
            name={name}
            value={value}
            onChange={onChange}
            disabled={!editable}
            className={`w-full p-2 border rounded-md ${editable ? 'bg-white' : 'bg-gray-200 cursor-not-allowed'}`}
        />
    </div>
);
