import Link from "next/link";
import Headerv2 from "../components/headerv2";

export default function Home() {
    return (
        <div>
            <Headerv2 />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

                {/* Título */}
                <h1 className="text-2xl font-bold mb-8">Texto de Bienvenida al Sistema</h1>

                {/* Contenedor de los botones tipo tarjetas */}
                <div className="grid grid-cols-2 gap-6">

                    {/* Tarjeta Inventario con enlace a /inventario */}
                    <Link href="dashboard_admin/inventario" className="w-48 h-60">
                        <div className="w-full h-full bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                            <div className="text-xl text-black font-bold">Inventario</div>
                            <div className="mt-4">
                                📦 {/* Icono simulado */}
                            </div>
                        </div>
                    </Link>
                    

                    {/* Tarjeta Vehículos */}
                    <Link href="dashboard_admin/vehiculos" className="w-48 h-60">
                        <div className="w-full h-full bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                            <div className="text-xl text-black font-bold">Vehículos</div>
                            <div className="mt-4">
                                🚗 {/* Icono simulado */}
                            </div>
                        </div>
                    </Link>

                    

                    {/* Tarjeta Vehículos */}
                    <Link href="dashboard_admin/users" className="w-48 h-60">
                        <div className="w-full h-full bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                            <div className="text-xl text-black font-bold">Usuarios</div>
                            <div className="mt-4">
                                🙍‍♂️ {/* Icono simulado */}
                            </div>
                        </div>
                    </Link>

                    <Link href="dashboard_admin/historial" className="w-48 h-60">
                        <div className="w-full h-full bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                            <div className="text-xl text-black font-bold">Historial</div>
                            <div className="mt-4">
                                ⌛ {/* Icono simulado */}
                            </div>
                        </div>
                    </Link>


                    

                </div>
            </div>
        </div>
    );
}
