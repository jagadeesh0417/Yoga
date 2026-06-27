"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Droplets, Shield, Sparkles, ChevronRight, Award, FlaskConical, PackageOpen } from "lucide-react";

const QC_GOLD = "#D4AF37";
const QC_GOLD_LIGHT = "#F5E7B2";
const QC_BLACK = "#000000";
const QC_BG = "#0a0a0a";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-3xl md:text-5xl text-center mb-4" style={{ color: QC_GOLD }}>{children}</h2>;
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

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${QC_GOLD} 0%, transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${QC_GOLD} 0%, transparent 70%)` }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${QC_GOLD_LIGHT} 0%, transparent 70%)` }} />
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ background: QC_GOLD, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}
    </div>
  );
}

const highlights = [
  { icon: FlaskConical, text: "Premium Concentrated Formula" },
  { icon: PackageOpen, text: "Elegant Matte Black Packaging" },
  { icon: Droplets, text: "Convenient Dropper Application" },
  { icon: Award, text: "Luxury Wellness Experience" },
  { icon: Sparkles, text: "Scientifically Inspired Design" },
  { icon: Shield, text: "Compact 50ml Premium Bottle" },
];

const benefits = [
  "Supports everyday wellness routines",
  "Premium concentrated formulation",
  "Easy-to-use dropper system",
  "Sophisticated presentation",
  "Perfect for wellness enthusiasts",
  "Luxury gift-worthy packaging",
];

const specs = [
  { label: "Product Name", value: "Quantum Cure™" },
  { label: "Category", value: "Premium Wellness" },
  { label: "Volume", value: "50ml" },
  { label: "Type", value: "Concentrated Black Water" },
  { label: "Packaging", value: "Frosted Black Glass Bottle" },
  { label: "Cap", value: "Gold Premium Dropper" },
  { label: "Price", value: "HKD 399" },
  { label: "Shelf Life", value: "24 Months" },
];

const testimonials = [
  { text: "Exceptional presentation and premium quality.", author: "Verified Buyer", rating: 5 },
  { text: "A sophisticated wellness product unlike anything else.", author: "Wellness Enthusiast", rating: 5 },
  { text: "Luxury in every drop.", author: "Premium Customer", rating: 5 },
];

const faqs = [
  { q: "What is Quantum Cure™?", a: "Quantum Cure™ is a premium concentrated black water wellness product presented in an elegant luxury bottle." },
  { q: "How much does it cost?", a: "Quantum Cure™ is priced at HKD 399." },
  { q: "What is the bottle size?", a: "Each bottle contains 50ml (1.7 fl oz)." },
  { q: "How should it be stored?", a: "Store in a cool, dry place away from direct sunlight." },
];

const WA_URL = "https://wa.me/919164081909?text=I%27m%20interested%20in%20Quantum%20Cure%E2%84%A2%20-%20HKD%20399";

