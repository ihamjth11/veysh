import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-purple-900/30 relative">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-purple-900/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold"
          >
            <span className="text-white">Vey</span>
            <span className="text-purple-500">sh</span>
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {["Effects", "How it Works", "GitHub"].map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ color: "#a855f7" }}
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com/ihamjth11"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              className="text-gray-500 hover:text-purple-400 border border-purple-900/50 rounded-full px-3 py-1 text-xs font-bold transition-colors duration-200"
            >
              GitHub
            </motion.a>
            <motion.a
              href="#"
              target="_blank"
              whileHover={{ scale: 1.1 }}
              className="text-gray-500 hover:text-purple-400 border border-purple-900/50 rounded-full px-3 py-1 text-xs font-bold transition-colors duration-200"
            >
              LinkedIn
            </motion.a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-8 border-t border-purple-900/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-xs">
            © 2026 Veysh. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">
            Built with 🖤 by{" "}
            <motion.a
              href="https://github.com/ihamjth11"
              target="_blank"
              whileHover={{ color: "#a855f7" }}
              className="text-purple-500 hover:text-purple-400 transition-colors duration-200"
            >
              Hamjath
            </motion.a>{" "}
            — Sri Lanka 🇱🇰
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;