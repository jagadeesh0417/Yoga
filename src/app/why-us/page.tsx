'use client';

import { motion } from 'framer-motion';
import {
  Award, Heart, Globe, Building2, Brain, Scale, Wind, Palmtree, User, Sparkles,
  CheckCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import { whyChooseUs } from '@/lib/data';

const iconMap: Record<number, React.ElementType> = {
  0: Award, 1: Heart, 2: Globe, 3: Building2, 4: Brain,
  5: Scale, 6: Wind, 7: Palmtree, 8: User, 9: Sparkles,
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function WhyUsPage() {
  return (
    <main>
      <section className="relative py-32 md:py-44 overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.03] animate-mandala" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-gold font-semibold text-sm tracking-[0.2em] uppercase"
          >
            What Sets Us Apart
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mt-4 leading-tight"
          >
            Why Choose <span className="text-gold">Mystic Yoga</span>?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-ivory/60 text-lg mt-4 max-w-2xl mx-auto"
          >
            Discover what makes our holistic wellness platform truly unique and transformative.
          </motion.p>
        </div>
      </section>

      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.02] animate-mandala" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {whyChooseUs.map((item, i) => {
              const Icon = iconMap[i] || Sparkles;
              return (
                <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group rounded-xl p-6 bg-white/60 backdrop-blur-md border border-white/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-wine/5 hover:bg-white/80 hover:border-gold/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-transparent to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-wine/5 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-wine group-hover:to-gold transition-all duration-300 group-hover:scale-110">
                      <Icon size={22} className="text-wine group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-wine mb-2 group-hover:text-wine transition-colors duration-300">{item.title}</h3>
                    <p className="text-sm text-wine/60 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-28 bg-ivory overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionTitle title="Ready to Begin Your Journey?" subtitle="Join thousands of students who have transformed their lives through Mystic Yoga." />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Link href="/contact" className="px-8 py-4 rounded-full bg-gradient-to-r from-wine to-purple text-white font-semibold hover:bg-wine/90 transition-all duration-300 inline-flex items-center gap-2">
              Book Free Consultation <ArrowRight size={18} />
            </Link>
            <Link href="/services" className="px-8 py-4 rounded-full border border-wine/30 text-wine font-semibold hover:bg-wine/5 transition-all duration-300">
              Explore Programs
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
