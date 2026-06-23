"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-ivory" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #7A3045 1px, transparent 1px), radial-gradient(circle at 80% 50%, #D4A373 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-12 h-12 rounded-full bg-wine/10 flex items-center justify-center mx-auto mb-6">
            <Mail size={20} className="text-wine" />
          </div>

          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-wine">
            Join Our Wellness Community
          </h2>
          <p className="mt-4 text-wine/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Subscribe to receive weekly wellness tips, exclusive offers, and
            updates on our latest programs and retreats.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1 w-full">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-wine/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-wine/10 text-wine text-sm placeholder:text-wine/30 focus:outline-none focus:border-wine/30 focus:ring-2 focus:ring-wine/10 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-wine hover:bg-wine/90 text-ivory text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-wine/20 hover:shadow-wine/30"
            >
              Subscribe
              <ArrowRight size={16} />
            </button>
          </form>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 px-4 py-3 rounded-xl bg-wine/5 text-wine text-sm font-medium inline-flex items-center gap-2"
              )}
            >
              <CheckCircle size={16} />
              Welcome to our community! Check your inbox for a confirmation.
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
