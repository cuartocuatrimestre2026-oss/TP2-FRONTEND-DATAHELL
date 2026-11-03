import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/arbol.css";

const arbolData = {
  id: "app",
  nombre: "<App />",
  tipo: "Root / Orquestador",
  desc: "Componente raíz de la SPA. Inicializa el BrowserRouter, eleva el estado global del menú móvil (sidebarAbierto) y orquesta la estructura común.",
  props: "Ninguna (Root)",
  estado: "sidebarAbierto (boolean), tema (string: dark | light)",
  hijos: [
    {
      id: "scroll",
      nombre: "<ScrollToTop />",
      tipo: "Utilidad Global",
      desc: "Escucha los cambios de ruta con useLocation y restablece la posición del scroll a (0, 0) para una navegación fluida.",
      props: "Ninguna",
      estado: "Sin estado propio",
    },
    {
      id: "header",
      nombre: "<Header />",
      tipo: "Layout / Navegación",
      desc: "Cabecera superior fija con navegación institucional, logotipo oficial de DataHell, activador de menú lateral y switch de tema Claro/Oscuro.",
      props: "toggleSidebar, isOpen, tema, toggleTema",
      estado: "Sin estado propio",
    },
    {
      id: "sidebar",
      nombre: "<Sidebar />",
      tipo: "Layout / Menú Lateral",
      desc: "Menú retráctil compartido ('off-canvas') con indicador visual de ruta activa (useLocation) y enlaces a integrantes y secciones.",
      props: "isOpen: boolean, cerrarSidebar: function",
      estado: "Sin estado propio (controlado por props)",
    },
    {
      id: "routes",
      nombre: "<Routes />",
      tipo: "React Router Switch",
      desc: "Área de contenido dinámico que evalúa la URL actual y renderiza la vista correspondiente mediante componentes modulares.",
      props: "Rutas anidadas",
      estado: "Gestionado por react-router-dom",
      hijos: [
        {
          id: "portada",
          nombre: "<Portada /> (Ruta '/')",
          tipo: "Página Principal",
          desc: "Presentación del equipo, contadores interactivos, generador de frases inspiracionales, filtro por áreas, galería de miembros y CTA de tecnologías.",
          props: "Ninguna",
          estado: "fraseActual, fraseAnimando, areaFiltro, contadores dinámicos",
        },
        {
          id: "bitacora",
          nombre: "<Bitacora /> (Ruta '/bitacora')",
          tipo: "Página de Proceso",
          desc: "Registro cronológico de reuniones, acuerdos y desafíos técnicos. Implementa Scroll-Spy reactivo y filtrado por categorías.",
          props: "Ninguna",
          estado: "filtroActivo, isSticky",
        },
        {
          id: "stack",
          nombre: "<Tecnologias /> (Ruta '/stack')",
          tipo: "Página de Catálogo",
          desc: "Ecosistema de tecnologías de DataHell en JSON local. Cuenta con buscador en tiempo real, selector de categorías, selector de orden (A-Z), sistema de favoritos con localStorage y modal de sugerencias.",
          props: "Ninguna",
          estado: "busqueda, categoria, orden, favoritos, soloFavoritos, expandidoId, modalAbierto",
        },
        {
          id: "perfil",
          nombre: "<Perfil /> (Ruta '/perfil/:id')",
          tipo: "Página Paramétrica",
          desc: "Componente reutilizable inteligente. Intercepta el ID de la URL con useParams, renderiza la información del integrante, reproductor de audio real HTML5 para discos, compartir perfil al portapapeles y consume la API de GitHub.",
          props: "id (vía useParams)",
          estado: "peliActiva, discoActivo, toastVisible, toastMensaje, repos, cargandoRepos, errorRepos, reproduciendo, progreso",
        },
        {
          id: "arbol_view",
          nombre: "<ArbolRenderizado /> (Ruta '/arbol')",
          tipo: "Página de Arquitectura",
          desc: "Vista interactiva requerida por la cátedra que expone el árbol de renderizado de componentes con capacidad de colapsar y expandir nodos y buscador en tiempo real.",
          props: "Ninguna",
          estado: "abiertos (objeto booleano), filtro (string de búsqueda)",
        },
        {
          id: "game",
          nombre: "<ArcadeGame /> (Ruta '/game')",
          tipo: "Easter Egg / Minijuego",
          desc: "Experiencia interactiva arcade: 'En DataHell creemos que todos llevamos un gamer dentro'. Controla a nuestro diablito esquivando bugs con Web Audio API sintetizada.",
          props: "Ninguna",
          estado: "Sin estado propio (orquesta el componente de juego)",
          hijos: [
            {
              id: "runner",
              nombre: "<DataHellRunner />",
              tipo: "Componente Arcade Canvas",
              desc: "Motor de juego completo en HTML5 Canvas: física de saltos, generación procedural de bugs/obstáculos, sistema de partículas, puntuación con récord en localStorage y efectos sonoros 8-bit con Web Audio API.",
              props: "Ninguna",
              estado: "isPlaying, gameOver, score, highScore, soundEnabled",
            },
          ],
        },
        {
          id: "notfound",
          nombre: "<NotFound /> (Ruta '*')",
          tipo: "Página de Error 404",
          desc: "Vista de resiliencia de navegación. Captura rutas no declaradas, embebe el minijuego <DataHellRunner /> como pasatiempo y ofrece retorno accesible.",
          props: "Ninguna",
          estado: "Sin estado propio",
          hijos: [
            {
              id: "notfound_runner",
              nombre: "<DataHellRunner />",
              tipo: "Componente Arcade Canvas (Embebido)",
              desc: "Instancia interactiva del minijuego para convertir una experiencia de error 404 en una sorpresa interactiva para el usuario.",
              props: "Ninguna",
              estado: "isPlaying, gameOver, score, highScore, soundEnabled",
            },
          ],
        },
      ],
    },
    {
      id: "footer",
      nombre: "<Footer />",
      tipo: "Layout / Pie de Página",
      desc: "Pie de página institucional compartido entre todas las vistas de la aplicación.",
      props: "Ninguna",
      estado: "Estático",
    },
    {
      id: "boton_subir",
      nombre: "<BotonSubir />",
      tipo: "Componente Flotante",
      desc: "Botón flotante con detección de evento scroll en la ventana para permitir un retorno rápido a la parte superior.",
      props: "Ninguna",
      estado: "visible (boolean)",
    },
  ],
};

