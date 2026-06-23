"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";

const missionData = {
  icon: Target,
  title: "Our Mission",
  description:
    "To inspire and empower individuals globally to achieve complete physical, mental, emotional, and spiritual well-being through authentic yoga, mindfulness, and conscious living.",
};

const visionData = {
  icon: Eye,
  title: "Our Vision",
  description:
    "To become the world's most trusted holistic wellness platform, transforming millions of lives through yoga, meditation, education, and mindful living.",
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function MissionVision() {
  return (
    <section className="relative py-24 md:py-32 bg-ivory overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wine/[0.02] rounded-full blur-2xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gradient-wine-purple font-semibold text-sm tracking-[0.2em] uppercase">
            Our Purpose
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-4 leading-tight">
            Driven by Purpose, Guided by Wisdom
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {[missionData, visionData].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group relative rounded-2xl p-8 md:p-10 bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-xl hover:shadow-wine/5 transition-all duration-500"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wine/0 via-gold/0 to-wine/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center mb-6 group-hover:from-wine group-hover:to-gold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-wine/20">
                    <Icon
                      size={28}
                      className="text-wine group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-wine mb-4 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-wine/70 leading-relaxed text-base md:text-lg">
                    {item.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-wine via-gold to-wine opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100 origin-left" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
