import Link from "next/link";

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
  if (!proveedor) return null; // Si no hay proveedor seleccionado, no renderiza nada.

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle de Proveedor</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre" value={proveedor.nombre} />
        <Field label="RFC" value={proveedor.RFC} />
        <Field label="Representante" value={proveedor.nombre_representante} />
        <Field label="Dirección" value={proveedor.direccion} />
        <Field label="Descripción" value={proveedor.descripcion} />
        <Field label="Teléfono" value={proveedor.num_telef} />
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={onCancelar}
        >
          Regresar
        </button>

        <Link href="/dashboard_v2/vista-inventario">
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
  value: string | number;
};

const Field = ({ label, value }: FieldProps) => (
  <div>
    <label className="block text-gray-700 font-semibold">{label}:</label>
    <p className="w-full p-2 border rounded-md bg-gray-100">{value}</p>
  </div>
);