export default function QuantumCurePage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => { document.title = "Quantum Cure™ — Premium Concentrated Black Water"; }, []);

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: QC_BG, color: "#fff" }}>
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block text-xs uppercase tracking-[0.3em] mb-4 px-4 py-1.5 rounded-full border"
              style={{ borderColor: QC_GOLD, color: QC_GOLD }}
              initial={{ opacity: 0, y: 10 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              The Future of Premium Wellness
            </motion.span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-6" style={{ color: QC_GOLD }}>
              Quantum<br />Cure&trade;
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
              Experience the power of concentrated black water crafted for individuals who seek elevated living, vitality, and sophistication.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${QC_GOLD}, ${QC_GOLD_LIGHT})`, color: QC_BLACK }}
              >
                Shop Now — HKD 399 <ChevronRight size={18} />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all hover:scale-105 border"
                style={{ borderColor: "rgba(212,175,55,0.4)", color: QC_GOLD }}
              >
                Discover More
              </a>
            </div>
            <p className="mt-8 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              50ml Premium Bottle &bull; Concentrated Formula &bull; Luxury Wellness Collection
            </p>
          </motion.div>
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${QC_GOLD}22 0%, transparent 70%)` }} />
              <Image
                src="/images/product1.png"
                alt="Quantum Cure™"
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
        <ParticleBackground />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeUp>
            <SectionTitle>Elevate Your Daily Ritual</SectionTitle>
          </FadeUp>
          <FadeUp delay={0.15}>
            <GlassCard className="max-w-3xl mx-auto text-center p-8 md:p-12">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Quantum Cure&trade; Concentrated Black Water represents a new generation of premium wellness products. Designed with precision, elegance, and innovation, it delivers a sophisticated experience for modern lifestyles.
              </p>
              <p className="text-base md:text-lg leading-relaxed mt-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                Encased in a luxurious matte black bottle with refined gold accents, Quantum Cure&trade; embodies excellence, purity, and contemporary wellness.
              </p>
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* ===== HIGHLIGHTS ===== */}
      <section className="relative px-4 py-24" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <SectionTitle>Why Choose Quantum Cure&trade;</SectionTitle>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {highlights.map((item, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <GlassCard className="flex items-start gap-4 p-6 h-full">
                  <div className="p-2.5 rounded-xl shrink-0" style={{ background: `${QC_GOLD}15` }}>
                    <item.icon size={22} style={{ color: QC_GOLD }} />
                  </div>
                  <p className="font-medium text-sm md:text-base" style={{ color: "rgba(255,255,255,0.85)" }}>{item.text}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="relative px-4 py-24">
        <ParticleBackground />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeUp>
            <SectionTitle>Designed for Modern Living</SectionTitle>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {benefits.map((b, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${QC_GOLD}, ${QC_GOLD_LIGHT})` }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke={QC_BLACK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{b}</span>
                </div>
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
                      <td className="py-4 px-6 font-medium text-sm" style={{ color: QC_GOLD, width: "40%" }}>{s.label}</td>
                      <td className="py-4 px-6 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* ===== USAGE ===== */}
      <section className="relative px-4 py-24">
        <ParticleBackground />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeUp>
            <SectionTitle>How To Use</SectionTitle>
          </FadeUp>
          <FadeUp delay={0.15}>
            <GlassCard className="text-left space-y-6 p-8 md:p-12">
              {["Shake gently before use.", "Apply the recommended number of drops according to usage guidelines or wellness recommendations.", "Store in a cool and dry environment."].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold" style={{ background: `linear-gradient(135deg, ${QC_GOLD}, ${QC_GOLD_LIGHT})`, color: QC_BLACK }}>
                    {i + 1}
                  </div>
                  <p className="pt-1" style={{ color: "rgba(255,255,255,0.75)" }}>{step}</p>
                </div>
              ))}
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="relative px-4 py-24" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)" }}>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeUp>
            <SectionTitle>Science Meets Luxury</SectionTitle>
            <p className="font-serif text-lg md:text-xl italic max-w-2xl mx-auto mt-4" style={{ color: QC_GOLD_LIGHT }}>
              &ldquo;At Quantum Cure&trade;, we believe wellness should be intelligent, refined, and inspiring.&rdquo;
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
              Every detail — from formulation to packaging — has been designed to create a premium experience that complements a modern lifestyle.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative px-4 py-24">
        <ParticleBackground />
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
                      <Star key={ri} size={16} fill={QC_GOLD} style={{ color: QC_GOLD }} />
                    ))}
                  </div>
                  <p className="text-sm italic mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>&ldquo;{t.text}&rdquo;</p>
                  <p className="text-xs uppercase tracking-wider" style={{ color: QC_GOLD }}>{t.author}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING / CTA ===== */}
      <section className="relative px-4 py-24" style={{ background: "linear-gradient(180deg, #111111 0%, #0a0a0a 100%)" }}>
        <div className="max-w-md mx-auto text-center relative z-10">
          <FadeUp>
            <GlassCard className="p-8 md:p-12">
              <h3 className="font-serif text-2xl mb-1" style={{ color: QC_GOLD }}>Quantum Cure&trade;</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Concentrated Black Water</p>
              <div className="text-5xl font-serif mb-6" style={{ color: QC_GOLD }}>HKD 399</div>
              <ul className="space-y-3 mb-8 text-left">
                {["Premium 50ml Bottle", "Secure Checkout", "Fast Delivery", "Premium Packaging"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill={QC_GOLD} opacity="0.2"/><path d="M5 8l2 2 4-4" stroke={QC_GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-medium text-lg transition-all hover:scale-105 w-full justify-center"
                style={{ background: `linear-gradient(135deg, ${QC_GOLD}, ${QC_GOLD_LIGHT})`, color: QC_BLACK }}
              >
                Buy Now <ChevronRight size={18} />
              </Link>
            </GlassCard>
          </FadeUp>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative px-4 py-24">
        <ParticleBackground />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeUp>
            <SectionTitle>Frequently Asked Questions</SectionTitle>
          </FadeUp>
          <div className="space-y-4 mt-12">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <GlassCard>
                  <h4 className="font-medium mb-2" style={{ color: QC_GOLD }}>{faq.q}</h4>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{faq.a}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="text-center px-4 py-12 border-t" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
        <p className="font-serif text-lg" style={{ color: QC_GOLD }}>Quantum Cure&trade;</p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>Premium Concentrated Black Water</p>
        <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>&copy; {new Date().getFullYear()} MYSTIC YOGA&trade;. All rights reserved.</p>
      </footer>
    </main>
  );
}
