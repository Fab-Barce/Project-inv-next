// /app/components/Headerv2.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/app/components/Button";
import Image from "next/image";

const Headerv2 = () => {
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    rol: ""
  });

  useEffect(() => {
    // Obtener información del usuario del localStorage
    const nombre = localStorage.getItem("nombre") || "Usuario";
    const rol = localStorage.getItem("rol") || "";
    
    setUserInfo({
      nombre,
      rol
    });
  }, []);

  const handleLogout = () => {
    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="mr-3 bg-white p-2 rounded-full shadow-md overflow-hidden w-14 h-14 flex items-center justify-center">
              <Image
                src="/logo-clape.jpg"
                alt="CLAPE Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex items-center">
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight">Sistema de Inventario</h1>
                <p className="text-blue-100 text-xs md:text-sm">Gestión eficiente de recursos</p>
              </div>
              <div className="ml-3 bg-white p-2 rounded-full shadow-md overflow-hidden w-14 h-14 flex items-center justify-center">
                <Image
                  src="/logo-mtz.jpg"
                  alt="MTZ Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Información del usuario y botón */}
          <div className="flex items-center space-x-6">
            {/* Información del usuario */}
            <div className="hidden md:flex flex-col items-end text-blue-100">
              <span className="text-sm font-medium">Usuario: {userInfo.nombre}</span>
              {userInfo.rol && (
                <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1">
                  Rol: {userInfo.rol}
                </span>
              )}
            </div>

            {/* Botón de cerrar sesión */}
            <Link href="/" onClick={handleLogout}>
              <Button variant="slate">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar sesión</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headerv2;
