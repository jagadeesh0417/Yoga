'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Quote } from 'lucide-react';
import Link from 'next/link';
import { services, siteConfig } from '@/lib/data';
import { cn, bookConsultationLink, whatsappLink } from '@/lib/utils';
import SectionTitle from '@/components/SectionTitle';
import ResponsiveImage from '@/components/ResponsiveImage';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function ServiceSection({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center',
        isReversed && 'lg:direction-rtl'
      )}
    >
      <div className={cn(isReversed && 'lg:order-1')}>
        <div className="relative rounded-2xl overflow-hidden group">
          <ResponsiveImage
            src={service.image}
            alt={service.title}
            aspectRatio="aspect-[4/3]"
            containerClassName="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-ivory">
                {service.title}
              </h3>
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.04] animate-mandala z-10" />
        </div>
      </div>

      <div className={cn(isReversed && 'lg:order-0')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gradient-wine-purple mt-3 leading-tight">
            {service.title}
          </h2>
          <div className="w-12 h-0.5 bg-gold mt-5 mb-5" />
          <p className="text-wine/60 text-base md:text-lg leading-relaxed mb-6">
            {service.description}
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-wine/70"
            >
              <span className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-wine" />
              </span>
              <span className="text-base">{feature}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8"
        >
          <Link
            href={bookConsultationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm hover:bg-wine/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-wine/20"
          >
            Book This Service
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);

  return (
    <main>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] animate-mandala" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ivory/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-wine/60 via-transparent to-wine/30" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold text-sm tracking-widest uppercase mb-6">
              <Sparkles size={14} />
              What We Offer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-ivory leading-tight"
          >
            Our Premium{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold">
              Services
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 text-lg md:text-xl text-ivory/70 max-w-2xl mx-auto leading-relaxed"
          >
            Discover transformative wellness experiences tailored to your unique
            journey with {siteConfig.name}.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5 text-gold/60" />
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-28 md:space-y-36"
          >
            {services.map((service, index) => (
              <ServiceSection
                key={service.title}
                service={service}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="relative py-24 md:py-36 overflow-hidden gradient-primary"
      >
        <motion.div style={{ opacity }} className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-ivory/80 text-xs font-medium mb-8">
              <Sparkles size={14} className="text-gold" />
              Begin Your Journey
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-ivory leading-tight"
          >
            Ready to Start{' '}
            <br />
            <span className="text-gold">Your Journey?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-6 text-ivory/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Take the first step toward transformation. Book your session today
            and experience the {siteConfig.name} difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={bookConsultationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold hover:bg-gold/90 text-wine font-semibold text-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5"
            >
              Book Free Consultation
              <ArrowRight size={16} />
            </Link>
            <Link
              href={whatsappLink(
                'Hi! I would like to learn more about the premium services offered at MYSTIC YOGAâ„¢.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-ivory/30 hover:border-ivory/60 text-ivory font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 flex items-center justify-center gap-8 text-ivory/20"
          >
            <div className="w-12 h-px bg-gold/30" />
            <Quote size={18} className="text-gold/40" />
            <div className="w-12 h-px bg-gold/30" />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}

function ArrowDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}
