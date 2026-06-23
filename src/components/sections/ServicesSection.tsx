"use client";

import { motion } from "framer-motion";
import { User, Brain, Building2, Heart, Globe, Palmtree, Check, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import ResponsiveImage from "@/components/ResponsiveImage";
import { services } from "@/lib/data";

const iconMap = [User, Brain, Building2, Heart, Globe, Palmtree];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="bg-lavender-light py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Our Premium Services" subtitle="Discover transformative wellness experiences tailored to your journey" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => {
            const Icon = iconMap[index];
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                className="group relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-wine/10 transition-shadow duration-500"
              >
                <div className="relative overflow-hidden">
                  <ResponsiveImage
                    src={service.image}
                    alt={service.title}
                    containerClassName="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent" />
                  <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-400">
                    <Icon className="w-7 h-7 text-wine" />
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-wine mb-3">
                    {service.title}
                  </h3>

                  <p className="text-wine/60 text-sm md:text-base leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-wine/70">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-wine" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="inline-flex items-center gap-2 text-wine font-medium text-sm group/btn hover:text-gold transition-colors duration-300">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
