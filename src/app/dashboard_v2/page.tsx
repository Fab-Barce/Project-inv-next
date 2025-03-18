import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

            {/* Título */}
            <h1 className="text-2xl font-bold mb-8">Texto de Bienvenida al Sistema Vistas</h1>

            <div className="flex space-x-2 mb-4 p-2">
                    <Link href="/">
                        <button className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
                        Cerrar sesión
                        </button>
                    </Link> 
            </div>


            {/* Contenedor de los botones tipo tarjetas */}
            <div className="grid grid-cols-2 gap-6">

                {/* Tarjeta Inventario con enlace a /inventario */}
                <Link href="/dashboard_v2/vista-inventario" className="w-48 h-60">
                    <div className="w-full h-full bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                        <div className="text-xl text-black font-bold">Inventario</div>
                        <div className="mt-4">
                            📦 {/* Icono simulado */}
                        </div>
                    </div>
                </Link>
                
                {/* Tarjeta Vehículos */}
                <Link href="/dashboard_v2/vista-vehiculos" className="w-48 h-60">
                    <div className="w-full h-full bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                        <div className="text-xl text-black font-bold">Vehículos</div>
                        <div className="mt-4">
                            🚗 {/* Icono simulado */}
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
