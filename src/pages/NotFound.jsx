import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "DataHell | 404 No Encontrado";
  }, []);

  return (
    <main
      className="main-content"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "60vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "rgba(26, 24, 25, 0.7)",
          border: "1px solid var(--accent-orange)",
          borderRadius: "var(--radius-lg)",
          padding: "3.5rem 2rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        <span
          style={{
            fontSize: "4.5rem",
            fontWeight: 700,
            fontFamily: "var(--font-heading)",
            color: "var(--accent-orange)",
            lineHeight: 1,
            display: "block",
            marginBottom: "1rem",
          }}
        >
          404
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            color: "var(--ink)",
            marginBottom: "1rem",
            fontWeight: 400,
          }}
        >
          Ruta no encontrada
        </h1>
        <p
          style={{
            color: "var(--slate)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          Parece que te has desviado en las profundidades de DataHell. La sección
          o recurso que buscas no existe o fue reubicada.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: "0.8rem 1.8rem" }}>
          Volver a la Portada
        </Link>
      </div>
    </main>
  );
}
