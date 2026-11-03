import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import "../css/header.css";

export default function Header({ toggleSidebar, isOpen, tema = "dark", toggleTema }) {
  return (
    <header className="header-fixed" role="banner">
      <div className="header-nav-container">
        <div className="header-left-group">
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

        <div className="header-right-group">
          <button
            className="theme-toggle-btn"
            onClick={toggleTema}
            aria-label={tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {tema === "dark" ? (
              <Sun size={18} className="theme-icon sun-icon" />
            ) : (
              <Moon size={18} className="theme-icon moon-icon" />
            )}
            <span className="theme-toggle-text">
              {tema === "dark" ? "Modo Claro" : "Modo Oscuro"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
