// /app/components/Footer.tsx
import React from "react";

const Footer = () => {
  return (
    <footer style={{ textAlign: "center", padding: "1rem", background: "#f1f1f1", marginTop: "2rem" }}>
      <p style={{ color: "black" }}>&copy; {new Date().getFullYear()} Mi Proyecto</p>
      <p style={{ color: "black" }}>Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;
