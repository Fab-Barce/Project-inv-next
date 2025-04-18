import Link from "next/link";
import Headerv2 from "../components/headerv2";

export default function Home() {
    return (
        <div>
          <Headerv2 />
          <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center py-12 px-6">
            
            {/* Título principal */}
            <h1 className="text-4xl font-bold text-blue-600 mb-10 text-center">
              Bienvenido al Sistema de Gestión
            </h1>
      
            {/* Tarjetas de navegación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Inventario */}
              <Link href="/dashboard/inventario" className="group">
                <div className="bg-white shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl mb-4">📦</div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">Inventario</h2>
                </div>
              </Link>
      
              {/* Vehículos */}
              <Link href="/dashboard/vehiculos" className="group">
                <div className="bg-white shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl mb-4">🚗</div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">Vehículos</h2>
                </div>
              </Link>
      
              {/* Historial */}
              <Link href="/dashboard/historial" className="group">
                <div className="bg-white shadow-md rounded-xl p-15 flex flex-col items-center justify-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                  <div className="text-4xl mb-4">⌛</div>
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">Historial</h2>
                </div>
              </Link>
      
            </div>
          </div>
        </div>
      );
      
}
