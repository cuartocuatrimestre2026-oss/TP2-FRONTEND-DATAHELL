import { Link } from "react-router-dom";
import "../css/header.css";

export default function Header({ toggleSidebar, isOpen }) {
  return (
    <header className="header-fixed" role="banner">
      <div className="header-nav-container">
        <button
          className="header-menu-btn"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Cerrar menú de navegación lateral" : "Abrir menú de navegación lateral"}
          aria-expanded={Boolean(isOpen)}
          aria-controls="sidebar-navigation"
        >
          ☰
        </button>

        <Link to="/" className="header-brand-link" aria-label="Ir a la portada de DataHell">
          <img
            src="/img/logo-DataHell.png"
            alt="Logo DataHell"
            className="header-logo-img"
          />
          <span className="header-brand-text">DataHell</span>
        </Link>
      </div>
    </header>
  );
}
