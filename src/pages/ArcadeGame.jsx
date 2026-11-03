import { useEffect } from "react";
import { Link } from "react-router-dom";
import DataHellRunner from "../components/DataHellRunner";

export default function ArcadeGame() {
  useEffect(() => {
    document.title = "DataHell | Arcade Runner";
  }, []);

  return (
    <main className="main-content" style={{ textAlign: "center", paddingBottom: "4rem" }}>
      <section style={{ maxWidth: "780px", margin: "0 auto 2rem auto" }}>
        <span className="badge-pill">● DataHell Arcade Edition</span>
        <h1 className="hero-title" style={{ justifyContent: "center", marginTop: "0.5rem" }}>
          ¿Te sobró tiempo entre despliegues?
        </h1>
        <p className="hero-subtitle" style={{ maxWidth: "680px", margin: "0.8rem auto 1.5rem auto" }}>
          El clásico juego de cuando te quedás sin conexión... pero ahora con internet y
          en las profundidades de <strong>DataHell</strong>. Controlá a nuestro dev de guardia,
          saltá bugs de producción, caídas de servidores y glitches de código para salvar
          la base de datos.
        </p>
      </section>

      {/* Mini-juego interactivo */}
      <DataHellRunner />

      <div
        style={{
          marginTop: "2.5rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" className="btn btn-outline">
          🡸 Volver al Inicio
        </Link>
        <Link to="/stack" className="btn btn-primary">
          Explorar Tecnologías 🡺
        </Link>
      </div>
    </main>
  );
}
