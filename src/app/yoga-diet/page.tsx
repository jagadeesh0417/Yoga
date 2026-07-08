'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowRight, Sparkles, ChevronDown,
  Heart, Target, Moon, Sun, Zap, Brain, Apple,
  Droplet, Star, Quote, X, ZoomIn, ZoomOut
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, bookConsultationLink, whatsappLink } from '@/lib/utils';
import dynamic from 'next/dynamic';

const FloatingParticles = dynamic(
  () => import('@/components/animations/FloatingParticles'),
  { ssr: false }
);

interface Orb {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateOrbs(count: number, offset = 0): Orb[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: seededRandom(i + 1 + offset) * 200 + 100,
    x: seededRandom(i + 100 + offset) * 100,
    y: seededRandom(i + 200 + offset) * 100,
    duration: seededRandom(i + 300 + offset) * 8 + 12,
    delay: seededRandom(i + 400 + offset) * 5,
  }));
}

const lotusPetals = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i * 45) * (Math.PI / 180),
  delay: i * 0.2,
}));

const posters = [
  { src: '/images/yoga-diet-about.png', alt: 'Yoga + Diet Introduction' },
  { src: '/images/yoga-diet-hero-2.png', alt: 'Personalized Coaching' },
  { src: '/images/yoga-diet-about-2.png', alt: 'Complete Wellness' },
  { src: '/images/yoga-diet-hero.png', alt: 'Combo Program' },
];