function NodoComponente({ nodo, abiertos, toggleNodo, filtro }) {
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
  const estaAbierto = abiertos[nodo.id];

  const busquedaLimpia = filtro.trim().toLowerCase();
  const coincide =
    busquedaLimpia !== "" &&
    (nodo.nombre.toLowerCase().includes(busquedaLimpia) ||
      nodo.desc.toLowerCase().includes(busquedaLimpia) ||
      (nodo.props && nodo.props.toLowerCase().includes(busquedaLimpia)) ||
      (nodo.estado && nodo.estado.toLowerCase().includes(busquedaLimpia)) ||
      nodo.tipo.toLowerCase().includes(busquedaLimpia));

  return (
    <li className={`tree-node ${coincide ? "has-match" : ""}`}>
      <div
        className={`tree-card ${coincide ? "tree-card-match" : ""}`}
        onClick={() => tieneHijos && toggleNodo(nodo.id)}
      >
        {tieneHijos ? (
          <button
            className="tree-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleNodo(nodo.id);
            }}
            aria-label={
              estaAbierto
                ? `Colapsar ${nodo.nombre}`
                : `Expandir ${nodo.nombre}`
            }
          >
            {estaAbierto ? "−" : "+"}
          </button>
        ) : (
          <span
            className="tree-toggle-btn"
            style={{ opacity: 0.35, cursor: "default" }}
          >
            ·
          </span>
        )}

        <div className="tree-info">
          <div className="tree-header">
            <span
              className={`tree-component-name ${coincide ? "highlight-text" : ""}`}
            >
              {nodo.nombre}
            </span>
            <span
              className={`tree-type-badge ${nodo.tipo.includes("Página") ? "route" : ""}`}
            >
              {nodo.tipo}
            </span>
          </div>

          <p className="tree-desc">{nodo.desc}</p>

          <div className="tree-details">
            {nodo.props && (
              <span>
                <strong>Props:</strong> <code>{nodo.props}</code>
              </span>
            )}
            {nodo.estado && (
              <span>
                <strong>Estado:</strong> <code>{nodo.estado}</code>
              </span>
            )}
          </div>
        </div>
      </div>

      {tieneHijos && estaAbierto && (
        <ul className="tree-children">
          {nodo.hijos.map((hijo) => (
            <NodoComponente
              key={hijo.id}
              nodo={hijo}
              abiertos={abiertos}
              toggleNodo={toggleNodo}
              filtro={filtro}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ArbolRenderizado() {
  useEffect(() => {
    document.title = "DataHell | Árbol de Renderizado";
  }, []);

  const todosLosIds = [
    "app",
    "scroll",
    "header",
    "sidebar",
    "routes",
    "portada",
    "bitacora",
    "stack",
    "perfil",
    "arbol_view",
    "notfound",
    "footer",
    "boton_subir",
  ];

  const estadoInicial = {
    app: true,
    routes: true,
    portada: false,
    bitacora: false,
    stack: false,
    perfil: false,
    arbol_view: false,
  };

  const [abiertos, setAbiertos] = useState(estadoInicial);
  const [filtro, setFiltro] = useState("");

  const toggleNodo = (id) => {
    setAbiertos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandirTodo = () => {
    const todos = {};
    todosLosIds.forEach((id) => (todos[id] = true));
    setAbiertos(todos);
  };

  const colapsarTodo = () => {
    setAbiertos({});
  };

  const manejarCambioFiltro = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    if (valor.trim() !== "") {
      expandirTodo();
    }
  };

  return (
    <main className="main-content">
      <section className="arbol-hero">
        <h1 className="arbol-title">· Árbol de Renderizado de Componentes ·</h1>
        <p className="arbol-subtitle">
          Jerarquía interactiva de componentes de nuestra Single Page
          Application en React. Haz clic en cualquier nodo o utiliza los
          controles para expandir y contraer sus ramas, inspeccionando la
          arquitectura declarativa de la aplicación.
        </p>

        {/* Buscador reactivo del árbol */}
        <div className="arbol-search-wrapper">
          <input
            type="text"
            className="arbol-search-input"
            placeholder="Buscar por componente, hook, prop o ruta (ej: Header, useState, Perfil)..."
            value={filtro}
            onChange={manejarCambioFiltro}
            aria-label="Buscar componente en el árbol"
          />
          {filtro && (
            <button
              type="button"
              className="arbol-search-clear"
              onClick={() => setFiltro("")}
              aria-label="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>

        <div className="arbol-actions">
          <button className="btn btn-primary" onClick={expandirTodo}>
            + Expandir Todo
          </button>
          <button className="btn btn-outline" onClick={colapsarTodo}>
            − Colapsar Todo
          </button>
          <Link to="/bitacora" className="btn btn-outline">
            🡸 Volver a Bitácora
          </Link>
        </div>
      </section>

      <section className="arbol-container">
        <ul className="tree-root">
          <NodoComponente
            nodo={arbolData}
            abiertos={abiertos}
            toggleNodo={toggleNodo}
            filtro={filtro}
          />
        </ul>
      </section>
    </main>
  );
}
