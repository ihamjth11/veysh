import { motion } from "framer-motion";
import { Ghost, Flame, Zap, Code2, Crosshair, Sparkles } from "lucide-react";

const effects = [
  {
    id: 1,
    name: "Ghost Mode",
    description: "Become completely invisible — blend into your background like a ghost.",
    icon: Ghost,
    color: "from-purple-900/50 to-purple-600/20",
    border: "border-purple-700/50",
    glow: "rgba(124, 58, 237, 0.3)",
    iconColor: "text-purple-400",
    gesture: "Wave both hands",
  },
  {
    id: 2,
    name: "Fire Effect",
    description: "Surround yourself with real-time fire — pure cinematic power.",
    icon: Flame,
    color: "from-orange-900/50 to-red-600/20",
    border: "border-orange-700/50",
    glow: "rgba(234, 88, 12, 0.3)",
    iconColor: "text-orange-400",
    gesture: "Raise one fist",
  },
  {
    id: 3,
    name: "Glitch Mode",
    description: "Corrupt reality — digital glitch effect that breaks the screen.",
    icon: Zap,
    color: "from-cyan-900/50 to-cyan-600/20",
    border: "border-cyan-700/50",
    glow: "rgba(6, 182, 212, 0.3)",
    iconColor: "text-cyan-400",
    gesture: "Peace sign ✌️",
  },
  {
    id: 4,
    name: "Matrix Mode",
    description: "Enter the matrix — green code rains around your silhouette.",
    icon: Code2,
    color: "from-green-900/50 to-green-600/20",
    border: "border-green-700/50",
    glow: "rgba(34, 197, 94, 0.3)",
    iconColor: "text-green-400",
    gesture: "Thumbs up",
  },
  {
    id: 5,
    name: "Predator Mode",
    description: "Active camouflage — see through yourself like the Predator.",
    icon: Crosshair,
    color: "from-blue-900/50 to-blue-600/20",
    border: "border-blue-700/50",
    glow: "rgba(59, 130, 246, 0.3)",
    iconColor: "text-blue-400",
    gesture: "Pinch fingers",
  },
  {
    id: 6,
    name: "Aura Mode",
    description: "Glow with energy — colorful aura surrounds your entire body.",
    icon: Sparkles,
    color: "from-pink-900/50 to-pink-600/20",
    border: "border-pink-700/50",
    glow: "rgba(236, 72, 153, 0.3)",
    iconColor: "text-pink-400",
    gesture: "Open palms",
  },
];

function Effects() {
  return (
    <section id="effects" className="py-32 px-4 relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">
            Visual Effects
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            6 Powerful Effects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Control every effect with just a hand gesture.
            No keyboard. No mouse. Just your hands.
          </p>
        </motion.div>

        {/* Effects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {effects.map((effect, index) => (
            <motion.div
              key={effect.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 30px ${effect.glow}`,
              }}
              className={`bg-gradient-to-br ${effect.color} border ${effect.border} rounded-2xl p-6 cursor-pointer transition-all duration-300`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center mb-4`}>
                <effect.icon className={`w-6 h-6 ${effect.iconColor}`} />
              </div>

              {/* Name */}
              <h3 className="text-white text-xl font-bold mb-2">
                {effect.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">
                {effect.description}
              </p>

              {/* Gesture */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Gesture:</span>
                <span className={`text-xs font-medium ${effect.iconColor}`}>
                  {effect.gesture}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Effects;