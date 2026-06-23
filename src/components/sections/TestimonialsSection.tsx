"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { testimonials } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="testimonials" className="gradient-primary py-20 md:py-28 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Success Stories"
          subtitle="Hear from our global community of transformed lives"
          light
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden md:flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none"
          ref={scrollRef}
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              variants={cardVariants}
              className="flex-shrink-0 w-[380px] snap-start"
            >
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-lg h-full">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gold text-gold"
                    />
                  ))}
                </div>

                <div className="relative mb-5">
                  <Quote className="w-8 h-8 text-gold/20 absolute -top-1 -left-1" />
                  <p className="text-ivory/80 text-sm md:text-base leading-relaxed italic relative z-10 pl-4">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-ivory/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine/20 to-gold/20 flex items-center justify-center text-gold font-semibold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gold font-semibold text-sm">
                      {item.name}
                    </p>
                    <p className="text-ivory/50 text-xs">{item.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:hidden gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                <div className="relative mb-5">
                  <Quote className="w-8 h-8 text-gold/20 absolute -top-1 -left-1" />
                  <p className="text-ivory/80 text-sm leading-relaxed italic relative z-10 pl-4">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-ivory/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine/20 to-gold/20 flex items-center justify-center text-gold font-semibold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gold font-semibold text-sm">{item.name}</p>
                    <p className="text-ivory/50 text-xs">{item.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
