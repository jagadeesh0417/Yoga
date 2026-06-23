"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/animations/MagneticButton";

const FloatingParticles = dynamic(
  () => import("@/components/animations/FloatingParticles"),
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

export default function HeroSection() {
  const [floatingOrbs, setFloatingOrbs] = useState<Orb[]>(() => generateOrbs(6));

  useEffect(() => {
    setFloatingOrbs(generateOrbs(6, 9999));
  }, []);

  return (
    <section
      id="home"
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
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            backgroundImage:
              "radial-gradient(circle, rgba(212,163,115,0.08) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-wine/20 blur-3xl" />
      </div>

      {lotusPetals.map((petal) => (
        <motion.div
          key={petal.id}
          suppressHydrationWarning
          className="absolute w-3 h-3 rounded-full z-0"
          style={{
            left: "50%",
            top: "50%",
            backgroundImage:
              "radial-gradient(circle, rgba(212,163,115,0.15) 0%, transparent 70%)",
            boxShadow: "0 0 20px rgba(212,163,115,0.1)",
          }}
          animate={{
            x: [
              0,
              Math.cos(petal.angle) * 180,
              Math.cos(petal.angle + 0.5) * 120,
              0,
            ],
            y: [
              0,
              Math.sin(petal.angle) * 180,
              Math.sin(petal.angle + 0.5) * 120,
              0,
            ],
            scale: [0, 1.5, 1, 0],
            opacity: [0, 0.6, 0.4, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: petal.delay,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold text-sm tracking-widest uppercase">
            <Quote size={14} />
            International Wellness Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-ivory leading-tight tracking-tight"
        >
          Awaken Your
          <br />
          <span className="text-gradient-gold">
            Inner Power
          </span>
          <br />
          Transform Your Life.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl lg:text-2xl text-ivory/70 max-w-2xl leading-relaxed font-light"
        >
          Embark on a transformational journey with{" "}
          <span className="text-gold font-medium">MYSTIC YOGA™</span> —
          where ancient wisdom meets modern wellness.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <MagneticButton>
            <button className="px-8 py-4 rounded-full bg-gold text-wine font-semibold text-base tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-gold/30 hover:brightness-110">
              Book Free Consultation
            </button>
          </MagneticButton>
          <MagneticButton>
            <button className="px-8 py-4 rounded-full bg-transparent border border-ivory/30 text-ivory font-medium text-base tracking-wide transition-all duration-300 hover:bg-white/5 hover:border-ivory/50">
              Explore Programs
            </button>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-ivory/40 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-gold/60" />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent z-10" />
    </section>
  );
}
