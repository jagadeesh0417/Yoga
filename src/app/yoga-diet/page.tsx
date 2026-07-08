'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowRight, Sparkles, ChevronDown,
  Apple, Activity, Brain, Heart, Moon, Sun, Zap,
  Dumbbell, Salad, Users, GraduationCap,
  Briefcase, Home, Star, Target, Clock,
  MessageCircle, BookOpen, Leaf, Flame,
  Menu as MenuIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn, bookConsultationLink, whatsappLink } from '@/lib/utils';
import SectionTitle from '@/components/SectionTitle';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
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

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.3, ease: 'easeOut' } },
};

const benefits = [
  { icon: Target, title: 'Weight Management', desc: 'Achieve and maintain your ideal weight with a balanced approach.' },
  { icon: Zap, title: 'Increased Energy', desc: 'Feel more energetic throughout the day with optimized nutrition and movement.' },
  { icon: Apple, title: 'Better Digestion', desc: 'Improve gut health through mindful eating and yoga postures.' },
  { icon: Activity, title: 'Improved Flexibility', desc: 'Enhance your range of motion with targeted yoga sequences.' },
  { icon: Brain, title: 'Stress Reduction', desc: 'Lower cortisol levels through breathwork and relaxation techniques.' },
  { icon: Moon, title: 'Better Sleep', desc: 'Rest deeply and wake up refreshed with evening yoga and sleep hygiene.' },
  { icon: Sun, title: 'Mental Clarity', desc: 'Sharpen focus and mental acuity with meditation and clean nutrition.' },
  { icon: Heart, title: 'Healthy Lifestyle', desc: 'Build sustainable habits that support lifelong wellness.' },
  { icon: Activity, title: 'Better Posture', desc: 'Strengthen your core and align your body through regular practice.' },
  { icon: Shield, title: 'Stronger Immunity', desc: 'Boost your immune system with anti-inflammatory foods and yoga.' },
];

const whatsIncluded = [
  {
    icon: Activity,
    title: 'Personalized Yoga',
    items: ['One-on-One Yoga', 'Group Sessions', 'Breathwork', 'Meditation', 'Flexibility', 'Strength Building'],
    gradient: 'from-wine/20 to-purple/10',
  },
  {
    icon: Apple,
    title: 'Nutrition Guidance',
    items: ['Personalized Meal Plan', 'Healthy Eating Habits', 'Lifestyle Coaching', 'Weekly Progress Review', 'Weight Management'],
    gradient: 'from-gold/20 to-wine/10',
  },
  {
    icon: Leaf,
    title: 'Complete Wellness Package',
    items: ['Holistic Health Assessment', 'Integrated Yoga + Diet Plan', 'Progress Tracking', 'Ongoing Support', 'Sustainable Results'],
    gradient: 'from-purple/20 to-gold/10',
  },
];

const whoCanJoin = [
  { icon: Users, label: 'Beginners' },
  { icon: Briefcase, label: 'Professionals' },
  { icon: GraduationCap, label: 'Students' },
  { icon: Home, label: 'Homemakers' },
  { icon: Heart, label: 'Seniors' },
  { icon: Star, label: 'Anyone seeking holistic wellness' },
];

const howItWorks = [
  { step: '01', title: 'Book Consultation', desc: 'Schedule a free consultation to discuss your health goals.' },
  { step: '02', title: 'Health Assessment', desc: 'Complete a comprehensive wellness evaluation.' },
  { step: '03', title: 'Personalized Yoga Plan', desc: 'Receive a custom yoga routine designed for your needs.' },
  { step: '04', title: 'Customized Nutrition Plan', desc: 'Get a tailored meal plan aligned with your goals.' },
  { step: '05', title: 'Weekly Follow-up', desc: 'Stay on track with regular check-ins and adjustments.' },
  { step: '06', title: 'Achieve Sustainable Results', desc: 'Build lifelong habits for lasting health and wellness.' },
];

const whyChooseUs = [
  { icon: Star, title: 'Certified Instructor', desc: 'Learn from experienced and certified yoga professionals.' },
  { icon: Target, title: 'Personalized Programs', desc: 'Every plan is tailored to your unique body and goals.' },
  { icon: Leaf, title: 'Holistic Wellness', desc: 'We address mind, body, and nutrition for complete health.' },
  { icon: Globe, title: 'Online & Offline Sessions', desc: 'Attend from anywhere with flexible session options.' },
  { icon: Heart, title: 'Individual Attention', desc: 'Small class sizes ensure you get the guidance you deserve.' },
  { icon: Clock, title: 'Continuous Support', desc: 'We are with you every step of the way on your journey.' },
];

const faqs = [
  { q: 'Is this suitable for beginners?', a: 'Absolutely! Our program is designed for all levels, from complete beginners to advanced practitioners. We tailor every plan to your current fitness level.' },
  { q: 'Are diet plans personalized?', a: 'Yes. Each nutrition plan is customized based on your body type, health goals, dietary preferences, and any medical considerations you may have.' },
  { q: 'Can I join online?', a: 'Yes! We offer both online and in-person sessions. Our virtual programs are just as comprehensive and effective.' },
  { q: 'How long is the program?', a: 'The standard program runs for 12 weeks, but we also offer flexible durations based on your specific needs and goals.' },
  { q: 'How often are follow-ups?', a: 'You will have weekly follow-up sessions to track progress, address concerns, and make adjustments to your plan.' },
];

