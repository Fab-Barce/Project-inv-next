export default function Visualizacion() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Título */}
            <h1 className="text-xl text-black font-bold mb-4">Visualización de Elementos</h1>

            {/* Barra de acciones (solo búsqueda y controles de visualización) */}
            <div className="flex space-x-2 mb-4 bg-white p-2 shadow rounded-lg">

                {/* Barra de búsqueda */}
                <div className="flex text-black items-center border rounded px-2">
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="outline-none py-1 bg-transparent"
                    />
                    <span>🔍</span>
                </div>

                {/* Botones adicionales - Cambio de visualización y filtro */}
                <div className="ml-auto flex space-x-2">

                    {/* Botón para cambiar visualización */}
                    <button
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Cambiar Visualización"
                    >
                        🔄 Vista
                    </button>

                    {/* Botón para abrir filtro avanzado */}
                    <button
                        className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        title="Filtro Avanzado"
                    >
                        🔎 Filtros
                    </button>
                </div>
            </div>

            {/* Mensaje temporal o espacio para futura visualización */}
            <div className="bg-white shadow rounded-lg p-4 text-gray-500">
                Aquí se mostrará la información en modo visualización.
            </div>

        </div>
    )
}
