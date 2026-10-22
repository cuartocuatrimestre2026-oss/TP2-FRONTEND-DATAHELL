import { useState, useEffect } from "react";
import "../css/botonSubir.css";

export default function BotonSubir() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const controlarVisibilidad = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", controlarVisibilidad, { passive: true });
    return () => window.removeEventListener("scroll", controlarVisibilidad);
  }, []);

  const subirArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`btn-subir ${visible ? "visible" : ""}`}
      onClick={subirArriba}
      aria-label="Volver arriba"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
}
