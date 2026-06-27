"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Sparkles, Heart, Shield, Droplets, ChevronRight, Gem, Leaf, Wind } from "lucide-react";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F8E7A1";
const GOLD_RICH = "#B8860B";
const BG = "#0A0A0A";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-3xl md:text-5xl text-center mb-4" style={{ color: GOLD }}>{children}</h2>;
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-base md:text-lg max-w-2xl mx-auto mb-12" style={{ color: "rgba(255,255,255,0.6)" }}>{children}</p>;
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`backdrop-blur-xl rounded-2xl p-6 border ${className}`} style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(212,175,55,0.15)" }}>
      {children}
    </div>
  );
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-15" style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/5 w-72 h-72 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${GOLD_LIGHT} 0%, transparent 70%)` }} />
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: GOLD, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 6 }}
        />
      ))}
    </div>
  );
}

const benefits = [
  "Premium Quality Formula", "Supports Healthy Lifestyle Goals",
  "Natural Ingredient Inspired", "Beauty & Wellness Focused",
  "Elegant Luxury Packaging", "Daily Wellness Support",
  "Designed for Modern Living", "Advanced Wellness Experience",
];

const features = [
  { icon: Wind, title: "Purify", desc: "Promotes a cleaner, more balanced lifestyle through mindful wellness support." },
  { icon: Gem, title: "Sculpt", desc: "Complements an active lifestyle and wellness journey." },
  { icon: Sparkles, title: "Glow", desc: "Encourages a radiant and confident approach to self-care." },
  { icon: Shield, title: "Premium Quality", desc: "Produced with attention to quality, presentation, and excellence." },
];

const specs = [
  { label: "Product Name", value: "Quantum Health™" },
  { label: "Tagline", value: "Purify • Sculpt • Glow" },
  { label: "Category", value: "Premium Wellness" },
  { label: "Packaging", value: "Luxury Matte Black Jar" },
  { label: "Formula", value: "Advanced Wellness Blend" },
  { label: "Quality", value: "Premium Grade" },
  { label: "Price", value: "HKD 599" },
];

const testimonials = [
  { text: "Beautiful packaging with a truly premium feel.", author: "Verified Buyer", rating: 5 },
  { text: "Luxury wellness at its finest.", author: "Wellness Enthusiast", rating: 5 },
  { text: "An elegant addition to my daily self-care routine.", author: "Regular Customer", rating: 5 },
];

const faqs = [
  { q: "What is Quantum Health™?", a: "Quantum Health™ is a premium wellness product designed for individuals pursuing a healthier, more balanced lifestyle." },
  { q: "What is the price?", a: "Quantum Health™ is available for HKD 599." },
  { q: "Is it suitable for everyday use?", a: "Use according to the recommended serving guidelines and consult a healthcare professional if required." },
];

const WA_URL = "https://wa.me/919164081909?text=I%27m%20interested%20in%20Quantum%20Health%E2%84%A2%20-%20HKD%20599";

