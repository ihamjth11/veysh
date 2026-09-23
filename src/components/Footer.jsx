import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-red-900/20 relative">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-red-900/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="text-center md:text-left">
            <div className="text-3xl font-black">
              <span className="text-white">Vey</span>
              <span className="text-red-500">sh</span>
            </div>
            <p className="text-gray-600 text-xs tracking-widest mt-1">
              AVENGERS AR EXPERIENCE
            </p>
          </motion.div>

          {/* Hero powers list */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { icon: "🕷️", name: "Spider-Man", color: "#cc0000" },
              { icon: "🔴", name: "Iron Man", color: "#FFD700" },
              { icon: "⚡", name: "Thor", color: "#8888ff" },
              { icon: "🌀", name: "Dr. Strange", color: "#FF8C00" },
              { icon: "💚", name: "Hulk", color: "#00cc44" },
              { icon: "🛡️", name: "Cap. America", color: "#4488ff" },
              { icon: "☠️", name: "Doomsday", color: "#ff2200" },
              { icon: "👻", name: "Ghost", color: "#aa44ff" },
            ].map((h) => (
              <motion.div
                key={h.name}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center gap-1 px-2 py-1 rounded-full border text-xs"
                style={{
                  borderColor: h.color + "30",
                  backgroundColor: h.color + "08",
                  color: h.color,
                }}
              >
                <span>{h.icon}</span>
                <span>{h.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com/ihamjth11/veysh"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              className="text-gray-500 hover:text-red-400 border border-red-900/30 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider transition-colors duration-200"
            >
              GitHub
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/ihamjth11"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              className="text-gray-500 hover:text-red-400 border border-red-900/30 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider transition-colors duration-200"
            >
              LinkedIn
            </motion.a>
          </div>
        </div>

        {/* Divider */}
        <div className="avengers-line w-full mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-xs tracking-wider">
            © 2026 VEYSH. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-2 text-gray-700 text-xs">
            <span>BUILT WITH</span>
            <span className="text-red-500">♥</span>
            <span>BY</span>
            <motion.a
              href="https://github.com/ihamjth11"
              target="_blank"
              whileHover={{ color: "#ff4400" }}
              className="text-red-500 hover:text-red-400 font-bold transition-colors duration-200"
            >
              HAMJATH
            </motion.a>
            <span>— SRI LANKA 🇱🇰</span>
          </div>

          <p className="text-gray-700 text-xs tracking-wider">
            POWERED BY MEDIAPIPE + REACT
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;