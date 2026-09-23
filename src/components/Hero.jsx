import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const HERO_POWERS = [
  {
    hero: "Spider-Man", power: "Web Shooter", color: "#cc0000",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#8B0000"/><ellipse cx="9" cy="10" rx="2.5" ry="2" fill="white" transform="rotate(-15 9 10)"/><ellipse cx="15" cy="10" rx="2.5" ry="2" fill="white" transform="rotate(15 15 10)"/><path d="M7 12 Q12 11 17 12" stroke="white" strokeWidth="0.8" fill="none"/><path d="M12 4 L7 11 M12 4 L17 11" stroke="white" strokeWidth="0.5" opacity="0.5" fill="none"/></svg>
  },
  {
    hero: "Iron Man", power: "Repulsor Blast", color: "#FFD700",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#8B0000"/><path d="M7 6 L17 6 L19 11 L17 14 L12 15 L7 14 L5 11 Z" fill="#cc0000" stroke="#FFD700" strokeWidth="0.6"/><ellipse cx="9.5" cy="9.5" rx="2" ry="1.8" fill="#FFD700"/><ellipse cx="14.5" cy="9.5" rx="2" ry="1.8" fill="#FFD700"/><circle cx="12" cy="17" r="2" fill="#00aaff" opacity="0.9"/><circle cx="12" cy="17" r="1" fill="white"/></svg>
  },
  {
    hero: "Thor", power: "Lightning Strike", color: "#8888ff",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#1a1a4e"/><rect x="9" y="11" width="6" height="8" rx="1" fill="#888" stroke="#aaa" strokeWidth="0.5"/><rect x="6" y="12" width="12" height="3" rx="1" fill="#aaa" stroke="#ddd" strokeWidth="0.5"/><rect x="10.5" y="5" width="3" height="7" rx="0.8" fill="#888" stroke="#aaa" strokeWidth="0.4"/><path d="M4 7 L10 11" stroke="#aaaaff" strokeWidth="1.5"/><path d="M20 7 L14 11" stroke="#aaaaff" strokeWidth="1.5"/><circle cx="12" cy="3" r="1.5" fill="white"/></svg>
  },
  {
    hero: "Dr. Strange", power: "Mystic Arts", color: "#FF8C00",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#2d1a00"/><circle cx="12" cy="12" r="7" stroke="#FF8C00" strokeWidth="0.8" strokeDasharray="3 1.5"/><circle cx="12" cy="12" r="4" stroke="#FFD700" strokeWidth="0.6" strokeDasharray="2 1"/><line x1="12" y1="5" x2="12" y2="19" stroke="#FF8C00" strokeWidth="0.4" opacity="0.5"/><line x1="5" y1="12" x2="19" y2="12" stroke="#FF8C00" strokeWidth="0.4" opacity="0.5"/><circle cx="12" cy="12" r="2" fill="#FFD700"/><circle cx="12" cy="12" r="1" fill="#FF8C00"/></svg>
  },
  {
    hero: "Hulk", power: "Gamma Smash", color: "#00cc44",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#004400"/><ellipse cx="12" cy="11" rx="7" ry="6" fill="#00aa00"/><ellipse cx="9" cy="9" rx="2.2" ry="2.5" fill="#00cc00"/><ellipse cx="15" cy="9" rx="2.2" ry="2.5" fill="#00cc00"/><ellipse cx="9" cy="9" rx="1.1" ry="1.1" fill="#003300"/><ellipse cx="15" cy="9" rx="1.1" ry="1.1" fill="#003300"/><path d="M8.5 13 Q12 15.5 15.5 13" stroke="#003300" strokeWidth="1.2" fill="none"/></svg>
  },
  {
    hero: "Cap. America", power: "Shield Throw", color: "#4488ff",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#000033"/><circle cx="12" cy="12" r="8.5" fill="#cc0000"/><circle cx="12" cy="12" r="6.5" fill="white"/><circle cx="12" cy="12" r="4.5" fill="#0033cc"/><circle cx="12" cy="12" r="2" fill="#cc0000"/><polygon points="12,8.5 12.8,10.8 15.2,10.8 13.3,12.2 14,14.5 12,13 10,14.5 10.7,12.2 8.8,10.8 11.2,10.8" fill="white"/></svg>
  },
  {
    hero: "Doomsday", power: "Dark Energy", color: "#ff2200",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#1a0000"/><polygon points="12,3 13.5,9 20,9 14.5,13 16.5,19.5 12,15.5 7.5,19.5 9.5,13 4,9 10.5,9" fill="#ff2200" opacity="0.95"/><polygon points="12,5.5 13,9.5 17.5,9.5 14,12 15.2,16 12,13.5 8.8,16 10,12 6.5,9.5 11,9.5" fill="#660000"/><circle cx="12" cy="11" r="2.5" fill="#ff4400"/><circle cx="12" cy="11" r="1.2" fill="#ffaa00"/></svg>
  },
  {
    hero: "Ghost Mode", power: "Invisibility", color: "#aa44ff",
    svg: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><circle cx="12" cy="12" r="10" fill="#1a0033"/><path d="M6.5 17 L6.5 11 Q6.5 5 12 5 Q17.5 5 17.5 11 L17.5 17 L15 14.5 L13 17 L12 14.5 L11 17 L9 14.5 Z" fill="#aa44ff" opacity="0.9"/><ellipse cx="9.5" cy="10.5" rx="1.8" ry="2" fill="white"/><ellipse cx="14.5" cy="10.5" rx="1.8" ry="2" fill="white"/><ellipse cx="9.5" cy="11" rx="0.9" ry="1" fill="#1a0033"/><ellipse cx="14.5" cy="11" rx="0.9" ry="1" fill="#1a0033"/></svg>
  },
];

