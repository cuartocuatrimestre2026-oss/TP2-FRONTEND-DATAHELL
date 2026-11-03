import { useState, useEffect, useRef } from "react";
import "../css/runner.css";

export default function DataHellRunner() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem("datahell_runner_best") || "0", 10);
    } catch (e) {
      return 0;
    }
  });

  // Sonidos retro generados con Web Audio API (0 dependencias)
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === "jump") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "milestone") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "gameover") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      }
    } catch (e) {
      // Audio context bloqueado hasta interacción de usuario
    }
  };

  const gameLoopRef = useRef(null);
  const gameStateRef = useRef({
    player: {
      x: 45,
      y: 140,
      width: 28,
      height: 38,
      vy: 0,
      gravity: 0.65,
      jumpForce: -11.5,
      isGrounded: true,
      legFrame: 0,
    },
    obstacles: [],
    particles: [],
    groundY: 178,
    speed: 4.8,
    score: 0,
    frameCount: 0,
    nextObstacleIn: 70,
  });

  // Salto del jugador
  const triggerJump = () => {
    const s = gameStateRef.current;
    if (gameOver) {
      restartGame();
      return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
    }
    if (s.player.isGrounded) {
      s.player.vy = s.player.jumpForce;
      s.player.isGrounded = false;
      playSound("jump");

      // Partículas al saltar
      for (let i = 0; i < 5; i++) {
        s.particles.push({
          x: s.player.x + 8,
          y: s.groundY - 4,
          vx: (Math.random() - 0.5) * 3 - 2,
          vy: -Math.random() * 2 - 1,
          size: Math.random() * 3 + 2,
          life: 18,
          color: i % 2 === 0 ? "#c6490f" : "#ff7b00",
        });
      }
    }
  };

  const restartGame = () => {
    const s = gameStateRef.current;
    s.player.y = 140;
    s.player.vy = 0;
    s.player.isGrounded = true;
    s.obstacles = [];
    s.particles = [];
    s.speed = 4.8;
    s.score = 0;
    s.frameCount = 0;
    s.nextObstacleIn = 70;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        triggerJump();
      }
      if (e.code === "Enter" && gameOver) {
        e.preventDefault();
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const s = gameStateRef.current;

      // Dimensiones de referencia
      const W = canvas.width;
      const H = canvas.height;

      // Limpieza de pantalla
      ctx.clearRect(0, 0, W, H);

      // Fondo dinámico según tema
      ctx.fillStyle = isLight ? "#fbf9f5" : "#141213";
      ctx.fillRect(0, 0, W, H);

      // Línea de suelo estilizada
      ctx.strokeStyle = isLight ? "rgba(22, 20, 21, 0.2)" : "rgba(234, 240, 240, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(W, s.groundY);
      ctx.stroke();

      // Puntos decorativos del suelo (efecto velocidad)
      ctx.fillStyle = isLight ? "rgba(198, 73, 15, 0.35)" : "rgba(198, 73, 15, 0.45)";
      for (let x = 0; x < W; x += 40) {
        const offset = (x - (s.frameCount * s.speed) % 40 + W) % W;
        ctx.fillRect(offset, s.groundY + 4, 12, 1.5);
      }

      if (isPlaying && !gameOver) {
        s.frameCount++;
        s.score += 0.15;
        const currentScore = Math.floor(s.score);
        setScore(currentScore);

        if (currentScore > 0 && currentScore % 100 === 0 && Math.floor(s.score - 0.15) % 100 !== 0) {
          playSound("milestone");
        }

        // Aceleración gradual
        if (s.frameCount % 300 === 0 && s.speed < 9.5) {
          s.speed += 0.4;
        }

        // Físicas del jugador
        s.player.vy += s.player.gravity;
        s.player.y += s.player.vy;

        if (s.player.y >= s.groundY - s.player.height) {
          s.player.y = s.groundY - s.player.height;
          s.player.vy = 0;
          s.player.isGrounded = true;
        }

        if (s.frameCount % 5 === 0) {
          s.player.legFrame = (s.player.legFrame + 1) % 2;
        }

        // Generación de obstáculos
        s.nextObstacleIn--;
        if (s.nextObstacleIn <= 0) {
          const tipos = [
            { tipo: "bug", w: 22, h: 26, name: "Bug 500" },
            { tipo: "server", w: 20, h: 36, name: "Crash" },
            { tipo: "fire", w: 26, h: 28, name: "Glitch" },
          ];
          const chosen = tipos[Math.floor(Math.random() * tipos.length)];
          s.obstacles.push({
            x: W + 10,
            y: s.groundY - chosen.h,
            width: chosen.w,
            height: chosen.h,
            tipo: chosen.tipo,
            name: chosen.name,
          });
          s.nextObstacleIn = Math.floor(Math.random() * 45 + 50);
        }

        // Movimiento de obstáculos y colisiones
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= s.speed;

          // Hitbox padding para jugabilidad justa
          const pad = 4;
          if (
            s.player.x + pad < obs.x + obs.width - pad &&
            s.player.x + s.player.width - pad > obs.x + pad &&
            s.player.y + pad < obs.y + obs.height &&
            s.player.y + s.player.height > obs.y + pad
          ) {
            // Colisión detectada
            setGameOver(true);
            playSound("gameover");

            // Partículas de explosión
            for (let k = 0; k < 18; k++) {
              s.particles.push({
                x: s.player.x + 14,
                y: s.player.y + 16,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7,
                size: Math.random() * 4 + 2,
                life: 25,
                color: ["#c6490f", "#ff7b00", "#ffd166"][k % 3],
              });
            }

            // Actualizar récord
            if (currentScore > highScore) {
              setHighScore(currentScore);
              try {
                localStorage.setItem("datahell_runner_best", currentScore.toString());
              } catch (e) {}
            }
          }

          if (obs.x + obs.width < -10) {
            s.obstacles.splice(i, 1);
          }
        }
      }

      // Renderizado del jugador (DataHell Dev / Flame Runner)
      const p = s.player;
      ctx.save();
      ctx.translate(p.x, p.y);

      // Cuerpo del dev / robot
      ctx.fillStyle = "#c6490f"; // Color corporativo DataHell
      ctx.fillRect(4, 10, 20, 18);

      // Cabeza
      ctx.fillStyle = isLight ? "#161415" : "#eaf0f0";
      ctx.fillRect(6, 2, 16, 10);

      // Visor / Ojos
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(14, 4, 6, 4);

      // Llama de DataHell sobre la cabeza
      ctx.fillStyle = "#ff7b00";
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.lineTo(14, -6 - (s.frameCount % 3));
      ctx.lineTo(18, 2);
      ctx.fill();

      // Piernas animadas
      ctx.fillStyle = isLight ? "#161415" : "#eaf0f0";
      if (p.isGrounded) {
        if (p.legFrame === 0) {
          ctx.fillRect(6, 28, 5, 10);
          ctx.fillRect(16, 28, 5, 7);
        } else {
          ctx.fillRect(6, 28, 5, 7);
          ctx.fillRect(16, 28, 5, 10);
        }
      } else {
        // En el aire: piernas flexionadas
        ctx.fillRect(6, 28, 6, 6);
        ctx.fillRect(15, 28, 6, 6);
      }

      ctx.restore();

      // Renderizado de obstáculos
      s.obstacles.forEach((obs) => {
        ctx.save();
        ctx.translate(obs.x, obs.y);

        if (obs.tipo === "bug") {
          // Obstáculo Bug
          ctx.fillStyle = "#e63946";
          ctx.beginPath();
          ctx.arc(obs.width / 2, obs.height / 2, 10, 0, Math.PI * 2);
          ctx.fill();
          // Patas
          ctx.strokeStyle = "#e63946";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 8); ctx.lineTo(obs.width, 8);
          ctx.moveTo(0, 18); ctx.lineTo(obs.width, 18);
          ctx.stroke();
        } else if (obs.tipo === "server") {
          // Obstáculo Servidor / Server Rack
          ctx.fillStyle = isLight ? "#2b2628" : "#221f21";
          ctx.fillRect(0, 0, obs.width, obs.height);
          ctx.strokeStyle = "var(--accent-orange)";
          ctx.strokeRect(0, 0, obs.width, obs.height);
          // Luces LED
          ctx.fillStyle = "#00ff88";
          ctx.fillRect(4, 6, 4, 3);
          ctx.fillStyle = "#ff4444";
          ctx.fillRect(4, 14, 4, 3);
          ctx.fillStyle = "#00f0ff";
          ctx.fillRect(4, 22, 4, 3);
        } else {
          // Obstáculo Llama / Glitch
          ctx.fillStyle = "#ff7b00";
          ctx.beginPath();
          ctx.moveTo(obs.width / 2, 0);
          ctx.lineTo(obs.width, obs.height);
          ctx.lineTo(0, obs.height);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      // Renderizado de partículas
      for (let j = s.particles.length - 1; j >= 0; j--) {
        const pt = s.particles[j];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;

        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);

        if (pt.life <= 0) {
          s.particles.splice(j, 1);
        }
      }

      // Mensaje de inicio si no ha arrancado
      if (!isPlaying && !gameOver) {
        ctx.fillStyle = isLight ? "#161415" : "#ffffff";
        ctx.font = "600 15px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PRESIONÁ ESPACIO O TOCÁ LA PANTALLA PARA EMPEZAR", W / 2, H / 2 - 10);
        ctx.fillStyle = "var(--accent-orange)";
        ctx.font = "13px Inter, sans-serif";
        ctx.fillText("Esquivá los bugs y servidores caídos de DataHell", W / 2, H / 2 + 15);
      }

      // Mensaje de Game Over
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#ff4444";
        ctx.font = "700 22px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("¡CRASH! STACK OVERFLOW", W / 2, H / 2 - 15);

        ctx.fillStyle = "#ffffff";
        ctx.font = "500 14px Inter, sans-serif";
        ctx.fillText("Presioná Espacio, Enter o Clic para reiniciar", W / 2, H / 2 + 15);
      }

      gameLoopRef.current = requestAnimationFrame(render);
    };

    gameLoopRef.current = requestAnimationFrame(render);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, soundEnabled, highScore]);

  return (
    <div className="runner-game-wrapper">
      {/* Marcador superior */}
      <div className="runner-scoreboard">
        <div className="runner-score-group">
          <span className="runner-score-label">Puntaje:</span>
          <strong className="runner-score-value">{score}m</strong>
        </div>

        <div className="runner-score-group">
          <span className="runner-score-label">Récord:</span>
          <strong className="runner-highscore-value">{highScore}m</strong>
        </div>

        <button
          type="button"
          className="runner-sound-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-label={soundEnabled ? "Silenciar audio" : "Activar sonido 8-bit"}
          title={soundEnabled ? "Silenciar sonido" : "Activar sonido 8-bit"}
        >
          {soundEnabled ? "🔊 Sonido ON" : "🔇 Silencio"}
        </button>
      </div>

      {/* Canvas interactivo */}
      <div className="runner-canvas-container" onClick={triggerJump}>
        <canvas
          ref={canvasRef}
          width={640}
          height={200}
          className="runner-canvas"
        />
      </div>

      {/* Instrucciones y controles táctiles para móviles */}
      <div className="runner-footer-hints">
        <span className="runner-hint">
          ⌨️ <strong>Espacio / Flecha Arriba:</strong> Saltar
        </span>
        <span className="runner-hint">
          📱 <strong>Pantalla Táctil:</strong> Tocar para saltar
        </span>
        {gameOver && (
          <button
            type="button"
            className="btn btn-primary btn-sm runner-restart-btn"
            onClick={restartGame}
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
