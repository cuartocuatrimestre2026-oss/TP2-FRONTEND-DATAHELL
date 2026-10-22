import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { equipoData } from "../data/equipo";
import MemberCard from "../components/MemberCard";
import "../css/index.css";

const equipoFrases = [
  "«Soy el amo de mi destino, soy el capitán de mi alma» - William E. Henley",
  "«El tiempo fluye como líquido entre tus manos.» — Mariü",
  "«Jehová Jireh : Dios proveerá.»",
  "«No hay nada como volver a un lugar que permanece sin cambios para descubrir cuánto has cambiado tú.» — Nelson Mandela",
  "«Frente al mar la felicidad es una idea simple» — Jean-Claude Izzo",
  "«La perfección del carácter es vivir cada día como si fuese el último, sin apresurarse, sin apatía, sin pretensiones.» - Marco Aurelio",
  "«El verdadero signo de la inteligencia no es el conocimiento, sino la imaginación.» — Albert Einstein",
  "«El único modo de hacer un gran trabajo es amar lo que haces.» — Steve Jobs",
  "«No cuentes los días, haz que los días cuenten.» — Muhammad Ali",
  "«Ahora sé más que lo que sabía antes.» — Mariü",
  "«La creatividad como motor del futuro.» — Ser",
  "«Lo urgente no deja tiempo para lo importante.» — Mafalda",
  "«El que vive en armonía consigo mismo vive en armonía con el Universo.» - Marco Aurelio",
  "«Uno es dueño de lo que calla y esclavo de lo que habla.» — Sigmund Freud",
  "«Ve siempre más allá, porque ahí es donde encontrarás la verdad.» - Albert Camus",
  "«Vemos las cosas, no como son, sino como somos nosotros» - Immanuel Kant",
  "«La inspiración existe, pero tiene que encontrarte trabajando.» - Pablo Picasso",
  "«No temas a la perfección, nunca la alcanzarás.» — Salvador Dalí",
];