function Hero({ onTryNow }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.6 ? "#ff3300" : Math.random() > 0.5 ? "#ffaa00" : "#7c3aed",
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black z-1" />

      {/* Red energy center glow */}
      <div className="absolute w-[600px] h-[600px] bg-red-900/20 rounded-full blur-3xl z-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute w-[300px] h-[300px] bg-orange-900/20 rounded-full blur-2xl z-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Badge */}
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-full px-5 py-2 text-red-300 text-sm mb-8 tracking-widest mt-20"
>
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          AI POWERED AVENGERS AR EXPERIENCE
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-7xl md:text-9xl font-black mb-2 leading-none tracking-tight">
            <span className="cinematic-title">VEYSH</span>
          </h1>
          <div className="avengers-line w-full my-4" />
          <p className="text-2xl md:text-4xl font-light text-gray-300 tracking-widest">
            BECOME THE <span className="text-red-400 font-bold">HERO</span>
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
        >
          Real Avengers powers in your browser. No downloads. No apps.
          Just your hands and the camera — become a superhero in seconds.
        </motion.p>

        {/* Hero Power Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
         {HERO_POWERS.map((h, i) => (
  <motion.div
    key={h.hero}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.6 + i * 0.08 }}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
    style={{
      borderColor: h.color + "44",
      backgroundColor: h.color + "11",
      color: h.color,
    }}
  >
    {h.svg}
    <span>{h.hero}</span>
  </motion.div>
))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTryNow}
            className="bg-red-600 hover:bg-red-500 text-white px-12 py-4 rounded-full text-lg font-bold tracking-wider transition-all duration-200 glow-red"
          >
            ⚡ ASSEMBLE NOW
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-red-700/50 text-red-300 hover:border-red-500 px-12 py-4 rounded-full text-lg font-medium transition-all duration-200"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-12 mt-16"
        >
          {[
            { value: "8", label: "Hero Powers" },
            { value: "0", label: "Downloads Needed" },
            { value: "∞", label: "Fun Level" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-red-400">{stat.value}</div>
              <div className="text-xs text-gray-500 tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-red-700/50 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-3 bg-red-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;