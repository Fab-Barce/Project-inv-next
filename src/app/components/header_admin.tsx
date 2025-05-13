"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/app/components/Button";
import Image from "next/image";

import {
  XMarkIcon,
  ChevronRightIcon,
  BuildingStorefrontIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

const Header_admin = () => {
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    rol: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const nombre = localStorage.getItem("nombre") || "Usuario";
    const rol = localStorage.getItem("rol") || "";
    setUserInfo({ nombre, rol });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-500 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className="bg-white p-2 rounded-full shadow-md overflow-hidden w-14 h-14 flex items-center justify-center">
          <Image src="/logo-clape.jpg" alt="CLAPE Logo" width={48} height={48} className="object-contain" />
        </div>

        <div className="flex flex-col items-center text-center">
          <h1 className="text-lg md:text-xl font-bold tracking-tight">Sistema de Inventario</h1>
          <p className="text-blue-100 text-xs md:text-sm">Gestión eficiente de recursos</p>
        </div>

        <div className="bg-white p-2 rounded-full shadow-md overflow-hidden w-14 h-14 flex items-center justify-center">
          <Image src="/logo-mtz.jpg" alt="MTZ Logo" width={48} height={48} className="object-contain" />
        </div>

        <div className="flex flex-col items-end text-blue-100">
          <span className="text-sm font-medium">Usuario: {userInfo.nombre}</span>
          {userInfo.rol && (
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1">Rol: {userInfo.rol}</span>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      >
        <div
          className={`fixed top-0 left-0 h-full w-75 bg-white shadow-lg z-50 flex flex-col transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 bg-blue-700 text-white flex justify-between items-center">
            <h2 className="text-lg font-bold">Menú</h2>
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-4 text-sm">
            {/* Inventario */}
            <div>
              <button
                onClick={() => toggleSection("inventario")}
                className="ml-1 w-full text-left text-blue-800 font-semibold flex justify-between items-center uppercase tracking-wide text-xs hover:text-blue-600"
              >
                Inventario
                <ChevronRightIcon
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    openSection === "inventario" ? "rotate-90" : ""
                  }`}
                />
              </button>
              <ul
                className={`ml-5 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                  openSection === "inventario" ? "max-h-40" : "max-h-0"
                }`}
              >
                <li>
                  <Link href="/dashboard_admin/inventario" onClick={toggleSidebar} className="flex items-center text-blue-700 hover:text-blue-900 hover:underline">
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                    Refacciones
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard_admin/inventario/categorias" onClick={toggleSidebar} className="ml-4 flex items-center text-blue-700 hover:text-blue-900 hover:underline">
                    <FolderIcon className="h-4 w-4 mr-2" />
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard_admin/inventario/proveedores" onClick={toggleSidebar} className="ml-4 flex items-center text-blue-700 hover:text-blue-900 hover:underline">
                    <BuildingStorefrontIcon className="h-4 w-4 mr-2" />
                    Proveedores
                  </Link>
                </li>
              </ul>
            </div>

            {/* Vehículos */}
            <div>
              <button
                onClick={() => toggleSection("vehiculos")}
                className="ml-1 w-full text-left text-blue-800 font-semibold flex justify-between items-center uppercase tracking-wide text-xs hover:text-blue-600"
              >
                Vehículos
                <ChevronRightIcon
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    openSection === "vehiculos" ? "rotate-90" : ""
                  }`}
                />
              </button>
              <ul
                className={`ml-5 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                  openSection === "vehiculos" ? "max-h-40" : "max-h-0"
                }`}
              >
                <li>
                  <Link href="/dashboard_admin/vehiculos" onClick={toggleSidebar} className="flex items-center text-blue-700 hover:text-blue-900 hover:underline">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Vehículos
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard_admin/vehiculos/operadores" onClick={toggleSidebar} className="ml-4 flex items-center text-blue-700 hover:text-blue-900 hover:underline">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    Operadores
                  </Link>
                </li>
              </ul>
            </div>

            {/* Usuarios */}
            <div>
              <Link
                href="/dashboard_admin/users"
                onClick={toggleSidebar}
                className="ml-1 flex items-center text-blue-800 font-semibold uppercase tracking-wide text-xs hover:text-blue-600"
              >
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Usuarios
              </Link>
            </div>

            {/* Historial */}
            <div>
              <Link
                href="/dashboard_admin/historial"
                onClick={toggleSidebar}
                className="ml-1 flex items-center text-blue-800 font-semibold uppercase tracking-wide text-xs hover:text-blue-600"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Historial
              </Link>
            </div>
          </nav>

          {/* Cerrar sesión */}
          <div className="p-4 bg-blue-700 text-white flex justify-between items-center">
            <Link href="/" onClick={handleLogout}>
              <Button variant="slate">
                <div className="flex items-center space-x-2">
                  <PowerIcon className="h-4 w-4" />
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

export default Header_admin;
