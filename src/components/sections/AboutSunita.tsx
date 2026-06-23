"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, CheckCircle2, Award, Star } from "lucide-react";
import { siteConfig } from "@/lib/data";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AboutSunita() {
  return (
    <section className="relative py-24 md:py-32 bg-ivory overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start"
        >
          <motion.div variants={itemVariants} className="relative lg:sticky lg:top-24">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/founder.png"
                alt={siteConfig.founder}
                width={600}
                height={750}
                className="w-full object-contain block"
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

          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <p className="text-gradient-wine-purple font-semibold text-sm tracking-[0.2em] uppercase mb-3">
                Founder &amp; Lead Instructor
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-wine-purple leading-tight">
                {siteConfig.founder}
              </h2>
              <div className="w-16 h-0.5 bg-gold mt-6 mb-4" />
              <p className="text-lg text-gradient-wine-purple font-medium">
                International Yoga Master | Pranic Healer | Celebrity Wellness
                Coach | Holistic Lifestyle Expert
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-wine/70 leading-relaxed"
            >
              Sunita Singh is an internationally acclaimed Yoga Master, Pranic
              Healer, and Holistic Wellness Expert based in Hong Kong, with over
              15 years of dedicated experience in transforming lives through the
              science of yoga, energy healing, mindfulness, and integrative
              wellness.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-wine/70 leading-relaxed"
            >
              Recognized globally for her exceptional expertise and compassionate
              approach, Sunita has trained and guided thousands of individuals
              across Asia, Europe, the Middle East, and North America toward
              achieving optimal physical health, mental clarity, emotional
              balance, and spiritual well-being.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-wine/70 leading-relaxed"
            >
              Holding multiple internationally recognized certifications in Yoga,
              Pranic Healing, Meditation, Breathwork, Mindfulness, and Holistic
              Lifestyle Management, Sunita combines ancient yogic wisdom with
              modern wellness science to create highly personalized
              transformational programs. Her expertise spans Hatha Yoga, Ashtanga
              Yoga, Vinyasa Flow, Power Yoga, Therapeutic Yoga, Yin Yoga,
              Restorative Yoga, Prenatal Yoga, Weight Management Yoga, Stress
              Management Yoga, Meditation, and Energy Healing Therapies.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-wine/70 leading-relaxed"
            >
              Over the years, Sunita has become a trusted wellness mentor to an
              elite clientele that includes Bollywood celebrities, Hollywood
              personalities, international business leaders, sports celebrities,
              entrepreneurs, and high-performing professionals seeking peak
              physical performance, emotional resilience, and sustainable
              lifestyle transformation.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-wine/70 leading-relaxed"
            >
              Her unique methodology integrates yoga therapy, energy healing,
              pranic cleansing, breathwork techniques, nutrition guidance, stress
              reduction strategies, and mind-body optimization, delivering
              profound and lasting results for her clients.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-wine/70 leading-relaxed"
            >
              As a sought-after international wellness speaker, trainer, and
              corporate wellness consultant, Sunita has conducted workshops,
              retreats, wellness programs, and transformational seminars for
              multinational organizations, luxury wellness resorts, private
              groups, and prestigious institutions across the globe.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-wine/70 leading-relaxed"
            >
              Her mission is simple yet powerful: to empower individuals to
              unlock their highest potential by creating harmony between body,
              mind, energy, and spirit.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-wine/70 leading-relaxed"
            >
              Today, through her signature wellness brand,{siteConfig.name}
              , she continues to inspire people worldwide to embrace a healthier,
              happier, and more conscious way of living.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
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
              transition={{ duration: 0.5, delay: 0.5 }}
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
                  "Based in Hong Kong – Serving Clients Worldwide",
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
              transition={{ duration: 0.5, delay: 0.55 }}
              className="pt-6 border-t border-wine/10"
            >
              <blockquote className="font-serif text-lg text-wine/80 italic leading-relaxed pl-4 border-l-2 border-gold">
                &ldquo;True wellness begins when the body is aligned, the mind is
                calm, the energy flows freely, and the soul feels
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
  );
}
