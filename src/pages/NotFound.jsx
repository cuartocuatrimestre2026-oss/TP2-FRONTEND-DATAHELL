import { useEffect } from "react";
import { Link } from "react-router-dom";
import DataHellRunner from "../components/DataHellRunner";

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
        padding: "2rem 1rem 4rem 1rem",
        minHeight: "70vh",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2rem",
          maxWidth: "760px",
          width: "100%",
          boxShadow: "var(--shadow-lg)",
          marginBottom: "2rem",
        }}
      >
        <span
          style={{
            fontSize: "4.5rem",
            fontWeight: 800,
            fontFamily: "var(--font-heading)",
            color: "var(--accent-orange)",
            lineHeight: 1,
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          404
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            color: "var(--ink)",
            marginBottom: "0.8rem",
            fontWeight: 500,
          }}
        >
          Ruta no encontrada
        </h1>
        <p
          style={{
            color: "var(--slate)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            maxWidth: "600px",
            margin: "0 auto 1.5rem auto",
          }}
        >
          Parece que te has desviado en las profundidades del código. En DataHell creemos que
          todos llevamos un gamer dentro: mientras recalculamos la ruta, ¡ayudá a nuestro diablito
          a esquivar los bugs de producción!
        </p>

        {/* Minijuego embebido */}
        <DataHellRunner />

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" className="btn btn-primary" style={{ padding: "0.8rem 1.8rem" }}>
            🡸 Volver a la Portada
          </Link>
          <Link to="/game" className="btn btn-outline" style={{ padding: "0.8rem 1.8rem" }}>
            🎮 Ver Arcade Completo
          </Link>
        </div>
      </div>
    </main>
  );
}
