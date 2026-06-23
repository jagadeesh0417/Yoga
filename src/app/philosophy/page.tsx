'use client';

import { motion } from 'framer-motion';
import { Quote, Eye, Target, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { siteConfig } from '@/lib/data';

const missionVision = [
  {
    icon: Target, title: 'Our Mission',
    text: 'To inspire and empower individuals globally to achieve complete physical, mental, emotional, and spiritual well-being through authentic yoga, mindfulness, and conscious living. We strive to create a healthier and happier world by making transformational wellness practices accessible to everyone.',
  },
  {
    icon: Eye, title: 'Our Vision',
    text: 'To become the world\'s most trusted holistic wellness platform, transforming millions of lives through yoga, meditation, education, and mindful living. Inspired by yoga\'s universal message of harmony, wellness, and human connection.',
  },
];

export default function PhilosophyPage() {
  return (
    <main>
      <section className="relative py-32 md:py-44 overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.03] animate-mandala" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-gold font-semibold text-sm tracking-[0.2em] uppercase"
          >
            Our Foundation
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mt-4 leading-tight"
          >
            Philosophy, Mission &amp; Vision
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-ivory/60 text-lg mt-4 max-w-2xl mx-auto"
          >
            Rooted in ancient wisdom, guided by modern purpose.
          </motion.p>
        </div>
      </section>

      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.04] animate-mandala" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-ivory/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-wine/20 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <Quote size={28} className="text-gold" />
            </div>
          </motion.div>
          <motion.blockquote initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-8 -left-4 text-6xl text-gold/20 font-serif leading-none select-none">&ldquo;</div>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-ivory leading-relaxed font-light italic">
              Yoga is not merely a workout; it is a way of life. When the body, mind, and soul align, extraordinary transformation becomes possible.
            </p>
            <div className="absolute -bottom-12 -right-4 text-6xl text-gold/20 font-serif leading-none select-none">&rdquo;</div>
          </motion.blockquote>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14"
          >
            <div className="w-12 h-px bg-gold/40 mx-auto mb-6" />
            <p className="font-serif text-xl text-gold font-medium">{siteConfig.founder}</p>
            <p className="text-ivory/40 text-sm mt-1 tracking-wide">Founder, {siteConfig.name}</p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wine/[0.02] rounded-full blur-2xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Our Purpose</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-wine mt-4 leading-tight">Driven by Purpose, Guided by Wisdom</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {missionVision.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="group relative rounded-2xl p-8 md:p-10 bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-xl hover:shadow-wine/5 transition-all duration-500"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wine/0 via-gold/0 to-wine/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center mb-6 group-hover:from-wine group-hover:to-gold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-wine/20">
                      <Icon size={28} className="text-wine group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-wine mb-4 group-hover:text-wine transition-colors duration-300">{item.title}</h3>
                    <p className="text-wine/70 leading-relaxed text-base md:text-lg">{item.text}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-wine via-gold to-wine opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100 origin-left" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-28 bg-ivory overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-wine"
          >
            Live Your Truth. Transform Your World.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-wine/60 mt-4 max-w-xl mx-auto"
          >
            Begin your journey towards holistic wellness and conscious living.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link href="/contact" className="px-8 py-4 rounded-full bg-gradient-to-r from-wine to-purple text-white font-semibold hover:bg-wine/90 transition-all duration-300 inline-flex items-center gap-2">
              Start Your Journey <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="px-8 py-4 rounded-full border border-wine/30 text-wine font-semibold hover:bg-wine/5 transition-all duration-300">
              Meet Sunita Singh
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
