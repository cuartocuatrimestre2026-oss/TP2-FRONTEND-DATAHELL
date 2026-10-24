import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bitacoraData from "../data/bitacora.json";
import "../css/bitacora.css";

const entradaFinal = {
  date: "Nuestro lema: Hacer que la tecnología de vanguardia sea accesible para tod@s, democratizando el acceso a soluciones de software que impulsan el progreso y la igualdad de oportunidades.",
  title: "Somos DataHell",
  content: (
    <img
      src="/img/DataHell_equipo.jpeg"
      alt="Equipo Datahell"
      className="final-card-img"
    />
  ),
};

export default function Bitacora() {
  useEffect(() => {
    document.title = "DataHell | Bitácora";
  }, []);

  const [filtroActivo, setFiltroActivo] = useState("all");
  const [isSticky, setIsSticky] = useState(false);
  const [modalArbolAbierto, setModalArbolAbierto] = useState(false);

  const tarjetasRef = useRef([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const manejarScroll = () => {
      if (window.scrollY > 220) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      const centroPantalla = window.innerHeight / 2;
      let tarjetaActivaIndex = -1;
      let distanciaMinima = Infinity;

      tarjetasRef.current.forEach((tarjeta, index) => {
        if (tarjeta && tarjeta.offsetParent !== null) {
          const rect = tarjeta.getBoundingClientRect();
          const centroTarjeta = rect.top + rect.height / 2;
          const distancia = Math.abs(centroPantalla - centroTarjeta);

          if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            tarjetaActivaIndex = index;
          }
        }
      });

      tarjetasRef.current.forEach((tarjeta, index) => {
        if (tarjeta) {
          if (index === tarjetaActivaIndex) {
            tarjeta.classList.remove("scroll-inactive");
            tarjeta.classList.add("scroll-active");
          } else {
            tarjeta.classList.remove("scroll-active");
            tarjeta.classList.add("scroll-inactive");
          }
        }
      });
    };

    window.addEventListener("scroll", manejarScroll, { passive: true });
    window.addEventListener("resize", manejarScroll);
    setTimeout(manejarScroll, 50);

    return () => {
      window.removeEventListener("scroll", manejarScroll);
      window.removeEventListener("resize", manejarScroll);
    };
  }, [filtroActivo]);

  const entradasFiltradas = bitacoraData.filter(
    (entrada) => filtroActivo === "all" || entrada.category === filtroActivo,
  );

  tarjetasRef.current = tarjetasRef.current.slice(
    0,
    entradasFiltradas.length + 1,
  );

  const formatearTexto = (textoBase) => {
    if (!textoBase) return null;
    return textoBase.split("\n").map((linea, numLinea) => {
      const fragmentos = linea.split(/\*\*(.*?)\*\*/g);
      let claseCss = "";
      if (linea.includes("Solución:")) claseCss = "solucion-block";
      if (linea.includes("Dificultad")) claseCss = "dificultad-block";

      return (
        <p key={numLinea} className={claseCss}>
          {fragmentos.map((fragmento, index) =>
            index % 2 === 1 ? (
              <strong key={index}>{fragmento}</strong>
            ) : (
              fragmento
            ),
          )}
        </p>
      );
    });
  };

  return (
    <main className="main-content">
      <div
        className={`hero-wrapper ${isSticky ? "is-sticky" : ""}`}
        ref={heroRef}
        style={{ minHeight: isSticky ? "320px" : "auto" }}
      >
        <div className={`hero-section ${isSticky ? "sticky-hero" : ""}`}>
          <div className="hero-text">
            <h1 className="hero-title">· Bitácora de Desarrollo ·</h1>
            <p className="hero-subtitle">
              Registro cronológico de reuniones, acuerdos, decisiones de diseño,
              retos técnicos y soluciones adoptadas durante el desarrollo de
              esta página Web.
            </p>
          </div>

          <div className="filter-container">
            <div className="filter-row">
              <button
                className={`btn ${filtroActivo === "all" ? "btn-primary" : "btn-outline"} bitacora-filter-btn`}
                onClick={() => setFiltroActivo("all")}
              >
                Todas las Entradas
              </button>
              <button
                className={`btn ${filtroActivo === "decisiones" ? "btn-primary" : "btn-outline"} bitacora-filter-btn`}
                onClick={() => setFiltroActivo("decisiones")}
              >
                Decisiones
              </button>
              <button
                className={`btn ${filtroActivo === "dificultades" ? "btn-primary" : "btn-outline"} bitacora-filter-btn`}
                onClick={() => setFiltroActivo("dificultades")}
              >
                Dificultades
              </button>
            </div>
            <div className="filter-row">
              <button
                className={`btn ${filtroActivo === "git" ? "btn-primary" : "btn-outline"} bitacora-filter-btn`}
                onClick={() => setFiltroActivo("git")}
              >
                Git & Publicación
              </button>
              <button
                className="btn btn-outline bitacora-filter-btn tree-btn"
                onClick={() => setModalArbolAbierto(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "0.4rem" }}
                >
                  <line x1="6" y1="3" x2="6" y2="15"></line>
                  <circle cx="18" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <path d="M18 9a9 9 0 0 1-9 9"></path>
                </svg>
                Árbol de Renderizado
              </button>
            </div>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div className="timeline">
          {entradasFiltradas.map((entrada, index) => (
            <article key={entrada.id} className="timeline-item">
              <div
                className="timeline-card scroll-inactive"
                ref={(el) => (tarjetasRef.current[index] = el)}
              >
                <span className="timeline-date">{entrada.date}</span>
                <h3>{entrada.title}</h3>

                <div
                  style={{
                    color: "var(--slate)",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {formatearTexto(entrada.content)}
                </div>

                {entrada.notes && entrada.notes.length > 0 && (
                  <div className="bitacora-note">
                    <ul className="bitacora-note-list">
                      {entrada.notes.map((nota, i) => (
                        <li key={i} className="bitacora-note-item">
                          <strong>{nota.label}</strong> {nota.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}

          <article className="timeline-item">
            <div
              className="timeline-card scroll-inactive"
              ref={(el) => (tarjetasRef.current[entradasFiltradas.length] = el)}
            >
              <span className="timeline-date">{entradaFinal.date}</span>
              <h3>{entradaFinal.title}</h3>
              {entradaFinal.content}
            </div>
          </article>
        </div>
      </section>

      {modalArbolAbierto && (
        <div
          className="modal-overlay"
          onClick={() => setModalArbolAbierto(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setModalArbolAbierto(false)}
            >
              &times;
            </button>

            <h3 className="modal-title">Árbol de Renderizado</h3>
            <p className="modal-desc">
              Jerarquía de componentes de nuestra Single Page Application.
            </p>

            <div className="tree-code-block">
              <pre>
                {`<App>
  │
  ├─ <ScrollToTop />
  ├─ <Header />
  │
  ├─ <Contenedor Flex>
  │    ├─ <Sidebar />
  │    │
  │    └─ <Routes>
  │         ├─ <Portada />
  │         ├─ <Bitacora />
  │         ├─ <Tecnologias />
  │         ├─ <Perfil />
  │         ├─ <ArbolRenderizado />
  │         └─ <NotFound />
  │
  ├─ <Footer />
  └─ <BotonSubir />`}
              </pre>
            </div>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <Link
                to="/arbol"
                className="btn btn-primary"
                onClick={() => setModalArbolAbierto(false)}
              >
                Explorar Árbol Interactivo Completo 🡺
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
