import { useState, useEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { equipoData } from "../data/equipo";
import "../css/perfil.css";

export default function Perfil() {
  const { id } = useParams();
  const persona = equipoData.find((p) => p.id === id);

  const [peliActiva, setPeliActiva] = useState(null);
  const [discoActivo, setDiscoActivo] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastAnimacion, setToastAnimacion] = useState("");
  const [toastMensaje, setToastMensaje] = useState({ titulo: "", texto: "", icono: "🔥" });

  const [repos, setRepos] = useState([]);
  const [cargandoRepos, setCargandoRepos] = useState(false);
  const [errorRepos, setErrorRepos] = useState(null);

  // Estados del reproductor de audio
  const audioRef = useRef(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const mostrarToast = (titulo, texto, icono = "🔥") => {
    if (toastVisible) return;

    setToastMensaje({ titulo, texto, icono });
    setToastAnimacion("toastIn");
    setToastVisible(true);

    setTimeout(() => {
      setToastAnimacion("toastOut toast-hiding");
      setTimeout(() => {
        setToastVisible(false);
        setToastAnimacion("");
      }, 300);
    }, 2500);
  };

  const enviarSaludo = () => {
    mostrarToast(
      "¡Saludo Enviado!",
      `Le enviaste un saludo virtual a ${persona.nombre}. ¡Gracias por visitar su perfil!`,
      "🔥"
    );
  };

  const copiarEnlacePerfil = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    mostrarToast(
      "¡Enlace Copiado!",
      `Se copió el enlace directo al perfil de ${persona.nombre} al portapapeles.`,
      "🔗"
    );
  };

  const cerrarToast = () => {
    setToastAnimacion("toastOut toast-hiding");
    setTimeout(() => {
      setToastVisible(false);
      setToastAnimacion("");
    }, 300);
  };

  useEffect(() => {
    // Si había audio sonando, detenerlo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setReproduciendo(false);
    setProgreso(0);
    setPeliActiva(null);
    setDiscoActivo(null);
    setToastVisible(false);

    if (persona) {
      document.title = `DataHell | ${persona.nombre}`;
    } else {
      document.title = "DataHell | Perfil no encontrado";
    }
  }, [id, persona]);

  const seleccionarDisco = (disco) => {
    if (discoActivo?.titulo === disco.titulo) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setDiscoActivo(null);
      setReproduciendo(false);
      setProgreso(0);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setDiscoActivo(disco);
      setReproduciendo(false);
      setProgreso(0);
    }
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setReproduciendo(true);
        })
        .catch((err) => {
          console.warn("Reproducción no iniciada:", err);
        });
    }
  };

  const actualizarProgresoAudio = () => {
    if (audioRef.current && audioRef.current.duration) {
      const porcentaje =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgreso(porcentaje);
    }
  };

  const audioTerminado = () => {
    setReproduciendo(false);
    setProgreso(0);
  };

  const adelantarAudio = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const nuevoPorcentaje = Math.max(0, Math.min(1, clickX / rect.width));
    audioRef.current.currentTime = nuevoPorcentaje * audioRef.current.duration;
    setProgreso(nuevoPorcentaje * 100);
  };

  const consultarRepositorios = () => {
    if (!persona || !persona.github) return;

    const username = persona.github.replace(/\/$/, "").split("/").pop();
    setCargandoRepos(true);
    setErrorRepos(null);

    fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=3`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo conectar con GitHub");
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setCargandoRepos(false);
      })
      .catch((err) => {
        setErrorRepos(err.message);
        setCargandoRepos(false);
      });
  };

  useEffect(() => {
    setRepos([]);
    setErrorRepos(null);
    consultarRepositorios();
  }, [id, persona]);

  if (!persona) return <Navigate to="/" />;

  const iconoPelicula = (
    <svg className="icon-mono" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="17" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );

  const iconoDisco = (
    <svg className="icon-mono" viewBox="0 0 24 24">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );

  const formatearNombreRepo = (nombre) => {
    if (!nombre) return "";
    return nombre.replace(/[-_]+/g, " ").trim().toUpperCase();
  };

  return (
    <main className="main-content">
      {/* Controles de navegación superior */}
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {persona.anterior ? (
          <Link to={`/perfil/${persona.anterior}`} className="btn btn-outline">
            🡸 Anterior
          </Link>
        ) : (
          <span style={{ width: "100px" }}></span>
        )}

        <Link to="/" className="btn btn-outline">
          Volver al Inicio
        </Link>

        {persona.siguiente ? (
          <Link to={`/perfil/${persona.siguiente}`} className="btn btn-outline">
            Siguiente 🡺
          </Link>
        ) : (
          <span style={{ width: "100px" }}></span>
        )}
      </div>

      <div className="profile-container">
        {/* Sidebar con información personal */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-lg">
            <img src={persona.avatar} alt={`Avatar ${persona.nombre}`} />
          </div>
          <h1 className="profile-name">{persona.nombre}</h1>
          <p className="profile-role">{persona.rol}</p>
          <p className="profile-bio" style={{ whiteSpace: "pre-line" }}>
            {persona.bio}
          </p>

          <ul className="profile-info-list">
            <li className="profile-info-item">
              <span>Ubicación</span>
              <span>{persona.ubicacion}</span>
            </li>
            <li className="profile-info-item">
              <span>Edad</span>
              <span>{persona.edad}</span>
            </li>
          </ul>

          <blockquote
            className="profile-quote"
            style={{ whiteSpace: "pre-line" }}
          >
            {persona.cita}
          </blockquote>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1.2rem" }}>
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={enviarSaludo}
            >
              Enviar Saludo a {persona.nombre.split(" ")[0]}
            </button>

            <button
              className="btn btn-outline"
              style={{ width: "100%" }}
              onClick={copiarEnlacePerfil}
              aria-label="Compartir perfil de integrante"
            >
              🔗 Compartir Perfil
            </button>
          </div>
        </aside>

        {/* Sección principal del perfil */}
        <section className="profile-main">
          {/* Habilidades destacadas */}
          <div className="card-section">
            <h3 className="section-title">Habilidades Destacadas</h3>
            <div className="skills-grid">
              {persona.habilidades.map((hab, index) => (
                <span key={index} className="skill-tag">
                  {hab}
                </span>
              ))}
            </div>
          </div>

          {/* Actividad en GitHub (API pública) */}
          {persona.github && (
            <div className="card-section">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <h3 className="section-title" style={{ marginBottom: 0 }}>
                  Actividad en GitHub
                </h3>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={consultarRepositorios}
                  disabled={cargandoRepos}
                  style={{
                    fontSize: "0.78rem",
                    padding: "0.25rem 0.65rem",
                    opacity: cargandoRepos ? 0.6 : 1,
                    cursor: cargandoRepos ? "default" : "pointer",
                  }}
                  aria-label="Actualizar repositorios de GitHub"
                >
                  {cargandoRepos ? "Sincronizando..." : "⟳ Actualizar"}
                </button>
              </div>

              {cargandoRepos && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    color: "var(--slate)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Sincronizando repositorios...
                  </p>
                </div>
              )}

              {errorRepos && (
                <div
                  style={{
                    padding: "1rem",
                    border: "1px dashed var(--accent-orange)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--slate)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.8rem",
                  }}
                >
                  <p style={{ margin: 0 }}>⚠️ Error al cargar datos: {errorRepos}</p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={consultarRepositorios}
                    style={{ fontSize: "0.8rem", padding: "0.3rem 0.7rem" }}
                  >
                    ⟳ Reintentar conexión
                  </button>
                </div>
              )}

              {!cargandoRepos && !errorRepos && repos.length === 0 && (
                <p style={{ color: "var(--slate)", fontSize: "0.9rem" }}>
                  Este usuario no tiene repositorios públicos recientes.
                </p>
              )}

              {!cargandoRepos && !errorRepos && repos.length > 0 && (
                <div className="media-list">
                  {repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="media-item"
                      style={{ textDecoration: "none" }}
                    >
                      <span className="media-icon">
                        <svg className="icon-mono" viewBox="0 0 24 24">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                        </svg>
                      </span>

                      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                        <strong
                          style={{
                            color: "var(--ink)",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {formatearNombreRepo(repo.name)}
                        </strong>

                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--slate)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "0.4rem",
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ color: "var(--accent-orange)" }}>
                            {repo.language ? `● ${repo.language}` : ""}
                          </span>
                          <span>⭐ {repo.stargazers_count}</span>
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Películas favoritas */}
          <div className="card-section">
            <h3 className="section-title">Películas Favoritas</h3>
            <div className="media-list">
              {persona.peliculas.map((peli, index) => (
                <div
                  key={index}
                  className={`media-item ${peliActiva?.titulo === peli.titulo ? "active-media" : ""}`}
                  onClick={() =>
                    setPeliActiva(
                      peliActiva?.titulo === peli.titulo ? null : peli,
                    )
                  }
                >
                  <span className="media-icon">{iconoPelicula}</span>
                  <div>
                    <strong>{peli.titulo}</strong>
                    <p style={{ fontSize: "0.8rem", color: "var(--slate)" }}>
                      {peli.anio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {peliActiva && (
              <div className="media-detail-box">
                <div className="media-review-card">
                  <h4 className="media-review-title">
                    {iconoPelicula} <span>Película: {peliActiva.titulo}</span>
                  </h4>
                  <p className="media-review-text">{peliActiva.desc}</p>
                </div>
              </div>
            )}
          </div>

          {/* Discos favoritos con reproductor de audio integrado */}
          <div className="card-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h3 className="section-title" style={{ marginBottom: 0 }}>
                Discos / Artistas Favoritos
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--accent-orange)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>
                ● Incluye Audio Real
              </span>
            </div>

            <div className="media-list">
              {persona.discos.map((disco, index) => (
                <div
                  key={index}
                  className={`media-item ${discoActivo?.titulo === disco.titulo ? "active-media" : ""}`}
                  onClick={() => seleccionarDisco(disco)}
                >
                  <span className="media-icon">{iconoDisco}</span>
                  <div>
                    <strong>{disco.titulo}</strong>
                    <p style={{ fontSize: "0.8rem", color: "var(--slate)" }}>
                      {disco.anio || (disco.artista ? `${disco.artista} · Muestra sonora` : "Música")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {discoActivo && (
              <div className="media-detail-box">
                <div className="media-review-card">
                  <h4 className="media-review-title">
                    {iconoDisco} <span>Álbum: {discoActivo.titulo}</span>
                  </h4>
                  <p className="media-review-text">{discoActivo.desc}</p>
                </div>

                {discoActivo.audioUrl && (
                  <div className="audio-player-card">
                    <div className="audio-player-cover">
                      <img
                        src={discoActivo.portada}
                        alt={`Carátula de ${discoActivo.cancion}`}
                        className="audio-cover-img"
                      />
                      <button
                        type="button"
                        className={`audio-play-btn ${reproduciendo ? "is-playing" : ""}`}
                        onClick={toggleAudio}
                        aria-label={reproduciendo ? "Pausar muestra musical" : "Reproducir muestra musical"}
                      >
                        {reproduciendo ? "⏸" : "▶"}
                      </button>
                    </div>

                    <div className="audio-player-info">
                      <div className="audio-player-header">
                        <div style={{ minWidth: 0 }}>
                          <strong className="audio-track-name">{discoActivo.cancion}</strong>
                          <span className="audio-artist-name">{discoActivo.artista}</span>
                        </div>
                        {reproduciendo && (
                          <div className="sound-wave-bars" title="Sonando en vivo">
                            <span className="wave-bar b1"></span>
                            <span className="wave-bar b2"></span>
                            <span className="wave-bar b3"></span>
                            <span className="wave-bar b4"></span>
                          </div>
                        )}
                      </div>

                      <div
                        className="audio-progress-container"
                        onClick={adelantarAudio}
                        title="Haz clic para avanzar o retroceder"
                      >
                        <div
                          className="audio-progress-fill"
                          style={{ width: `${progreso}%` }}
                        ></div>
                      </div>

                      <div className="audio-player-footer">
                        <span className="audio-tag-badge">Audio Oficial (30s)</span>
                        {discoActivo.enlaceExterno && (
                          <a
                            href={discoActivo.enlaceExterno}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="audio-external-btn"
                          >
                            Escuchar Completo ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <audio
                      ref={audioRef}
                      src={discoActivo.audioUrl}
                      onTimeUpdate={actualizarProgresoAudio}
                      onEnded={audioTerminado}
                      preload="auto"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Datos curiosos */}
          <div className="card-section">
            <h3 className="section-title">Datos Curiosos & Intereses</h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                lineHeight: 1.8,
                fontSize: "0.95rem",
                color: "var(--ink)",
              }}
            >
              {persona.datosCuriosos.map((dato, index) => (
                <li key={index}>· {dato}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Navegación rápida inferior a todos los integrantes */}
      <div className="quick-team-nav-card">
        <h3 className="section-title" style={{ textAlign: "center", marginBottom: "0.4rem" }}>
          Integrantes del Equipo DataHell
        </h3>
        <p style={{ textAlign: "center", color: "var(--slate)", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
          Haz clic en cualquier compañero para visitar su perfil directamente
        </p>
        <div className="quick-team-grid">
          {equipoData.map((m) => {
            const esActivo = m.id === id;
            return (
              <Link
                key={m.id}
                to={`/perfil/${m.id}`}
                className={`quick-member-link ${esActivo ? "is-current" : ""}`}
                title={`Ver perfil de ${m.nombre}`}
              >
                <div className="quick-member-avatar-wrap">
                  <img src={m.avatar} alt={m.nombre} />
                  {esActivo && <span className="current-badge-dot">●</span>}
                </div>
                <strong className="quick-member-name">{m.nombre.split(" ")[0]}</strong>
                <span className="quick-member-role">{m.rol.split("&")[0].split("+")[0].trim()}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Toast universal para saludos o compartir */}
      {toastVisible && (
        <div className={`custom-toast ${toastAnimacion}`}>
          <div className="custom-toast-icon">{toastMensaje.icono}</div>
          <div className="custom-toast-content">
            <div className="custom-toast-title">{toastMensaje.titulo}</div>
            <div className="custom-toast-message">{toastMensaje.texto}</div>
          </div>
          <button
            className="custom-toast-close"
            aria-label="Cerrar notificación"
            onClick={cerrarToast}
          >
            &times;
          </button>
        </div>
      )}
    </main>
  );
}
