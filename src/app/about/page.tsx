'use client';

import { motion } from 'framer-motion';
import {
  Quote,
  Sparkles,
  Award,
  Star,
  CheckCircle2,
  Users,
  Globe,
  Clock,
  BookOpen,
  Target,
  Eye,
  Check,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { siteConfig, services } from '@/lib/data';
import { bookConsultationLink } from '@/lib/utils';
import SectionTitle from '@/components/SectionTitle';
import ResponsiveImage from '@/components/ResponsiveImage';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import CertificatesSection from '@/components/sections/CertificatesSection';

const aboutParagraphs = [
  `Sunita Singh is an internationally acclaimed Yoga Master, Pranic Healer, and Holistic Wellness Expert based in Hong Kong, with over 15 years of dedicated experience in transforming lives through the science of yoga, energy healing, mindfulness, and integrative wellness.`,
  `Recognized globally for her exceptional expertise and compassionate approach, Sunita has trained and guided thousands of individuals across Asia, Europe, the Middle East, and North America toward achieving optimal physical health, mental clarity, emotional balance, and spiritual well-being.`,
  `Holding multiple internationally recognized certifications in Yoga, Pranic Healing, Meditation, Breathwork, Mindfulness, and Holistic Lifestyle Management, Sunita combines ancient yogic wisdom with modern wellness science to create highly personalized transformational programs. Her expertise spans Hatha Yoga, Ashtanga Yoga, Vinyasa Flow, Power Yoga, Therapeutic Yoga, Yin Yoga, Restorative Yoga, Prenatal Yoga, Weight Management Yoga, Stress Management Yoga, Meditation, and Energy Healing Therapies.`,
  `Over the years, Sunita has become a trusted wellness mentor to an elite clientele that includes Bollywood celebrities, Hollywood personalities, international business leaders, sports celebrities, entrepreneurs, and high-performing professionals seeking peak physical performance, emotional resilience, and sustainable lifestyle transformation.`,
  `Her unique methodology integrates yoga therapy, energy healing, pranic cleansing, breathwork techniques, nutrition guidance, stress reduction strategies, and mind-body optimization, delivering profound and lasting results for her clients.`,
  `As a sought-after international wellness speaker, trainer, and corporate wellness consultant, Sunita has conducted workshops, retreats, wellness programs, and transformational seminars for multinational organizations, luxury wellness resorts, private groups, and prestigious institutions across the globe.`,
  `Her mission is simple yet powerful: to empower individuals to unlock their highest potential by creating harmony between body, mind, energy, and spirit.`,
  `Today, through her signature wellness brand, ${siteConfig.name}, she continues to inspire people worldwide to embrace a healthier, happier, and more conscious way of living.`,
];

const stats = [
  { target: 5000, suffix: '+', label: 'Students Worldwide', icon: Users },
  { target: 20, suffix: '+', label: 'Countries Reached', icon: Globe },
  { target: 15, suffix: '+', label: 'Years Experience', icon: Clock },
  { target: 100, suffix: '+', label: 'Workshops Conducted', icon: BookOpen },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AboutPage() {
  return (
    <main>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold to-[#B8955A] z-0" />
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.04] z-0 animate-mandala" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/30 via-transparent to-[#D4A373]/20 z-0" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-wine/10 blur-3xl z-0" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gradient-wine-purple text-sm tracking-widest uppercase mb-6">
              <Sparkles size={14} />
              Our Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gradient-wine-purple leading-tight"
          >
            About{' '}
            <span className="text-gradient-wine-purple">
              {siteConfig.name}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 text-lg md:text-xl text-wine/70 max-w-2xl mx-auto leading-relaxed"
          >
            Awaken Your Inner Power. Transform Your Life.
          </motion.p>
        </div>
      </section>

      <section className="relative py-24 md:py-32 bg-ivory overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-wine/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
          >
            <motion.div variants={staggerItem} className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <ResponsiveImage
                  src="/images/founder.png"
                  alt={siteConfig.founder}
                  aspectRatio="aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <Quote size={28} className="text-gold" />
                    </div>
                    <blockquote className="font-serif text-lg md:text-xl text-ivory italic max-w-sm leading-relaxed px-4">
                      &ldquo;True wellness begins when the body is aligned, the
                      mind is calm, the energy flows freely, and the soul feels
                      connected.&rdquo;
                    </blockquote>
                    <div className="mt-4 w-12 h-px bg-gold mx-auto" />
                    <p className="mt-3 font-serif text-base text-gold font-medium">
                      {siteConfig.founder}
                    </p>
                    <p className="text-sm text-ivory/60">
                      Founder, {siteConfig.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/30 rounded-tl-xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/30 rounded-br-xl" />
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-6">
              <div>
                <p className="text-gradient-wine-purple font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                  Founder &amp; Lead Instructor
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-wine-purple leading-tight">
                  Meet {siteConfig.founder}
                </h2>
                <div className="w-16 h-0.5 bg-gold mt-6 mb-4" />
                <p className="text-lg text-gradient-wine-purple font-medium">
                  International Yoga Master | Pranic Healer | Celebrity Wellness
                  Coach | Holistic Lifestyle Expert
                </p>
              </div>

              {aboutParagraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-wine/70 leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="pt-4"
              >
                <p className="flex items-center gap-2 text-sm text-gradient-wine-purple tracking-wider uppercase mb-4 font-medium">
                  <Star size={14} className="text-gold" />
                  Areas of Expertise
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Therapeutic Yoga & Yoga Therapy",
                    "Weight Loss & Body Transformation Programs",
                    "Stress Management & Emotional Wellness",
                    "Pranic Healing & Energy Balancing",
                    "Meditation & Mindfulness Training",
                    "Women's Health & Hormonal Wellness",
                    "Corporate Wellness Programs",
                    "Breathwork & Advanced Pranayama Techniques",
                    "Lifestyle & Nutrition Coaching",
                    "Celebrity Wellness & Performance Optimization",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-wine/70"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-gold mt-0.5 shrink-0"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="pt-2"
              >
                <p className="flex items-center gap-2 text-sm text-gradient-wine-purple tracking-wider uppercase mb-4 font-medium">
                  <Award size={14} className="text-gold" />
                  Professional Highlights
                </p>
                <div className="space-y-2">
                  {[
                    "15+ Years of International Experience",
                    "Internationally Certified Yoga Master & Pranic Healer",
                    "Celebrity Wellness Coach to Elite Clients",
                    "Corporate Wellness Consultant",
                    "International Workshop & Retreat Facilitator",
                    "Specialist in Holistic Mind-Body Transformation",
                    "Based in Hong Kong â€“ Serving Clients Worldwide",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm text-wine/70"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="pt-6 border-t border-wine/10"
              >
                <blockquote className="font-serif text-lg text-wine/80 italic leading-relaxed pl-4 border-l-2 border-gold">
                  &ldquo;True wellness begins when the body is aligned, the mind
                  is calm, the energy flows freely, and the soul feels
                  connected.&rdquo;
                  <footer className="mt-2 text-sm text-gold not-italic font-medium">
                    &mdash; {siteConfig.founder}
                  </footer>
                </blockquote>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
            transition={{ duration: 0.6, ease: 'easeOut' }}
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
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -top-8 -left-4 text-6xl text-gold/20 font-serif leading-none select-none">
              &ldquo;
            </div>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-ivory leading-relaxed font-light italic">
              Yoga is not merely a workout; it is a way of life. When the body,
              mind, and soul align, extraordinary transformation becomes
              possible.
            </p>
            <div className="absolute -bottom-12 -right-4 text-6xl text-gold/20 font-serif leading-none select-none">
              &rdquo;
            </div>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
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

      <section className="relative py-24 md:py-32 gradient-ivory overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wine/[0.02] rounded-full blur-2xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gradient-wine-purple font-semibold text-sm tracking-[0.2em] uppercase">
              Our Purpose
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-4 leading-tight">
              Driven by Purpose, Guided by Wisdom
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                description:
                  'To inspire and empower individuals globally to achieve complete physical, mental, emotional, and spiritual well-being through authentic yoga, mindfulness, and conscious living.',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                description:
                  "To become the world's most trusted holistic wellness platform, transforming millions of lives through yoga, meditation, education, and mindful living.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.7,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  }}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  className="group relative rounded-2xl p-8 md:p-10 bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-xl hover:shadow-wine/5 transition-all duration-500"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wine/0 via-gold/0 to-wine/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center mb-6 group-hover:from-wine group-hover:to-gold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-wine/20">
                      <Icon
                        size={28}
                        className="text-wine group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-wine mb-4 group-hover:text-wine transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-wine/70 leading-relaxed text-base md:text-lg">
                      {item.description}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-wine via-gold to-wine opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-x-0 group-hover:scale-x-100 origin-left" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 bg-ivory overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gradient-wine-purple font-semibold text-sm tracking-[0.2em] uppercase">
              Our Impact
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-4 leading-tight">
              {siteConfig.name} by the Numbers
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  }}
                  className="text-center p-6 md:p-8 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-wine" />
                  </div>
                  <div className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-wine-purple mb-2">
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-wine/60 text-sm md:text-base font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-36 overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] animate-mandala" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ivory/5 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-ivory/80 text-xs font-medium mb-8">
              <Sparkles size={14} className="text-gold" />
              Join Our Community
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-ivory leading-tight"
          >
            Ready to Begin
            <br />
            <span className="text-gold">Your Transformation?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-6 text-ivory/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Join the {siteConfig.name} community and start your journey towards
            holistic wellness.
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
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-ivory/30 hover:border-ivory/60 text-ivory font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Services
            </Link>
          </motion.div>
        </div>
      </section>

      <CertificatesSection />
    </main>
  );
}


