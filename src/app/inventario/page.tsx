'use client';  // Esto es obligatorio en App Router si usas useRouter

import { useRouter } from 'next/navigation';

export default function Inventario() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-xl text-black font-bold mb-4">Inventario</h1>

            <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">
                
                {/* Botón Nuevo */}
                <button
                    onClick={() => router.push('/inventario/nuevo')}
                    className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <span>Nuevo</span>
                    <span>+</span>
                </button>

                {/* Otros botones */}
                <button className="flex items-center space-x-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                    <span>Modificar</span>
                    <span>✎</span>
                </button>

                <button className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    <span>Eliminar</span>
                    <span>✖</span>
                </button>

                <div className="flex text-black items-center border rounded px-2">
                    <input type="text" placeholder="Buscar" className="outline-none py-1 bg-transparent" />
                    <span>🔍</span>
                </div>

                <div className="ml-auto flex space-x-2">
                    <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Cambiar Visualización">
                        🔄 Vista
                    </button>
                    <button className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600" title="Filtro Avanzado">
                        🔎 Filtros
                    </button>
                </div>
            </div>

            <div className="mt-4 text-gray-500">
                Agrega elementos para que aparezcan en el inventario.
            </div>

        </div>
    );
}


