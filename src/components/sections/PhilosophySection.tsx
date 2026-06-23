"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { siteConfig } from "@/lib/data";

export default function PhilosophySection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 gradient-primary" />

      <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.04] animate-mandala" />

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-ivory/5 blur-3xl" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-wine/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <Quote size={28} className="text-gold" />
          </div>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -top-8 -left-4 text-6xl text-gold/20 font-serif leading-none select-none">
            &ldquo;
          </div>
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-ivory leading-relaxed font-light italic">
            Yoga is not merely a workout; it is a way of life. When the body,
            mind, and soul align, extraordinary transformation becomes possible.
          </p>
          <div className="absolute -bottom-12 -right-4 text-6xl text-gold/20 font-serif leading-none select-none">
            &rdquo;
          </div>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-14"
        >
          <div className="w-12 h-px bg-gold/40 mx-auto mb-6" />
          <p className="font-serif text-xl text-gold font-medium">
            {siteConfig.founder}
          </p>
          <p className="text-ivory/40 text-sm mt-1 tracking-wide">
            Founder, {siteConfig.name}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
