import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Navbar({ onTryNow }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-purple-900/30"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-bold"
      >
        <span className="text-white">Vey</span>
        <span className="text-purple-500">sh</span>
      </motion.div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {["Effects", "How it Works", "GitHub"].map((item) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            whileHover={{ color: "#a855f7" }}
            className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
          >
            {item}
          </motion.a>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onTryNow}
        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 glow-purple"
      >
        Try Now
      </motion.button>
    </motion.nav>
  );
}

export default Navbar;