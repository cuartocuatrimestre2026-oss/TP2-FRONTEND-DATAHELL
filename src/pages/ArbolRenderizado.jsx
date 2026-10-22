import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/arbol.css";

const arbolData = {
  id: "app",
  nombre: "<App />",
  tipo: "Root / Orquestador",
  desc: "Componente raíz de la SPA. Inicializa el BrowserRouter, eleva el estado global del menú móvil (sidebarAbierto) y orquesta la estructura común.",
  props: "Ninguna (Root)",
  estado: "sidebarAbierto (boolean)",
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
      desc: "Cabecera superior fija con navegación institucional, logotipo oficial de DataHell y activador del menú lateral.",
      props: "toggleSidebar: function",
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
          desc: "Presentación del equipo, contadores interactivos, generador de frases inspiracionales, galería de miembros y CTA de tecnologías.",
          props: "Ninguna",
          estado: "fraseActual, fraseAnimando, contadores dinámicos",
        },
        {
          id: "bitacora",
          nombre: "<Bitacora /> (Ruta '/bitacora')",
          tipo: "Página de Proceso",
          desc: "Registro cronológico de reuniones, acuerdos y desafíos técnicos. Implementa Scroll-Spy reactivo y filtrado por categorías.",
          props: "Ninguna",
          estado: "filtroActivo, isSticky, modalArbolAbierto",
        },
        {
          id: "stack",
          nombre: "<Tecnologias /> (Ruta '/stack')",
          tipo: "Página de Catálogo",
          desc: "Ecosistema de tecnologías de DataHell en JSON local. Cuenta con buscador en tiempo real, selector de categorías y modal de sugerencias.",
          props: "Ninguna",
          estado: "busqueda, categoria, modalAbierto, sugerenciaEnviada",
        },
        {
          id: "perfil",
          nombre: "<Perfil /> (Ruta '/perfil/:id')",
          tipo: "Página Paramétrica",
          desc: "Componente reutilizable inteligente. Intercepta el ID de la URL con useParams, renderiza la información del integrante y consume la API de GitHub.",
          props: "id (vía useParams)",
          estado: "peliActiva, discoActivo, toastVisible, repos, cargandoRepos, errorRepos",
        },
        {
          id: "arbol_view",
          nombre: "<ArbolRenderizado /> (Ruta '/arbol')",
          tipo: "Página de Arquitectura",
          desc: "Vista interactiva requerida por la cátedra que expone el árbol de renderizado de componentes con capacidad de colapsar y expandir nodos.",
          props: "Ninguna",
          estado: "nodosAbiertos (Set / Objeto)",
        },
        {
          id: "notfound",
          nombre: "<NotFound /> (Ruta '*')",
          tipo: "Página de Error 404",
          desc: "Vista de resiliencia de navegación. Captura rutas no declaradas y ofrece un retorno accesible a la portada.",
          props: "Ninguna",
          estado: "Sin estado propio",
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

function NodoComponente({ nodo, abiertos, toggleNodo }) {
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
  const estaAbierto = abiertos[nodo.id];

  return (
    <li className="tree-node">
      <div className="tree-card" onClick={() => tieneHijos && toggleNodo(nodo.id)}>
        {tieneHijos ? (
          <button
            className="tree-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleNodo(nodo.id);
            }}
            aria-label={estaAbierto ? `Colapsar ${nodo.nombre}` : `Expandir ${nodo.nombre}`}
          >
            {estaAbierto ? "−" : "+"}
          </button>
        ) : (
          <span className="tree-toggle-btn" style={{ opacity: 0.35, cursor: "default" }}>
            ·
          </span>
        )}

        <div className="tree-info">
          <div className="tree-header">
            <span className="tree-component-name">{nodo.nombre}</span>
            <span className={`tree-type-badge ${nodo.tipo.includes("Página") ? "route" : ""}`}>
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

  const todosLosIds = ["app", "routes", "portada", "bitacora", "stack", "perfil", "arbol_view", "notfound"];

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

  return (
    <main className="main-content">
      <section className="arbol-hero">
        <h1 className="arbol-title">· Árbol de Renderizado de Componentes ·</h1>
        <p className="arbol-subtitle">
          Jerarquía interactiva de componentes de nuestra Single Page Application en React.
          Haz clic en cualquier nodo o utiliza los controles para expandir y contraer sus ramas,
          inspeccionando la arquitectura declarativa de la aplicación.
        </p>

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
          />
        </ul>
      </section>
    </main>
  );
}
