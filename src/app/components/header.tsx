// /app/components/Header.tsx
import React from "react";

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#333",
        color: "white",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h1>Bienvenido a Mi Proyecto </h1>
      <p>La mejor aplicación para gestionar inventarios</p>
    </header>
  );
};

export default Header;
