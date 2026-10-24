import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portada from "./pages/Portada";
import Bitacora from "./pages/Bitacora";
import Perfil from "./pages/Perfil";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";
import BotonSubir from "./components/BotonSubir";
import "./css/global.css";
import Tecnologias from "./pages/Tecnologias";
import ArbolRenderizado from "./pages/ArbolRenderizado";
import NotFound from "./pages/NotFound";

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);
  const cerrarSidebar = () => setSidebarAbierto(false);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Header toggleSidebar={toggleSidebar} isOpen={sidebarAbierto} />

      <div
        style={{
          display: "flex",
          marginTop: "70px",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <Sidebar isOpen={sidebarAbierto} cerrarSidebar={cerrarSidebar} />

        <div
          className={`page-content ${sidebarAbierto ? "sidebar-open" : ""}`}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<Portada />} />
            <Route path="/bitacora" element={<Bitacora />} />
            <Route path="/perfil/:id" element={<Perfil />} />
            <Route path="/stack" element={<Tecnologias />} />
            <Route path="/arbol" element={<ArbolRenderizado />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <footer className="footer" style={{ marginTop: "auto" }}>
            <p>
              © 2026 Equipo DataHell <br />
              Trabajo Práctico Grupal 2 : Desarrollado en React.
            </p>
          </footer>
        </div>
      </div>

      <BotonSubir />
    </BrowserRouter>
  );
}

export default App;
