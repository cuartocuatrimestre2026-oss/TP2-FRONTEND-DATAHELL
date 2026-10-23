import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tecnologiasData from "../data/tecnologias_data.json";
import "../css/tecnologias.css";
import {
  LayoutTemplate,
  Code,
  Smartphone,
  Database,
  Server,
  Box,
  Cloud,
  TerminalSquare,
  PenTool,
  GitBranch,
  Cpu,
  Shield,
  Globe,
  Settings,
} from "lucide-react";

const mapaIconos = {
  LayoutTemplate: LayoutTemplate,
  Code: Code,
  Smartphone: Smartphone,
  Database: Database,
  Server: Server,
  Box: Box,
  Cloud: Cloud,
  TerminalSquare: TerminalSquare,
  PenTool: PenTool,
  GitBranch: GitBranch,
  Cpu: Cpu,
  Shield: Shield,
  Globe: Globe,
};

export default function Tecnologias() {
  useEffect(() => {
    document.title = "DataHell | Tecnologías";
  }, []);

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [expandidoId, setExpandidoId] = useState(null);

  useEffect(() => {
    if (expandidoId === null) return;

    const manejarClickAfuera = (e) => {
      if (!e.target.closest(".tech-card")) {
        setExpandidoId(null);
      }
    };

    const manejarTeclaEscape = (e) => {
      if (e.key === "Escape") {
        setExpandidoId(null);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", manejarClickAfuera);
      document.addEventListener("keydown", manejarTeclaEscape);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", manejarClickAfuera);
      document.removeEventListener("keydown", manejarTeclaEscape);
    };
  }, [expandidoId]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [sugerenciaEnviada, setSugerenciaEnviada] = useState(false);

  const categoriasUnicas = [
    "Todas",
    ...new Set(tecnologiasData.map((t) => t.categoria)),
  ].sort();

  const resultadosFiltrados = tecnologiasData.filter((tec) => {
    const coincideTexto =
      tec.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      tec.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === "Todas" || tec.categoria === categoria;

    return coincideTexto && coincideCategoria;
  });

  const manejarEnvioSugerencia = (e) => {
    e.preventDefault();
    setSugerenciaEnviada(true);

    setTimeout(() => {
      setModalAbierto(false);
      setSugerenciaEnviada(false);
    }, 2500);
  };

  return (
    <main className="main-content">
      <div className="tecnologias-header">
        <span className="badge-pill">● Stack Tecnológico</span>
        <h1 className="hero-title" style={{ justifyContent: "center" }}>
          Ecosistema <span className="text-accent">DATAHELL</span>
        </h1>
        <p className="hero-subtitle">
          Inventario de herramientas, librerías y entornos con los que el equipo
          domina el código y combate las complejidades técnicas del infierno
          digital.
        </p>

        <div className="filtros-container">
          <div className="search-box">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar tecnología (ej: React, Docker)..." aria-label="Buscar tecnologías por nombre o descripción"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            className="category-select"
            aria-label="Filtrar tecnologías por categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("_/_", " / ")}
              </option>
            ))}
          </select>
        </div>

        <div className="resultados-info">
          <span>{resultadosFiltrados.length} Tecnologías Indexadas</span>
          <span className="separator">|</span>
          <span
            className="text-accent"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontWeight: 500,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            100% Compatibilidad
          </span>
        </div>
      </div>

      {resultadosFiltrados.length > 0 ? (
        <section className="tech-grid">
          {resultadosFiltrados.map((tec) => (
            <article
              key={tec.id}
              className={`tech-card ${expandidoId === tec.id ? "is-expanded" : ""}`}
              onClick={() => setExpandidoId(expandidoId === tec.id ? null : tec.id)}
            >
              <div className="tech-card-header">
                <div className="tech-icon-wrapper">
                  {(() => {
                    const IconoVisual = mapaIconos[tec.icono] || Settings;
                    return <IconoVisual size={22} />;
                  })()}
                </div>
                <div className="tech-title-group">
                  <h3 className="tech-name">{tec.nombre}</h3>
                </div>
              </div>
              <p className="tech-desc">{tec.descripcion}</p>

              {expandidoId === tec.id && (
                <div className="tech-extra-info">
                  <div className="tech-info-row">
                    <span className="info-label">Versión / Estándar:</span>
                    <span className="info-value">{tec.version}</span>
                  </div>
                  <div className="tech-info-row">
                    <span className="info-label">Licencia:</span>
                    <span className="info-value">{tec.licencia}</span>
                  </div>
                  <div className="tech-info-row">
                    <span className="info-label">Uso en DataHell:</span>
                    <span className="info-value">{tec.uso}</span>
                  </div>
                </div>
              )}

              <div className="tech-card-footer">
                <span className="tech-tag-bottom">
                  {tec.categoria.replace("_/_", " / ")}
                </span>
                <button
                  type="button"
                  className="tech-toggle-btn"
                  aria-expanded={expandidoId === tec.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandidoId(expandidoId === tec.id ? null : tec.id);
                  }}
                >
                  {expandidoId === tec.id ? "Ocultar detalles ▴" : "Ver detalles ▾"}
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            stroke="var(--slate)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Sin resultados</h3>
          <p>No se encontraron tecnologías que coincidan con "{busqueda}".</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setBusqueda("");
              setCategoria("Todas");
            }}
            style={{ marginTop: "1rem" }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <section className="tech-cta-section">
        <span className="cta-overline">· EVOLUCIÓN CONTINUA ·</span>
        <h2 className="cta-title">
          ¿Falta alguna herramienta en nuestro fuego?
        </h2>
        <p className="cta-subtitle">
          Evaluamos constantemente nuevas librerías y estándares abiertos para
          optimizar el rendimiento y la calidad de entrega en cada ciclo.
        </p>
        <div className="cta-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setModalAbierto(true)}
          >
            + Sugerir Herramienta
          </button>
        </div>
      </section>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setModalAbierto(false)}
            >
              &times;
            </button>

            {!sugerenciaEnviada ? (
              <>
                <h3 className="modal-title">Sugerir Tecnología</h3>
                <p className="modal-desc">
                  Indícanos qué herramienta deberíamos incorporar a nuestro
                  ecosistema y por qué.
                </p>

                <form className="modal-form" onSubmit={manejarEnvioSugerencia}>
                  <div className="form-group">
                    <label>Nombre de la herramienta</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Tailwind CSS, Supabase..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoría sugerida</label>
                    <select className="form-input form-select" required>
                      <option value="">Selecciona una opción</option>
                      {categoriasUnicas
                        .filter((c) => c !== "Todas")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.replace("_/_", " / ")}
                          </option>
                        ))}
                      <option value="Otra">Otra...</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>¿Por qué deberíamos usarla?</label>
                    <textarea
                      required
                      placeholder="Breve justificación de su utilidad..."
                      className="form-input form-textarea"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "1rem" }}
                  >
                    Enviar Sugerencia
                  </button>
                </form>
              </>
            ) : (
              <div className="modal-success">
                <div className="success-icon">🔥</div>
                <h3 className="modal-title">¡Sugerencia Recibida!</h3>
                <p className="modal-desc">
                  El equipo de DataHell evaluará la herramienta para el próximo
                  ciclo de desarrollo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
