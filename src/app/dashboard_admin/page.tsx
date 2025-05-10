"use client";
import Link from "next/link";
import Header_admin from "../components/header_admin";
import withAuth from "../utils/withAuth";
import Footer from "../components/footer";

function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header_admin />
          
          <main className="flex-grow container mx-auto px-4 py-8 mt-10">
            {/* Título principal */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Panel de Administración
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Administra usuarios, configura el sistema y gestiona todos los aspectos de la aplicación desde este panel central.
              </p>
            </div>
      
            {/* Tarjetas de navegación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-20 gap-6 max-w-6xl mx-auto">
              
              {/* Inventario */}
              <Link href="/dashboard_admin/inventario" className="group">
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Inventario</h2>
                  <p className="text-gray-500 text-center mt-2 text-sm">
                    Gestiona refacciones y recursos
                  </p>
                </div>
              </Link>
      
              {/* Vehículos */}
              <Link href="/dashboard_admin/vehiculos" className="group">
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Vehículos</h2>
                  <p className="text-gray-500 text-center mt-2 text-sm">
                    Gestiona la flota de vehículos
                  </p>
                </div>
              </Link>
      
              {/* Usuarios */}
              <Link href="/dashboard_admin/users" className="group">
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">Usuarios</h2>
                  <p className="text-gray-500 text-center mt-2 text-sm">
                    Gestiona usuarios y permisos
                  </p>
                </div>
              </Link>
      
              {/* Historial */}
              <Link href="/dashboard_admin/historial" className="group">
                <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="bg-amber-100 p-4 rounded-full mb-4 group-hover:bg-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">Historial</h2>
                  <p className="text-gray-500 text-center mt-2 text-sm">
                    Consulta movimientos y registros
                  </p>
                </div>
              </Link>
            </div>
            
            {/* Sección de estadísticas rápidas */}
            
          </main>
          
          
        </div>
      );
      
}
export default withAuth(Home, "admin");