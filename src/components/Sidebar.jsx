import { Link, useLocation } from "react-router-dom";
import "../css/sidebar.css";

export default function Sidebar({ isOpen, cerrarSidebar }) {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={cerrarSidebar}></div>
      )}

      <aside id="sidebar-navigation" className={`sidebar ${isOpen ? "show" : ""}`} role="navigation" aria-label="Menú principal de navegación">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link
                to="/"
                className={`nav-link ${isActive("/")}`}
                onClick={cerrarSidebar}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/bitacora"
                className={`nav-link ${isActive("/bitacora")}`}
                onClick={cerrarSidebar}
              >
                Bitácora
              </Link>
            </li>

            <li>
              <Link
                to="/stack"
                className={`nav-link ${isActive("/stack")}`}
                onClick={cerrarSidebar}
              >
                Tecnologías
              </Link>
            </li>
            <li>
              <Link
                to="/arbol"
                className={`nav-link ${isActive("/arbol")}`}
                onClick={cerrarSidebar}
              >
                Árbol de Renderizado
              </Link>
            </li>

            <li className="nav-separator">Integrantes</li>

            <li>
              <Link
                to="/perfil/johana"
                className={`nav-link sub-link ${isActive("/perfil/johana")}`}
                onClick={cerrarSidebar}
              >
                Johana
              </Link>
            </li>
            <li>
              <Link
                to="/perfil/mariela"
                className={`nav-link sub-link ${isActive("/perfil/mariela")}`}
                onClick={cerrarSidebar}
              >
                Mariela
              </Link>
            </li>
            <li>
              <Link
                to="/perfil/miguel"
                className={`nav-link sub-link ${isActive("/perfil/miguel")}`}
                onClick={cerrarSidebar}
              >
                Miguel
              </Link>
            </li>
            <li>
              <Link
                to="/perfil/sergio"
                className={`nav-link sub-link ${isActive("/perfil/sergio")}`}
                onClick={cerrarSidebar}
              >
                Sergio
              </Link>
            </li>
            <li>
              <Link
                to="/perfil/sonia"
                className={`nav-link sub-link ${isActive("/perfil/sonia")}`}
                onClick={cerrarSidebar}
              >
                Sonia
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <a
            href="https://github.com/cuartocuatrimestre2026-oss/TP2-FRONTEND-DATAHELL"
            target="_blank"
            rel="noopener noreferrer"
            className="repo-link"
          >
            <svg className="icon-mono" viewBox="0 0 24 24">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            Repositorio TP2
          </a>
        </div>
      </aside>
    </>
  );
}
