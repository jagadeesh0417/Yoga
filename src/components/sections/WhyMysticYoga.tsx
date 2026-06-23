"use client";

import { motion } from "framer-motion";
import {
  Award,
  Heart,
  Globe,
  Building2,
  Brain,
  Scale,
  Wind,
  Palmtree,
  User,
  Sparkles,
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { whyChooseUs } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Heart,
  Globe,
  Building2,
  Brain,
  Scale,
  Wind,
  Palmtree,
  User,
  Sparkles,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function WhyMysticYoga() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-rose-light overflow-hidden">
      <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.02] animate-mandala" />

      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <SectionTitle
          title="Why Choose Mystic Yoga?"
          subtitle="Discover what makes our holistic wellness platform truly unique and transformative."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {whyChooseUs.map((item, i) => {
            const Icon = iconMap[i] || Sparkles;
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group rounded-xl p-6 bg-white/60 backdrop-blur-md border border-white/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-wine/5 hover:bg-white/80 hover:border-gold/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-transparent to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-wine/5 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-wine group-hover:to-gold transition-all duration-300 group-hover:scale-110">
                    <Icon
                      size={22}
                      className="text-wine group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-wine mb-2 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-wine/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