export default function QuantumHealthPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => { document.title = "Quantum Health™ — Purify • Sculpt • Glow"; }, []);

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: BG, color: "#fff" }}>
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        <Particles />
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block text-xs uppercase tracking-[0.3em] mb-4 px-4 py-1.5 rounded-full border"
              style={{ borderColor: GOLD, color: GOLD }}
              initial={{ opacity: 0, y: 10 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Purify &bull; Sculpt &bull; Glow
            </motion.span>
            <p className="text-sm uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
              Premium Wellness Formula
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-4" style={{ color: GOLD }}>
              Quantum<br />Health&trade;
            </h1>
            <p className="text-base md:text-lg mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              Discover Your Best Self
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
              A premium wellness experience crafted for those who aspire to look, feel, and live better.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: BG }}
              >
                Shop Now — HKD 599 <ChevronRight size={18} />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105 border"
                style={{ borderColor: "rgba(212,175,55,0.4)", color: GOLD }}
              >
                Experience Quantum Health
              </a>
            </div>
          </motion.div>
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${GOLD}22 0%, transparent 70%)` }} />
              <Image
                src="/images/product2.png"
                alt="Quantum Health™"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="relative px-4 py-24">
        <Particles />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeUp>
            <SectionTitle>Wellness Reimagined</SectionTitle>
          </FadeUp>
          <FadeUp delay={0.15}>
            <GlassCard className="max-w-3xl mx-auto text-center p-8 md:p-12">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Quantum Health&trade; is a premium wellness formula developed for individuals seeking balance, confidence, and radiant living.
              </p>
              <p className="text-base md:text-lg leading-relaxed mt-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                Presented in an elegant matte-black jar accented with luxurious gold detailing, Quantum Health&trade; reflects sophistication, innovation, and modern self-care.
              </p>
              <p className="text-base md:text-lg leading-relaxed mt-6" style={{ color: GOLD_LIGHT }}>
                Designed to become an essential part of your daily wellness ritual.
              </p>
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="relative px-4 py-24" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <SectionTitle>Why Quantum Health&trade;</SectionTitle>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {benefits.map((b, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <GlassCard className="flex items-center gap-3 p-4 h-full">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l2.5 2.5L12 5" stroke={BG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{b}</span>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative px-4 py-24">
        <Particles />
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeUp>
            <SectionTitle>Product Features</SectionTitle>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {features.map((f, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <GlassCard className="text-center p-8 h-full flex flex-col items-center">
                  <div className="p-3 rounded-full mb-5" style={{ background: `${GOLD}15` }}>
                    <f.icon size={28} style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-serif text-xl mb-3" style={{ color: GOLD }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{f.desc}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPECIFICATIONS ===== */}
      <section className="relative px-4 py-24" style={{ background: "linear-gradient(180deg, #111111 0%, #0a0a0a 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <SectionTitle>Product Specifications</SectionTitle>
          </FadeUp>
          <FadeUp delay={0.15}>
            <GlassCard className="overflow-hidden p-0 mt-12">
              <table className="w-full">
                <tbody>
                  {specs.map((s, i) => (
                    <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                      <td className="py-4 px-6 font-medium text-sm" style={{ color: GOLD, width: "40%" }}>{s.label}</td>
                      <td className="py-4 px-6 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* ===== LUXURY STATEMENT ===== */}
      <section className="relative px-4 py-24">
        <Particles />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp>
            <p className="font-serif text-2xl md:text-4xl italic leading-relaxed" style={{ color: GOLD }}>
              &ldquo;The Science of Wellness. The Art of Luxury.&rdquo;
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-8 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
              At Quantum Health&trade;, wellness is more than a routine — it&rsquo;s a lifestyle. Every detail, from formulation to packaging, is designed to deliver an elevated experience inspired by elegance, confidence, and modern innovation.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative px-4 py-24" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)" }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeUp>
            <SectionTitle>What Our Customers Say</SectionTitle>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <GlassCard className="text-center p-6 h-full flex flex-col items-center justify-between">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, ri) => (
                      <Star key={ri} size={16} fill={GOLD} style={{ color: GOLD }} />
                    ))}
                  </div>
                  <p className="text-sm italic mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>&ldquo;{t.text}&rdquo;</p>
                  <p className="text-xs uppercase tracking-wider" style={{ color: GOLD }}>{t.author}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING / CTA ===== */}
      <section className="relative px-4 py-24">
        <Particles />
        <div className="max-w-md mx-auto text-center relative z-10">
          <FadeUp>
            <GlassCard className="p-8 md:p-12">
              <h3 className="font-serif text-2xl mb-1" style={{ color: GOLD }}>QUANTUM HEALTH&trade;</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Purify &bull; Sculpt &bull; Glow</p>
              <div className="text-5xl font-serif mb-6" style={{ color: GOLD }}>HKD 599</div>
              <ul className="space-y-3 mb-8 text-left">
                {["Premium Wellness Collection", "Secure Checkout", "Premium Packaging", "Fast Worldwide Shipping"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill={GOLD} opacity="0.2"/><path d="M5 8l2 2 4-4" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-medium text-lg transition-all hover:scale-105 w-full justify-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: BG }}
              >
                Order Now <ChevronRight size={18} />
              </Link>
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative px-4 py-24" style={{ background: "#111111" }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <SectionTitle>Frequently Asked Questions</SectionTitle>
          </FadeUp>
          <div className="space-y-4 mt-12">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <GlassCard>
                  <h4 className="font-medium mb-2" style={{ color: GOLD }}>{faq.q}</h4>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{faq.a}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="text-center px-4 py-12 border-t" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
        <p className="font-serif text-lg" style={{ color: GOLD }}>Quantum Health&trade;</p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>Purify &bull; Sculpt &bull; Glow</p>
        <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>&copy; {new Date().getFullYear()} MYSTIC YOGA&trade;. All rights reserved.</p>
      </footer>
    </main>
  );
}
