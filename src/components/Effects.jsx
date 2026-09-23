import { motion } from "framer-motion";

const HEROES = [
  {
    id: "spiderman",
    name: "Spider-Man",
    power: "Web Shooter",
    gesture: "🤘 Rock Sign",
    description: "Shoot realistic webs from your wrist. Physics-based strands stick to walls and ceiling.",
    color: "#cc0000",
    bg: "from-red-950/60 to-red-900/20",
    border: "border-red-800/50",
    glow: "rgba(180, 0, 0, 0.4)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#8B0000" />
        <ellipse cx="24" cy="20" rx="12" ry="10" fill="#cc0000" />
        <ellipse cx="18" cy="18" rx="5" ry="4" fill="white" transform="rotate(-20 18 18)" />
        <ellipse cx="30" cy="18" rx="5" ry="4" fill="white" transform="rotate(20 30 18)" />
        <ellipse cx="18" cy="19" rx="2.5" ry="2" fill="#8B0000" transform="rotate(-20 18 19)" />
        <ellipse cx="30" cy="19" rx="2.5" ry="2" fill="#8B0000" transform="rotate(20 30 19)" />
        <path d="M14 24 Q24 22 34 24" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M15 27 Q24 25 33 27" stroke="white" strokeWidth="0.8" fill="none" />
        <path d="M24 10 L14 22 M24 10 L34 22 M24 10 L24 38 M12 24 L36 24" stroke="white" strokeWidth="0.6" fill="none" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "ironman",
    name: "Iron Man",
    power: "Repulsor Blast",
    gesture: "✋ Open Palm",
    description: "Fire Arc Reactor repulsor blasts from your palm. JARVIS targeting HUD included.",
    color: "#FFD700",
    bg: "from-yellow-950/60 to-red-900/20",
    border: "border-yellow-800/50",
    glow: "rgba(255, 180, 0, 0.4)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#8B0000" />
        <path d="M14 12 L34 12 L38 22 L34 28 L24 30 L14 28 L10 22 Z" fill="#cc0000" stroke="#FFD700" strokeWidth="1" />
        <ellipse cx="19" cy="19" rx="4" ry="3.5" fill="#FFD700" />
        <ellipse cx="29" cy="19" rx="4" ry="3.5" fill="#FFD700" />
        <rect x="18" y="23" width="12" height="2.5" rx="1.2" fill="#FFD700" opacity="0.8" />
        <path d="M14 28 L10 36 L18 32 Z" fill="#cc0000" stroke="#FFD700" strokeWidth="0.8" />
        <path d="M34 28 L38 36 L30 32 Z" fill="#cc0000" stroke="#FFD700" strokeWidth="0.8" />
        <circle cx="24" cy="34" r="4" fill="#00aaff" opacity="0.9" />
        <circle cx="24" cy="34" r="2" fill="white" />
        <circle cx="24" cy="34" r="0.8" fill="#00aaff" />
      </svg>
    ),
  },
  {
    id: "thor",
    name: "Thor",
    power: "Mjolnir Lightning",
    gesture: "✊ Tight Fist",
    description: "Call down massive lightning from the sky. Screen shakes, ground cracks on every strike.",
    color: "#8888ff",
    bg: "from-blue-950/60 to-indigo-900/20",
    border: "border-blue-800/50",
    glow: "rgba(100, 100, 255, 0.4)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#1a1a4e" />
        <rect x="18" y="22" width="12" height="16" rx="2" fill="#777" stroke="#aaa" strokeWidth="1" />
        <rect x="12" y="24" width="24" height="6" rx="2" fill="#aaa" stroke="#ddd" strokeWidth="1" />
        <rect x="21" y="10" width="6" height="14" rx="1.5" fill="#888" stroke="#aaa" strokeWidth="0.8" />
        <path d="M8 14 L20 22" stroke="#aaaaff" strokeWidth="2.5" opacity="0.9" />
        <path d="M40 14 L28 22" stroke="#aaaaff" strokeWidth="2.5" opacity="0.9" />
        <path d="M24 6 L24 12" stroke="white" strokeWidth="2.5" />
        <circle cx="24" cy="5" r="2.5" fill="white" />
        <path d="M16 8 L20 14 M32 8 L28 14" stroke="#aaaaff" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "strange",
    name: "Dr. Strange",
    power: "Mystic Arts",
    gesture: "🤌 OK Sign",
    description: "Create rotating Mandala magic circles. Two hands open a dimensional portal between them.",
    color: "#FF8C00",
    bg: "from-orange-950/60 to-yellow-900/20",
    border: "border-orange-800/50",
    glow: "rgba(255, 140, 0, 0.4)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#2d1a00" />
        <circle cx="24" cy="24" r="15" fill="none" stroke="#FF8C00" strokeWidth="1.5" strokeDasharray="5 2" />
        <circle cx="24" cy="24" r="10" fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="24" cy="24" r="5" fill="none" stroke="#FF8C00" strokeWidth="1.5" />
        <line x1="24" y1="9" x2="24" y2="39" stroke="#FF8C00" strokeWidth="0.6" opacity="0.5" />
        <line x1="9" y1="24" x2="39" y2="24" stroke="#FF8C00" strokeWidth="0.6" opacity="0.5" />
        <line x1="13" y1="13" x2="35" y2="35" stroke="#FF8C00" strokeWidth="0.6" opacity="0.5" />
        <line x1="35" y1="13" x2="13" y2="35" stroke="#FF8C00" strokeWidth="0.6" opacity="0.5" />
        <polygon points="24,16 25.5,21 30,21 26.5,24 28,29 24,26 20,29 21.5,24 18,21 22.5,21" fill="#FFD700" />
        <circle cx="24" cy="24" r="2.5" fill="#FF8C00" />
      </svg>
    ),
  },
  {
    id: "hulk",
    name: "Hulk",
    power: "Gamma Smash",
    gesture: "✊✊ Both Fists",
    description: "Unleash gamma radiation shockwaves. Ground cracks, debris flies, screen shake on every smash.",
    color: "#00cc44",
    bg: "from-green-950/60 to-green-900/20",
    border: "border-green-800/50",
    glow: "rgba(0, 180, 50, 0.4)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#004400" />
        <ellipse cx="24" cy="22" rx="13" ry="11" fill="#00aa00" />
        <ellipse cx="18" cy="18" rx="4" ry="4.5" fill="#00cc00" />
        <ellipse cx="30" cy="18" rx="4" ry="4.5" fill="#00cc00" />
        <ellipse cx="18" cy="18" rx="2" ry="2" fill="#003300" />
        <ellipse cx="30" cy="18" rx="2" ry="2" fill="#003300" />
        <circle cx="17" cy="17" r="0.8" fill="white" />
        <circle cx="29" cy="17" r="0.8" fill="white" />
        <path d="M17 25 Q24 29 31 25" stroke="#003300" strokeWidth="2" fill="none" />
        <path d="M10 21 Q7 17 10 13 L15 16" fill="#00aa00" />
        <path d="M38 21 Q41 17 38 13 L33 16" fill="#00aa00" />
        <path d="M15 33 L10 42 M33 33 L38 42" stroke="#00cc00" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "captain",
    name: "Cap. America",
    power: "Vibranium Shield",
    gesture: "✌️ Peace Sign",
    description: "Throw the Vibranium shield — it bounces off walls and returns. Star trail on every throw.",
    color: "#4488ff",
    bg: "from-blue-950/60 to-blue-900/20",
    border: "border-blue-700/50",
    glow: "rgba(50, 100, 255, 0.4)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#000033" />
        <circle cx="24" cy="24" r="17" fill="#cc0000" />
        <circle cx="24" cy="24" r="13" fill="white" />
        <circle cx="24" cy="24" r="9" fill="#0033cc" />
        <circle cx="24" cy="24" r="4" fill="#cc0000" />
        <polygon points="24,16 25.5,20.5 30,20.5 26.5,23 28,27.5 24,25 20,27.5 21.5,23 18,20.5 22.5,20.5" fill="white" />
        <circle cx="24" cy="24" r="17" fill="none" stroke="rgba(255,200,200,0.4)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "doomsday",
    name: "Doomsday",
    power: "Apocalypse Protocol",
    gesture: "🙌 Both Hands Spread",
    description: "Unleash dark energy destruction. Screen cracks, rune symbols appear, void particles consume reality.",
    color: "#ff2200",
    bg: "from-red-950/60 to-black/60",
    border: "border-red-900/50",
    glow: "rgba(255, 0, 0, 0.5)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#1a0000" />
        <polygon points="24,6 27,18 39,18 29,26 33,38 24,30 15,38 19,26 9,18 21,18" fill="#ff2200" opacity="0.95" />
        <polygon points="24,10 26.5,19 35,19 28,24 30.5,33 24,28 17.5,33 20,24 13,19 21.5,19" fill="#660000" />
        <circle cx="24" cy="22" r="5" fill="#ff4400" />
        <circle cx="24" cy="22" r="2.5" fill="#ff0000" />
        <circle cx="24" cy="22" r="1" fill="#ffaa00" />
        <line x1="24" y1="6" x2="14" y2="16" stroke="#ff2200" strokeWidth="1" opacity="0.5" />
        <line x1="24" y1="6" x2="34" y2="16" stroke="#ff2200" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "ghost",
    name: "Ghost Mode",
    power: "Invisibility",
    gesture: "🤚 Wave",
    description: "Calibrate your background and completely disappear. Real-time background subtraction AI.",
    color: "#aa44ff",
    bg: "from-purple-950/60 to-purple-900/20",
    border: "border-purple-800/50",
    glow: "rgba(150, 50, 255, 0.4)",
    svg: (
      <svg viewBox="0 0 48 48" className="w-12 h-12">
        <circle cx="24" cy="24" r="22" fill="#1a0033" />
        <path d="M13 34 L13 22 Q13 10 24 10 Q35 10 35 22 L35 34 L31 30 L27 34 L24 30 L21 34 L17 30 Z" fill="#aa44ff" opacity="0.9" />
        <ellipse cx="19" cy="21" rx="3.5" ry="4" fill="white" />
        <ellipse cx="29" cy="21" rx="3.5" ry="4" fill="white" />
        <ellipse cx="19" cy="22" rx="1.8" ry="2" fill="#1a0033" />
        <ellipse cx="29" cy="22" rx="1.8" ry="2" fill="#1a0033" />
        <circle cx="18.5" cy="21" r="0.7" fill="white" />
        <circle cx="28.5" cy="21" r="0.7" fill="white" />
        <circle cx="24" cy="24" r="22" fill="none" stroke="#aa44ff" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
];

function Effects() {
  return (
    <section id="heroes" className="py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/5 to-black" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-red-500 text-sm font-bold tracking-widest uppercase">
            ⚡ Avengers Assemble
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-4 mb-6">
            8 HERO <span className="cinematic-title">POWERS</span>
          </h2>
          <div className="avengers-line w-64 mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Each hero has a unique hand gesture. Show the sign — unleash the power.
            No buttons. No keyboard. Just your hands.
          </p>
        </motion.div>

        {/* Hero Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {HEROES.map((hero, index) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.04,
                y: -8,
                boxShadow: `0 20px 60px ${hero.glow}`,
              }}
              className={`hero-card bg-gradient-to-br ${hero.bg} border ${hero.border} rounded-2xl p-6 relative overflow-hidden`}
            >
              {/* Background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${hero.color}15, transparent 70%)`,
                }}
              />

              {/* Hero SVG Icon */}
              <div className="mb-4 relative z-10">{hero.svg}</div>

              {/* Hero name */}
              <h3 className="text-white text-xl font-black mb-1 relative z-10">
                {hero.name}
              </h3>

              {/* Power name */}
              <p
                className="text-sm font-bold mb-3 relative z-10 tracking-wider"
                style={{ color: hero.color }}
              >
                {hero.power}
              </p>

              {/* Description */}
              <p className="text-gray-400 text-xs leading-relaxed mb-4 relative z-10">
                {hero.description}
              </p>

              {/* Gesture badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold relative z-10"
                style={{
                  backgroundColor: hero.color + "15",
                  border: `1px solid ${hero.color}40`,
                  color: hero.color,
                }}
              >
                GESTURE: {hero.gesture}
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 100% 0%, ${hero.color}, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Effects;