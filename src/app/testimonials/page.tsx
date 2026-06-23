'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import { testimonials } from '@/lib/data';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function TestimonialsPage() {
  return (
    <main>
      <section className="relative py-32 md:py-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wine via-purple to-wine" />
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.03] animate-mandala" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-gold font-semibold text-sm tracking-[0.2em] uppercase"
          >
            Testimonials
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mt-4 leading-tight"
          >
            <span className="text-gold">Success</span> Stories
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-ivory/60 text-lg mt-4 max-w-2xl mx-auto"
          >
            Hear from our global community of transformed lives.
          </motion.p>
        </div>
      </section>

      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.02] animate-mandala" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((item, i) => (
              <motion.div key={i} custom={i} variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-lg h-full"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <div className="relative mb-5">
                  <Quote className="w-8 h-8 text-wine/10 absolute -top-1 -left-1" />
                  <p className="text-wine/75 text-sm md:text-base leading-relaxed italic relative z-10 pl-4">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-wine/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine/20 to-gold/20 flex items-center justify-center text-wine font-semibold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-wine font-semibold text-sm">{item.name}</p>
                    <p className="text-wine/50 text-xs">{item.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-28 gradient-primary overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="w-16 h-16 mx-auto rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-8"
          >
            <Quote size={28} className="text-gold" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl font-bold text-ivory"
          >
            Ready to Write Your Own Success Story?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="text-ivory/60 mt-4 max-w-xl mx-auto"
          >
            Join the Mystic Yoga community and begin your transformational journey today.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link href="/pricing" className="px-8 py-4 rounded-full bg-gold text-wine font-semibold hover:bg-gold/90 transition-all duration-300 inline-flex items-center gap-2">
              Join a Class <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-full border border-ivory/30 text-ivory font-semibold hover:bg-white/5 transition-all duration-300">
              Share Your Story
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
