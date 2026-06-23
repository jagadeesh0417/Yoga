"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Sparkles, Expand } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import ResponsiveImage from "@/components/ResponsiveImage";

const certificates = [
  { id: 1, src: "/images/certificate-1.png", title: "Internationally Certified Yoga Programs" },
  { id: 2, src: "/images/certificate-2.png", title: "Advanced Yoga Training Certification" },
  { id: 3, src: "/images/certificate-3.png", title: "Professional Wellness Coaching" },
  { id: 4, src: "/images/certificate-4.png", title: "Holistic Health Practitioner" },
  { id: 5, src: "/images/Screenshot 2026-06-23 132214.png", title: "Advanced Yoga Certification" },
];

export default function CertificatesSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="relative py-24 md:py-32 bg-rose-light overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #7A3045 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <SectionTitle
          title="Certifications & Accreditations"
          subtitle="Globally recognized certifications that reflect our commitment to excellence in wellness education."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelected(cert.src)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg shadow-wine/5 border border-gold/10 group-hover:shadow-xl group-hover:shadow-wine/10 transition-all duration-500">
                <ResponsiveImage
                  src={cert.src}
                  alt={cert.title}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                    <Expand size={18} className="text-wine" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-center font-serif text-sm font-semibold text-wine/80">
                {cert.title}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-wine/5 border border-wine/10 text-wine/60 text-sm">
            <Sparkles size={14} />
            Trusted by students across Hong Kong, Singapore, Dubai, London & New York
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-3xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 p-2 text-ivory/60 hover:text-ivory transition-colors"
              >
                <X size={24} />
              </button>
              <div className="relative w-full h-[85vh] bg-white rounded-2xl overflow-hidden">
                <Image
                  src={selected}
                  alt="Certificate"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