function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" /><path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" /><path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" /><circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-wine/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
      >
        <span className="font-serif text-lg md:text-xl font-semibold text-wine group-hover:text-wine transition-colors duration-300 pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full bg-wine/5 flex items-center justify-center flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-wine" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 md:pb-6 text-wine/60 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function YogaDietPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-[url('/images/yoga-diet-hero.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] animate-mandala" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ivory/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-wine/80 via-wine/40 to-wine/50" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold text-sm tracking-widest uppercase mb-6">
              <Sparkles size={14} />
              Yoga + Diet Program
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-ivory leading-tight"
          >
            Transform Your Body.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold">
              Balance Your Life.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 text-lg md:text-xl text-ivory/70 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the perfect combination of mindful yoga and personalized nutrition designed to improve your physical health, mental clarity, and overall well-being.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
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
              href={whatsappLink('Hi! I am interested in the Yoga + Diet Program at MYSTIC YOGA™. Please share more details.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-ivory/30 hover:border-ivory/60 text-ivory font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Join Program
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Program */}
      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/yoga-diet-about.jpg"
                  alt="Yoga and healthy nutrition"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wine/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-gold/10 backdrop-blur-md border border-gold/20 flex items-center justify-center hidden md:flex">
                <Leaf className="w-12 h-12 text-gold" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">About the Program</span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-wine-purple mt-3 leading-tight">
                Yoga <span className="text-gold">+</span> Diet
              </h2>
              <div className="w-12 h-0.5 bg-gold mt-5 mb-6" />
              <p className="text-wine/60 text-base md:text-lg leading-relaxed mb-4">
                True wellness begins when movement and nutrition work together.
              </p>
              <p className="text-wine/60 text-base md:text-lg leading-relaxed">
                Our Yoga + Diet Program combines personalized yoga sessions with customized nutrition guidance to improve flexibility, strength, energy, digestion, mental wellness, and long-term healthy habits.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-24 md:py-32 gradient-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] animate-mandala" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-ivory/5 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Benefits You Will Experience"
            subtitle="Transform every dimension of your wellbeing with our integrated approach."
            light
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
          >
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-4 group-hover:bg-gold/25 transition-all duration-300">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ivory mb-2">{benefit.title}</h3>
                  <p className="text-ivory/60 text-sm leading-relaxed">{benefit.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="relative py-24 md:py-32 gradient-lavender overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-wine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionTitle
            title="What's Included"
            subtitle="A comprehensive program designed for complete transformation."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {whatsIncluded.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover="hover"
                  initial="rest"
                  className="group relative rounded-2xl p-8 bg-white/80 backdrop-blur-sm border border-wine/5 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br",
                    item.gradient
                  )}>
                    <Icon className="w-8 h-8 text-wine" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-wine mb-4">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.items.map((li) => (
                      <li key={li} className="flex items-start gap-3 text-wine/70">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-wine" />
                        </span>
                        <span className="text-sm md:text-base">{li}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Who Can Join */}
      <section className="relative py-24 md:py-32 gradient-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] animate-mandala" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Who Can Join?"
            subtitle="This program is designed for everyone, regardless of age or fitness level."
            light
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {whoCanJoin.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mb-3 group-hover:bg-gold/25 transition-all duration-300">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <span className="font-serif text-sm font-semibold text-ivory">{item.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionTitle
            title="How It Works"
            subtitle="Your journey to holistic wellness in six simple steps."
          />

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-wine/30 to-transparent hidden md:block" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-8 md:space-y-0 relative"
            >
              {howItWorks.map((item, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="md:flex items-start gap-8 pb-8 md:pb-12 relative"
                >
                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-wine to-purple text-ivory font-serif text-lg font-bold shadow-lg shrink-0 relative z-10">
                    {item.step}
                  </div>
                  <div className="md:hidden flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-wine to-purple text-ivory font-serif text-sm font-bold shrink-0">
                      {item.step}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-wine">{item.title}</h3>
                  </div>
                  <div className="flex-1 ml-0 md:ml-4">
                    <h3 className="hidden md:block font-serif text-xl font-bold text-wine mb-2">{item.title}</h3>
                    <p className="text-wine/60 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Mystic Yoga */}
      <section className="relative py-24 md:py-32 gradient-lavender overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-wine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Why Choose Mystic Yoga"
            subtitle="We are committed to your transformation with personalized care and expertise."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyChooseUs.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="group relative rounded-2xl p-8 bg-white/80 backdrop-blur-sm border border-wine/5 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wine/10 to-gold/10 flex items-center justify-center mb-5 group-hover:from-wine group-hover:to-gold transition-all duration-300">
                    <Icon className="w-7 h-7 text-wine group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-wine mb-3">{item.title}</h3>
                  <p className="text-wine/60 leading-relaxed text-sm md:text-base">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-wine/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our Yoga + Diet Program."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.q}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === faq.q}
                onToggle={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
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
              Begin Your Wellness Journey Today
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-ivory leading-tight"
          >
            Begin Your Wellness{' '}
            <br />
            <span className="text-gold">Journey Today</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-6 text-ivory/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Experience yoga and nutrition together for lasting health.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={whatsappLink('Hi! I want to join the Yoga + Diet Program at MYSTIC YOGA™. Please share the next steps.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold hover:bg-gold/90 text-wine font-semibold text-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5"
            >
              Join Now
              <ArrowRight size={16} />
            </Link>
            <Link
              href={bookConsultationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-ivory/30 hover:border-ivory/60 text-ivory font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
