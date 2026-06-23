"use client";

import { motion } from "framer-motion";
import {
  Award,
  Monitor,
  ClipboardCheck,
  ScrollText,
  Users,
  TrendingUp,
  ArrowRight,
  Download,
} from "lucide-react";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/utils";

const features = [
  { icon: Award, title: "International Curriculum" },
  { icon: Monitor, title: "Live Online Training" },
  { icon: ClipboardCheck, title: "Practical Assessments" },
  { icon: ScrollText, title: "Certification" },
  { icon: Users, title: "Lifetime Community Access" },
  { icon: TrendingUp, title: "Business Growth Guidance" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function TeacherTrainingSection() {
  return (
    <section
      id="training"
      className="relative py-20 md:py-28 overflow-hidden bg-lavender-light"
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 85%, #D4A373 1px, transparent 1px), radial-gradient(circle at 85% 15%, #F8F5F0 1px, transparent 1px)",
          backgroundSize: "50px 50px, 70px 70px",
        }}
      />

      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="International Yoga Teacher Training"
          subtitle="Become a certified yoga instructor with our globally recognized training program"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <div className="space-y-6">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-wine leading-tight">
                Become a Certified Yoga Instructor
              </h3>

              <div className="space-y-4 text-wine/60 leading-relaxed">
                <p>
                  Embark on a transformative journey to become an internationally
                  certified yoga teacher. Our comprehensive training program
                  combines ancient wisdom with modern science, preparing you to
                  teach with confidence and authenticity.
                </p>
                <p>
                  Whether you dream of teaching in studios, leading retreats, or
                  building your own wellness brand, our program provides the
                  knowledge, skills, and certification you need to succeed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={whatsappLink(
                    "Hi! I'm interested in the International Yoga Teacher Training program. Please share more details."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-wine/20 hover:shadow-wine/30 hover:-translate-y-0.5"
                >
                  Apply Now
                  <ArrowRight size={16} />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-wine/30 hover:border-wine/50 text-wine font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5">
                  <Download size={16} />
                  Download Brochure
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-5"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={featureVariants}
                className="group flex items-center gap-5 p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-wine/5 flex items-center justify-center group-hover:bg-wine/10 transition-colors duration-300">
                  <feature.icon size={22} className="text-wine" />
                </div>
                <span className="text-wine font-medium text-base">
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
