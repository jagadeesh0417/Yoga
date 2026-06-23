'use client';

import { motion } from 'framer-motion';
import { Heart, Zap, Target, Moon, Shield, Sun, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import { benefits } from '@/lib/data';

const iconMap: Record<string, React.ElementType> = {
  flexibility: Heart, stress: Zap, focus: Target, sleep: Moon, resilience: Shield, wellness: Sun,
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function BenefitsPage() {
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
            Transform Your Life
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mt-4 leading-tight"
          >
            Benefits That <span className="text-gold">Transform</span> Your Life
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-ivory/60 text-lg mt-4 max-w-2xl mx-auto"
          >
            Each practice is designed to bring measurable, lasting change to every dimension of your wellbeing.
          </motion.p>
        </div>
      </section>

      <section className="relative py-24 md:py-32 bg-ivory overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-wine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, i) => {
              const Icon = iconMap[benefit.icon] || Heart;
              return (
                <motion.div key={i} variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                  className="group relative rounded-2xl p-8 bg-white border border-wine/5 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-wine/10"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wine/0 via-transparent to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ padding: '1px', background: 'linear-gradient(135deg, #7A3045, #D4A373, #7A3045)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
                  />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center mb-5 group-hover:from-wine group-hover:to-gold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-wine/20">
                      <Icon size={26} className="text-wine group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-wine mb-3 group-hover:text-wine transition-colors duration-300">{benefit.title}</h3>
                    <p className="text-wine/60 leading-relaxed">{benefit.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gold/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-28 gradient-primary overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-bold text-ivory"
          >
            Start Your Transformation Today
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-ivory/60 mt-4 max-w-xl mx-auto"
          >
            Experience the profound benefits of regular yoga and mindfulness practice.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link href="/pricing" className="px-8 py-4 rounded-full bg-gold text-wine font-semibold hover:bg-gold/90 transition-all duration-300 inline-flex items-center gap-2">
              Choose Your Plan <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-full border border-ivory/30 text-ivory font-semibold hover:bg-white/5 transition-all duration-300">
              Schedule a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