export default function Portada() {
  useEffect(() => {
    document.title = "DataHell | Inicio";
  }, []);

  const [fraseActual, setFraseActual] = useState(
    '"Haz clic en el botón para descubrir nuestras frases preferidas."',
  );
  const [fraseAnimando, setFraseAnimando] = useState(false);
  const indicesUsados = useRef([]);

  const generarFrase = () => {
    if (indicesUsados.current.length >= equipoFrases.length) {
      indicesUsados.current = [
        indicesUsados.current[indicesUsados.current.length - 1],
      ];
    }

    const disponibles = equipoFrases
      .map((_, i) => i)
      .filter((i) => !indicesUsados.current.includes(i));

    const randomIndex =
      disponibles[Math.floor(Math.random() * disponibles.length)];
    indicesUsados.current.push(randomIndex);

    setFraseAnimando(true);
    setTimeout(() => {
      setFraseActual(equipoFrases[randomIndex]);
      setFraseAnimando(false);
    }, 200);
  };

  const statsRef = useRef(null);
  const [integrantes, setIntegrantes] = useState("0");
  const [habilidades, setHabilidades] = useState("0");
  const [compromiso, setCompromiso] = useState("0%");

  useEffect(() => {
    let animFrameIds = [];

    const animateValue = (target, setter, suffix = "", duration = 1200) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(ease * target);
        setter(`${currentValue}${suffix}`);
        if (progress < 1) {
          const id = window.requestAnimationFrame(step);
          animFrameIds.push(id);
        } else {
          setter(`${target}${suffix}`);
        }
      };
      const id = window.requestAnimationFrame(step);
      animFrameIds.push(id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValue(5, setIntegrantes, "", 1000);
            animateValue(25, setHabilidades, "", 1200);
            animateValue(100, setCompromiso, "%", 1400);
          } else {
            setIntegrantes("0");
            setHabilidades("0");
            setCompromiso("0%");
          }
        });
      },
      { threshold: 0.15 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
      animFrameIds.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, []);

  return (
    <main className="main-content">
      <section className="hero-section">
        <h1 className="hero-title">
          <img
            src="/img/logo-DataHell.png"
            alt="Logo DataHell"
            className="hero-logo-img"
          />
          <span className="hero-title-text">Equipo DataHell</span>
        </h1>

        <p className="hero-subtitle">
          <br />
          <br />
          En DataHell creemos que desarrollar software no empieza escribiendo
          código. <br /> Comienza escuchando. <br />
          La tecnología no es el objetivo, es la herramienta.
          <br />
          <br />
          Ayudamos a empresas a resolver problemas reales mediante software
          diseñado alrededor de sus necesidades, sus procesos y sus personas.
          Escuchamos, entendemos, cuestionamos y construimos.
          <br />
          Porque sabemos que algunos problemas son simples, otros son complejos
          y algunos directamente parecen salidos del infierno. Nosotros no le
          escapamos al infierno. Entramos, analizamos, entendemos y salimos con
          una solución.
          <br />
          <br />
          Algunos problemas necesitan software. Otros, necesitan Data Hell.
          <br />
          Desde una idea hasta una solución compleja, combinamos desarrollo de
          software, innovación y excelencia técnica para crear productos
          digitales que sean útiles, escalables y preparados para crecer.
          <br />
          Pero nuestro diferencial no está solamente en lo que sabemos hacer,
          sino, en cómo trabajamos...Nos involucramos. Comunicamos. Acompañamos.
          Y entendemos que un buen proyecto no se construye solamente con
          código: se construye con confianza.
          <br />
          <br />
          «DataHell» software inteligente para problemas reales.
        </p>

        <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
          <button className="btn btn-primary" onClick={generarFrase}>
            Inspiración del Día
          </button>
          <p
            style={{
              marginTop: "1rem",
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
              fontSize: "1.1rem",
              color: "var(--slate)",
              transition: "opacity 0.2s ease",
              opacity: fraseAnimando ? 0 : 1,
            }}
          >
            {fraseActual}
          </p>
        </div>

        <div
          ref={statsRef}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
            marginTop: "2rem",
            borderTop: "1px solid var(--mist)",
            paddingTop: "1.5rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: "var(--font-heading)",
                color: "var(--ink)",
              }}
            >
              {integrantes}
            </span>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--slate)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Integrantes
            </p>
          </div>
          <div>
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: "var(--font-heading)",
                color: "var(--ink)",
              }}
            >
              {habilidades}
            </span>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--slate)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Habilidades Total
            </p>
          </div>
          <div>
            <span
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                fontFamily: "var(--font-heading)",
                color: "var(--ink)",
              }}
            >
              {compromiso}
            </span>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--slate)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Compromiso
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            fontFamily: "var(--font-heading)",
            fontSize: "2.2rem",
            fontWeight: 400,
            color: "var(--ink)",
          }}
        >
          Nuestros Integrantes
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--slate)",
            marginBottom: "2rem",
            fontWeight: 400,
          }}
        >
          Haz clic en "Ver Perfil" para conocer más sobre cada integrante de
          DataHell.
        </p>

        <div className="members-grid">
          {equipoData.map((miembro) => (
            <MemberCard key={miembro.id} miembro={miembro} />
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "4rem",
          textAlign: "center",
          background: "var(--white)",
          padding: "3rem 2rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--mist)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            fontFamily: "var(--font-heading)",
            fontSize: "2.2rem",
            fontWeight: 400,
            color: "var(--ink)",
          }}
        >
          Nuestro Ecosistema de Tecnologías
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--slate)",
            marginBottom: "2rem",
            maxWidth: "750px",
            marginLeft: "auto",
            marginRight: "auto",
            fontWeight: 400,
          }}
        >
          Explora los lenguajes, frameworks y herramientas que impulsan nuestros
          desarrollos. <br /> Un entorno técnico cuidadosamente seleccionado y
          en constante evolución para transformar problemas complejos en
          soluciones escalables.
        </p>
        <div style={{ textAlign: "center" }}>
          <Link to="/stack" className="btn btn-primary">
            Explorar Stack Tecnológico 🡺
          </Link>
        </div>
      </section>

      <section
        style={{
          marginTop: "4rem",
          textAlign: "center",
          background: "var(--white)",
          padding: "3rem 2rem",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--mist)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3
          style={{
            marginBottom: "0.75rem",
            fontFamily: "var(--font-heading)",
            fontSize: "1.8rem",
            fontWeight: 400,
            letterSpacing: "0.03em",
          }}
        >
          · Bitácora de Desarrollo ·
        </h3>
        <p
          style={{
            color: "var(--slate)",
            marginBottom: "1.5rem",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            fontWeight: 400,
          }}
        >
          Conoce el proceso de trabajo del equipo, la toma de decisiones,
          dificultades superadas y el registro de la colaboración para el
          desarrollo de esta Web.
        </p>
        <Link to="/bitacora" className="btn btn-primary">
          Explorar la Bitácora
        </Link>
      </section>
    </main>
  );
}