const wellnessFeatures = [
  'Weight Management', 'Digestion', 'Flexibility',
  'Mental Focus', 'Energy', 'Better Sleep',
  'Healthy Skin', 'Sustainable Lifestyle',
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const sectionTitle = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function PosterCard({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  return (
    <motion.div
      variants={staggerItem}
      onClick={onClick}
      className="group relative rounded-[20px] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 bg-white/5"
      style={{ willChange: 'transform' }}
    >
      <div className="relative rounded-[20px] overflow-hidden">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto object-contain block"
        />
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/50 rounded-[20px] transition-all duration-300 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-wine/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ivory w-5 h-5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-ivory text-sm font-medium text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          {alt}
        </div>
      </div>
    </motion.div>
  );
}

function PosterSection({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative rounded-[20px] shadow-xl bg-white/5", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto object-contain block rounded-[20px]"
      />
    </div>
  );
}

export default function YogaDietPage() {
  const [floatingOrbs] = useState<Orb[]>(() => generateOrbs(6));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      setZoomLevel(1);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    const idx = lightboxIndex;
    if (e.key === 'Escape') { setLightboxIndex(null); return; }
    if (e.key === 'ArrowLeft') {
      setLightboxIndex(idx === 0 ? posters.length - 1 : idx - 1);
      setZoomLevel(1);
    }
    if (e.key === 'ArrowRight') {
      setLightboxIndex(idx === posters.length - 1 ? 0 : idx + 1);
      setZoomLevel(1);
    }
  }, [lightboxIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || lightboxIndex === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setLightboxIndex(lightboxIndex === 0 ? posters.length - 1 : lightboxIndex - 1);
      } else {
        setLightboxIndex(lightboxIndex === posters.length - 1 ? 0 : lightboxIndex + 1);
      }
      setZoomLevel(1);
    }
    setTouchStart(null);
  };

  return (
    <main>
      {/* ===== HERO ===== */}
      <section
        id="yoga-diet-hero"
        suppressHydrationWarning
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <FloatingParticles count={15} />

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 gradient-primary" />
          <Image
            src="/images/homepage.png"
            alt="MYSTIC YOGA"
            fill
            priority
            className="object-contain opacity-40"
          />
        </div>

        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] z-0 animate-mandala" />
        <div className="absolute inset-0 bg-gradient-to-t from-wine/80 via-transparent to-purple/30 z-0" />

        {floatingOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            suppressHydrationWarning
            className="absolute rounded-full pointer-events-none z-0"
            style={{
              width: orb.size, height: orb.size, left: `${orb.x}%`, top: `${orb.y}%`,
              backgroundImage: 'radial-gradient(circle, rgba(212,163,115,0.08) 0%, transparent 70%)',
            }}
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          />
        ))}

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-wine/20 blur-3xl" />
        </div>

        {lotusPetals.map((petal) => (
          <motion.div
            key={petal.id} suppressHydrationWarning
            className="absolute w-3 h-3 rounded-full z-0"
            style={{
              left: '50%', top: '50%',
              backgroundImage: 'radial-gradient(circle, rgba(212,163,115,0.15) 0%, transparent 70%)',
              boxShadow: '0 0 20px rgba(212,163,115,0.1)',
            }}
            animate={{
              x: [0, Math.cos(petal.angle) * 180, Math.cos(petal.angle + 0.5) * 120, 0],
              y: [0, Math.sin(petal.angle) * 180, Math.sin(petal.angle + 0.5) * 120, 0],
              scale: [0, 1.5, 1, 0], opacity: [0, 0.6, 0.4, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: petal.delay }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold text-sm tracking-widest uppercase">
              <Quote size={14} />
              Yoga + Diet Program
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-ivory leading-tight tracking-tight"
          >
            Transform Your
            <br />
            <span className="text-gradient-gold">Body</span>
            <br />
            Balance Your Life.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 text-lg md:text-xl lg:text-2xl text-ivory/70 max-w-2xl leading-relaxed font-light"
          >
            Experience the perfect combination of mindful yoga and personalized
            nutrition designed to improve your physical health, mental clarity,
            and overall well-being.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href={bookConsultationLink}
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-gold text-wine font-semibold text-base tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-gold/30 hover:brightness-110 inline-block"
            >
              Book Free Consultation
            </Link>
            <Link
              href={whatsappLink('Hi! I am interested in joining the Yoga + Diet Program at MYSTIC YOGA™.')}
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-gold/40 text-gold font-semibold text-base tracking-wide transition-all duration-300 hover:bg-gold/20 hover:border-gold/60 inline-block"
            >
              Join Program
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-ivory/40 text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={20} className="text-gold/60" />
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent z-10" />
      </section>

      {/* ===== Section 1 — Yoga + Diet Introduction ===== */}
      <section className="relative py-24 md:py-32 gradient-lavender overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <PosterSection src="/images/yoga-diet-about.png" alt="Yoga + Diet Introduction" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <motion.span {...sectionTitle} className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">
                Introduction
              </motion.span>
              <motion.h2 {...sectionTitle} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-3 leading-tight">
                Yoga <span className="text-gold">+</span> Diet
              </motion.h2>
              <motion.p {...sectionTitle} transition={{ ...sectionTitle.transition, delay: 0.1 }}
                className="text-wine/40 text-lg md:text-xl font-semibold tracking-wide uppercase mt-2"
              >
                The Ultimate Biohack
              </motion.p>
              <motion.div {...sectionTitle} transition={{ ...sectionTitle.transition, delay: 0.15 }}
                className="w-12 h-0.5 bg-gold mt-5 mb-6"
              />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              >
                {[
                  { icon: Activity, label: 'Mindful Movement' },
                  { icon: Apple, label: 'Intelligent Nutrition' },
                  { icon: Heart, label: 'Balance Your Body' },
                  { icon: Sun, label: 'Nourish Your Life' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      variants={staggerItem}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-wine/5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-wine" />
                      </div>
                      <span className="font-medium text-wine text-sm">{item.label}</span>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href={bookConsultationLink}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm hover:bg-wine/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-wine/20"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Section 2 — Personalized Coaching ===== */}
      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <motion.span {...sectionTitle} className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">
                Personalized Coaching
              </motion.span>
              <motion.h2 {...sectionTitle} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-3 leading-tight">
                Personalized Yoga{' '}
                <span className="text-gold">&</span> Nutrition
              </motion.h2>
              <motion.div {...sectionTitle} transition={{ ...sectionTitle.transition, delay: 0.15 }}
                className="w-12 h-0.5 bg-gold mt-5 mb-5"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-wine/60 text-base md:text-lg leading-relaxed mb-4 italic"
              >
                Everyone is different.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-wine/60 text-base md:text-lg leading-relaxed mb-6"
              >
                Receive a customized yoga practice and nutrition plan based on
                your body, goals, and lifestyle.
              </motion.p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {[
                  'One-on-One Coaching', 'Personalized Diet Plan',
                  'Breathwork', 'Meditation', 'Weekly Support',
                ].map((feature) => (
                  <motion.div
                    key={feature}
                    variants={staggerItem}
                    className="flex items-start gap-3 text-wine/70"
                  >
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-wine" />
                    </span>
                    <span className="text-base">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <PosterSection src="/images/yoga-diet-hero-2.png" alt="Personalized Coaching" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Section 3 — Complete Wellness ===== */}
      <section className="relative py-24 md:py-32 gradient-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] z-0 animate-mandala" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-ivory/5 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <PosterSection src="/images/yoga-diet-about-2.png" alt="Complete Wellness" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <motion.span {...sectionTitle} className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">
                Complete Wellness
              </motion.span>
              <motion.h2 {...sectionTitle} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mt-3 leading-tight">
                Wellness Beyond{' '}
                <span className="text-gold">Fitness</span>
              </motion.h2>
              <motion.div {...sectionTitle} transition={{ ...sectionTitle.transition, delay: 0.15 }}
                className="w-12 h-0.5 bg-gold mt-5 mb-6"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-ivory/70 text-base md:text-lg leading-relaxed mb-6"
              >
                The Yoga + Diet Program helps improve:
              </motion.p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-3"
              >
                {wellnessFeatures.map((feature) => (
                  <motion.div
                    key={feature}
                    variants={staggerItem}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <Check className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-ivory/80 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Section 4 — Combo Program ===== */}
      <section className="relative py-24 md:py-32 gradient-lavender overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="lg:order-2"
            >
              <motion.span {...sectionTitle} className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">
                Combo Program
              </motion.span>
              <motion.h2 {...sectionTitle} className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-3 leading-tight">
                Yoga <span className="text-gold">+</span> Diet{' '}
                <span className="text-gold">Combo</span>
              </motion.h2>
              <motion.div {...sectionTitle} transition={{ ...sectionTitle.transition, delay: 0.15 }}
                className="w-12 h-0.5 bg-gold mt-5 mb-6"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-wine/60 text-base md:text-lg leading-relaxed mb-6"
              >
                Experience our complete wellness package that combines yoga
                sessions with personalized nutrition guidance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={bookConsultationLink}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold hover:bg-gold/90 text-wine font-semibold text-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5"
                >
                  Book Your Consultation
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="relative lg:order-1"
            >
              <PosterSection src="/images/yoga-diet-hero.png" alt="Yoga + Diet Combo" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Image Gallery ===== */}
      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Gallery</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-3 leading-tight">
              Program Preview
            </h2>
            <div className="w-12 h-0.5 bg-gold mt-5 mx-auto" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {posters.map((poster, i) => (
              <PosterCard
                key={i}
                src={poster.src}
                alt={poster.alt}
                onClick={() => { setLightboxIndex(i); setZoomLevel(1); }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 md:p-8"
            onClick={() => setLightboxIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/60 to-transparent">
              <span className="text-ivory/60 text-sm">
                {lightboxIndex + 1} / {posters.length}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setZoomLevel(Math.min(3, zoomLevel + 0.5)); }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setZoomLevel(Math.max(0.5, zoomLevel - 0.5)); }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  aria-label="Close lightbox"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Previous */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex === 0 ? posters.length - 1 : lightboxIndex - 1); setZoomLevel(1); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
              aria-label="Previous image"
            >
              <ChevronDown className="w-6 h-6 rotate-90" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex === posters.length - 1 ? 0 : lightboxIndex + 1); setZoomLevel(1); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
              aria-label="Next image"
            >
              <ChevronDown className="w-6 h-6 -rotate-90" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center w-full h-full"
              onClick={(e) => e.stopPropagation()}
              style={{ overflow: 'auto' }}
            >
              <img
                src={posters[lightboxIndex].src}
                alt={posters[lightboxIndex].alt}
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
