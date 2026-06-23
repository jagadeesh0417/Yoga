"use client";

import { motion } from "framer-motion";
import { Heart, Zap, Target, Moon, Shield, Sun } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { benefits } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  flexibility: Heart,
  stress: Zap,
  focus: Target,
  sleep: Moon,
  resilience: Shield,
  wellness: Sun,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function BenefitsSection() {
  return (
    <section className="relative py-24 md:py-32 bg-ivory overflow-hidden">
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-wine/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <SectionTitle
          title="Benefits That Transform Your Life"
          subtitle="Each practice is designed to bring measurable, lasting change to every dimension of your wellbeing."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon] || Heart;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group relative rounded-2xl p-8 bg-ivory border border-wine/5 shadow-wine transition-all duration-500 hover:shadow-2xl hover:shadow-wine/10"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wine/0 via-transparent to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    padding: "1px",
                    background:
                      "linear-gradient(135deg, #8B1E3F, #D4A373, #8B1E3F)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center mb-5 group-hover:from-wine group-hover:to-gold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-wine/20">
                    <Icon
                      size={26}
                      className="text-wine group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-wine mb-3 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-wine/60 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="absolute top-4 right-4 w-20 h-20 bg-gold/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
