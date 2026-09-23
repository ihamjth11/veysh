import { motion } from "framer-motion";
import { Globe, Camera, Sparkles, Hand } from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Open Browser",
    description: "No downloads. No app store. Just open veysh.vercel.app in any modern browser — Chrome works best.",
    icon: Globe,
    color: "#ff4400",
  },
  {
    id: "02",
    title: "Allow Camera",
    description: "Grant camera access. Veysh uses your camera to track your hands in real-time using AI.",
    icon: Camera,
    color: "#FFD700",
  },
  {
    id: "03",
    title: "Pick Your Hero",
    description: "Choose from 8 Avengers powers — Spider-Man, Iron Man, Thor, Dr. Strange, Hulk and more.",
    icon: Sparkles,
    color: "#8888ff",
  },
  {
    id: "04",
    title: "Show the Sign",
    description: "Each hero has a unique hand gesture. Show the sign and watch your power come to life instantly.",
    icon: Hand,
    color: "#00cc44",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/8 to-black" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-red-500 text-sm font-bold tracking-widest uppercase">
            Simple Process
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-white mt-4 mb-4">
            HOW IT <span className="cinematic-title">WORKS</span>
          </h2>
          <div className="avengers-line w-48 mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            4 steps. 30 seconds. You become an Avenger.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative text-center group"
            >
              {/* Connector */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px z-0"
                  style={{
                    background: `linear-gradient(90deg, ${step.color}80, transparent)`,
                  }}
                />
              )}

              {/* Icon circle */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 transition-all duration-300"
                style={{
                  backgroundColor: step.color + "15",
                  borderColor: step.color + "60",
                  boxShadow: `0 0 20px ${step.color}20`,
                }}
              >
                <step.icon
                  className="w-8 h-8"
                  style={{ color: step.color }}
                />
              </motion.div>

              {/* Step number */}
              <span
                className="text-xs font-black tracking-widest"
                style={{ color: step.color }}
              >
                STEP {step.id}
              </span>

              {/* Title */}
              <h3 className="text-white text-xl font-black mt-2 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Gesture Guide */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-2xl border border-red-900/30 bg-red-950/10"
        >
          <h3 className="text-center text-white font-black text-2xl mb-8">
            ⚡ GESTURE GUIDE
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { gesture: "🤘 Rock Sign", hero: "Spider-Man", color: "#cc0000" },
              { gesture: "✋ Open Palm", hero: "Iron Man", color: "#FFD700" },
              { gesture: "✊ Tight Fist", hero: "Thor", color: "#8888ff" },
              { gesture: "🤌 OK Sign", hero: "Dr. Strange", color: "#FF8C00" },
              { gesture: "✊✊ Both Fists", hero: "Hulk", color: "#00cc44" },
              { gesture: "✌️ Peace Sign", hero: "Cap. America", color: "#4488ff" },
              { gesture: "🙌 Both Spread", hero: "Doomsday", color: "#ff2200" },
              { gesture: "🤚 Wave", hero: "Ghost Mode", color: "#aa44ff" },
            ].map((g) => (
              <div
                key={g.hero}
                className="text-center p-3 rounded-xl border"
                style={{
                  borderColor: g.color + "30",
                  backgroundColor: g.color + "08",
                }}
              >
                <div className="text-2xl mb-1">{g.gesture.split(" ")[0]}</div>
                <div className="text-xs text-gray-400">{g.gesture.split(" ").slice(1).join(" ")}</div>
                <div
                  className="text-xs font-bold mt-1"
                  style={{ color: g.color }}
                >
                  {g.hero}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-500 text-white px-14 py-4 rounded-full text-lg font-black tracking-wider transition-all duration-200 glow-red"
          >
            ⚡ BECOME AN AVENGER
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;