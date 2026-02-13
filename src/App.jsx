import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  :root {
    --crimson: #8B0000;
    --rose: #C0392B;
    --blush: #E8747C;
    --gold: #D4AF37;
    --cream: #FFF5E4;
    --deep: #0d0000;
    --wine: #4A0000;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .vday-root {
    min-height: 100vh;
    width: 100%;
    
    background: var(--deep);
    font-family: 'Cormorant Garamond', serif;
    overflow-x: hidden;
    cursor: none;
    position: relative;
  }

  .vday-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    font-size: 20px;
    transition: left 0.05s, top 0.05s;
  }

  .vday-bg {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, #3d0000 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, #5a0010 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, #2a0000 0%, transparent 60%),
      #0d0000;
    animation: bgShift 8s ease-in-out infinite alternate;
    z-index: 0;
  }

  @keyframes bgShift {
    0%   { filter: hue-rotate(0deg) brightness(1); }
    100% { filter: hue-rotate(15deg) brightness(1.08); }
  }

  .vday-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2;
  }

  .vday-wrapper {
    position: relative;
    z-index: 10;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 60px 20px 80px;
  }

  .vday-deco-line {
    width: 2px;
    height: 80px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    margin-bottom: 30px;
    animation: fadeIn 1s ease forwards 0.3s;
    opacity: 0;
  }

  .vday-label {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.85rem;
    letter-spacing: 0.4em;
    color: var(--gold);
    text-transform: uppercase;
    opacity: 0;
    animation: fadeUp 1s ease forwards 0.8s;
    margin-bottom: 20px;
  }

  .vday-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(4rem, 14vw, 9rem);
    font-weight: 700;
    font-style: italic;
    line-height: 0.9;
    text-align: center;
    color: transparent;
    background: linear-gradient(135deg, var(--gold) 0%, var(--cream) 40%, var(--blush) 70%, var(--gold) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 200% 200%;
    animation: shimmer 4s ease infinite, fadeUp 1.2s ease forwards 1.1s;
    opacity: 0;
    margin-bottom: 10px;
    filter: drop-shadow(0 0 30px rgba(212,175,55,0.3));
  }

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  .vday-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 3vw, 1.4rem);
    letter-spacing: 0.2em;
    color: var(--blush);
    opacity: 0;
    animation: fadeUp 1s ease forwards 1.6s;
    margin-bottom: 50px;
    text-align: center;
  }

  .vday-ornament {
    font-size: 2rem;
    opacity: 0;
    animation: fadeUp 1s ease forwards 1.8s, pulse 2s ease-in-out infinite 2.8s;
    margin-bottom: 50px;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.2); }
  }

  .vday-card {
    position: relative;
    max-width: 680px;
    width: 100%;
    background: linear-gradient(145deg, rgba(80,0,0,0.55), rgba(30,0,0,0.8));
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 2px;
    padding: 55px 50px;
    backdrop-filter: blur(12px);
    box-shadow:
      0 0 60px rgba(139,0,0,0.3),
      0 0 120px rgba(139,0,0,0.1),
      inset 0 0 40px rgba(0,0,0,0.3);
    opacity: 0;
    animation: fadeUp 1.2s ease forwards 2.1s;
  }

  .vday-card-bar-top {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 60%; height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
  }

  .vday-card-bar-bottom {
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 60%; height: 1px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
  }

  .vday-card-corner {
    position: absolute;
    font-size: 1rem;
    color: var(--gold);
    opacity: 0.6;
  }

  .vday-card-corner.tl { top: 14px; left: 18px; }
  .vday-card-corner.tr { top: 14px; right: 18px; }
  .vday-card-corner.bl { bottom: 14px; left: 18px; }
  .vday-card-corner.br { bottom: 14px; right: 18px; }

  .vday-date {
    font-style: italic;
    font-size: 0.8rem;
    letter-spacing: 0.25em;
    color: rgba(212,175,55,0.6);
    margin-bottom: 30px;
    text-align: right;
  }

  .vday-salutation {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-style: italic;
    color: var(--blush);
    margin-bottom: 24px;
  }

  .vday-body {
    font-size: 1.15rem;
    font-weight: 300;
    line-height: 1.9;
    color: rgba(255, 235, 215, 0.88);
  }

  .vday-body p { margin-bottom: 18px; }

  .vday-highlight {
    color: var(--blush);
    font-style: italic;
    font-weight: 400;
  }

  .vday-whisper {
    color: var(--gold);
    font-style: italic;
  }

  .vday-sign {
    margin-top: 36px;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: rgba(212,175,55,0.8);
    text-align: right;
    line-height: 1.8;
  }

  .vday-btn {
    margin-top: 50px;
    position: relative;
    display: inline-block;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.05rem;
    letter-spacing: 0.2em;
    color: var(--gold);
    border: 1px solid rgba(212,175,55,0.4);
    padding: 14px 40px;
    background: transparent;
    cursor: none;
    overflow: hidden;
    transition: color 0.4s, border-color 0.4s;
    opacity: 0;
    animation: fadeUp 1s ease forwards 3s;
  }

  .vday-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(139,0,0,0.6), rgba(192,57,43,0.4));
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  .vday-btn:hover::before { transform: translateX(0); }
  .vday-btn:hover { color: var(--cream); border-color: var(--blush); }

  .vday-btn-inner {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  /* Secret overlay */
  .vday-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(10,0,0,0.96);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 40px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.6s ease;
  }

  .vday-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .vday-overlay-close {
    position: absolute;
    top: 24px; right: 30px;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1rem;
    letter-spacing: 0.2em;
    color: rgba(212,175,55,0.5);
    cursor: none;
    background: none;
    border: none;
    transition: color 0.3s;
  }

  .vday-overlay-close:hover { color: var(--gold); }

  .vday-overlay-emoji {
    font-size: 3.5rem;
    margin-bottom: 30px;
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.6s ease 0.2s;
  }

  .vday-overlay.open .vday-overlay-emoji {
    opacity: 1;
    transform: scale(1);
  }

  .vday-overlay-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(1.3rem, 4vw, 2rem);
    color: var(--cream);
    text-align: center;
    max-width: 600px;
    line-height: 1.8;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease 0.4s;
  }

  .vday-overlay.open .vday-overlay-text {
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @media (max-width: 600px) {
    .vday-card { padding: 40px 24px; }
    .vday-body { font-size: 1rem; }
  }
`;

function PetalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#8B0000","#C0392B","#E8747C","#A00020","#D44060"];

    function mkPetal(scattered = false) {
      return {
        x:        Math.random() * window.innerWidth,
        y:        scattered ? Math.random() * window.innerHeight : Math.random() * -window.innerHeight,
        size:     8 + Math.random() * 14,
        speedY:   0.5 + Math.random() * 1.1,
        speedX:  -0.4 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: -0.02 + Math.random() * 0.04,
        alpha:    0.3 + Math.random() * 0.5,
        sway:     Math.random() * Math.PI * 2,
        swaySpeed:0.01 + Math.random() * 0.02,
        color:    COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    }

    const petals = Array.from({ length: 45 }, (_, i) => mkPetal(i < 30));

    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.6);
      ctx.bezierCurveTo( p.size * 0.4, -p.size * 0.4,  p.size * 0.3, p.size * 0.5, 0, p.size * 0.6);
      ctx.bezierCurveTo(-p.size * 0.3,  p.size * 0.5, -p.size * 0.4, -p.size * 0.4, 0, -p.size * 0.6);
      ctx.fill();
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.sway     += p.swaySpeed;
        p.x        += p.speedX + Math.sin(p.sway) * 0.5;
        p.y        += p.speedY;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height + 30) Object.assign(p, mkPetal(false));
        draw(p);
      });
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="vday-canvas" />;
}

export default function Valentine() {
  const [secretOpen, setSecretOpen] = useState(false);
  const [cursor, setCursor]         = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <style>{css}</style>

      <div className="vday-root">
        {/* Cursor */}
        <div
          className="vday-cursor"
          style={{ left: cursor.x, top: cursor.y }}
        >💋</div>

        {/* Background */}
        <div className="vday-bg" />

        {/* Petals */}
        <PetalCanvas />

        {/* Main content */}
        <div className="vday-wrapper">
          <div className="vday-deco-line" />
          <p className="vday-label">XIV · February · 2025</p>

          <h1 className="vday-title">Ebun</h1>
          <p className="vday-subtitle">my favourite sin</p>
          <div className="vday-ornament">🌹</div>

          {/* Letter card */}
          <div className="vday-card">
            <div className="vday-card-bar-top" />
            <div className="vday-card-bar-bottom" />
            <span className="vday-card-corner tl">✦</span>
            <span className="vday-card-corner tr">✦</span>
            <span className="vday-card-corner bl">✦</span>
            <span className="vday-card-corner br">✦</span>

            <p className="vday-date">Valentine's Day, 2025</p>
            <p className="vday-salutation">My darling Ebun,</p>

            <div className="vday-body">
              <p>
                There are things I think about when the room goes quiet{" "}
                <span className="vday-highlight">the way you laugh</span> a little too loud,
                the way your presence fills a space before you've even said a word.
                You are, without question, the most intoxicating person I've ever known.
              </p>
              <p>
                I love you in the obvious ways but also in the{" "}
                <span className="vday-whisper">quietly dangerous ones.</span>{" "}
                In the way I can't stop thinking about you.
                In the way you make ordinary Tuesday evenings feel like something worth remembering.
              </p>
              <p>
                You are warmth, mischief, beauty, and chaos all wrapped in one.
                And I'd choose all of it, every single time, over a boring kind of love.
              </p>
              <p>
                So here's to us, to laughter that goes too late into the night,
                to stolen glances,{" "}
                <span className="vday-highlight">to everything unspoken</span>{" "}
                that somehow says everything.
              </p>
            </div>

            <p className="vday-sign">
              Yours, completely <br />
              <em>and dangerously</em> 🌹
            </p>
          </div>

          <button
            className="vday-btn"
            onClick={() => setSecretOpen(true)}
          >
            <span className="vday-btn-inner">✦ press for something just for you ✦</span>
          </button>
        </div>

        {/* Secret overlay */}
        <div className={`vday-overlay${secretOpen ? " open" : ""}`}>
          <button
            className="vday-overlay-close"
            onClick={() => setSecretOpen(false)}
          >
            ✕ close
          </button>
          <div className="vday-overlay-emoji">🔥</div>
          <p className="vday-overlay-text">
            "Tonight, I don't want to share you with the world.<br /><br />
            Just you, me, and all the ways I plan to make you forget what day it is."
          </p>
        </div>
      </div>
    </>
  );
}