// /app/components/Headerv2.tsx
import React from "react";
import Link from "next/link";

const Headerv2 = () => {
  return (
    <header
      style={{
        backgroundColor: "#333",
        color: "white",
        padding: "1rem",
       // textAlign: "center",
        display: "flex",
        justifyContent: "space-between", // Distribuye el contenido
        alignItems: "center", // Centra los elementos verticalmente
      }}
    >
      <div>
        <h1>Bienvenido a Mi Proyecto</h1>
        <p>La mejor aplicación para gestionar inventarios</p>
      </div>
      
      <div>
        <Link href="/">
          <button className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600">
            Cerrar sesión
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Headerv2;
