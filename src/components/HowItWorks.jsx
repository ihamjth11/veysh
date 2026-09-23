import { motion } from "framer-motion";
import { Globe, Camera, Sparkles, Hand } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Open Browser",
    description: "No downloads. No installation. Just open Veysh in any modern browser.",
    icon: Globe,
  },
  {
    id: "02",
    title: "Allow Camera",
    description: "Grant camera access. Veysh captures your background for the illusion.",
    icon: Camera,
  },
  {
    id: "03",
    title: "Pick an Effect",
    description: "Choose from 6 powerful effects — Ghost, Fire, Glitch, Matrix and more.",
    icon: Sparkles,
  },
  {
    id: "04",
    title: "Use Your Hands",
    description: "Control everything with hand gestures. Wave, pinch, or peace sign to switch effects.",
    icon: Hand,
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            How Veysh Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            4 simple steps. No technical knowledge needed.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-purple-700/50 to-transparent z-0" />
              )}

              {/* Icon circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative z-10 w-20 h-20 bg-purple-900/30 border border-purple-700/50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <step.icon className="w-8 h-8 text-purple-400" />
              </motion.div>

              {/* Step number */}
              <span className="text-purple-600 text-sm font-bold tracking-widest">
                STEP {step.id}
              </span>

              {/* Title */}
              <h3 className="text-white text-xl font-bold mt-2 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-4 rounded-full text-lg font-medium transition-all duration-200 glow-purple"
          >
            Start Vanishing →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;