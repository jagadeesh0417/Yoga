"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, User, Clock, MessageSquare } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const services = [
  "Yoga Classes",
  "Meditation",
  "Personal Training",
  "Corporate Wellness",
  "Other",
];

export default function EnquirySection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    time: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[+]?[\d\s\-()]{7,20}$/.test(formData.phone))
      errs.phone = "Enter a valid phone number";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address";
    if (!formData.service) errs.service = "Please select a service";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const msg = [
      "🧘 *New Enquiry Received*",
      "",
      `*Name:* ${formData.name.trim()}`,
      `*Phone:* ${formData.phone.trim()}`,
      `*Email:* ${formData.email.trim() || "Not provided"}`,
      `*Service:* ${formData.service}`,
      `*Preferred Time:* ${formData.time.trim() || "Not specified"}`,
      "",
      "*Message:*",
      formData.message.trim() || "No message",
    ].join("\n");

    setSubmitted(true);
    setToast("Redirecting to WhatsApp...");

    window.open(
      `https://wa.me/919164081909?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setTimeout(() => {
      setFormData({ name: "", phone: "", email: "", service: "", time: "", message: "" });
      setSubmitted(false);
      setToast(null);
    }, 1000);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <section id="enquiry" className="relative py-20 md:py-28 overflow-hidden bg-rose-light">
      <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(91,42,157,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,30,63,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Send Us Your Enquiry"
          subtitle="Fill in your details and we'll connect with you on WhatsApp to discuss your wellness journey."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto mt-12"
        >
          <div className="relative rounded-2xl backdrop-blur-xl bg-white/80 border border-white shadow-xl shadow-wine/5 p-6 sm:p-8 md:p-10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple/[0.02] to-wine/[0.02] pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-ivory/80 mb-1.5">
                    <User size={14} className="text-gold" />
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-wine/10 text-wine placeholder-wine/30 text-sm transition-all duration-200 focus:outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold/20"
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-wine/80 mb-1.5">
                    <Phone size={14} className="text-gold" />
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-wine/10 text-wine placeholder-wine/30 text-sm transition-all duration-200 focus:outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold/20"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-wine/80 mb-1.5">
                    <Mail size={14} className="text-gold" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-wine/10 text-wine placeholder-wine/30 text-sm transition-all duration-200 focus:outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold/20"
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-wine/80 mb-1.5">
                    Service Interested In <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => updateField("service", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-wine/10 text-wine text-sm transition-all duration-200 focus:outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold/20 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-ivory text-wine/40">
                      Select a service
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s} className="bg-ivory text-wine">
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.service && <p className="mt-1 text-xs text-rose-500">{errors.service}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-wine/80 mb-1.5">
                    <Clock size={14} className="text-gold" />
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => updateField("time", e.target.value)}
                    placeholder="Morning / Afternoon / Evening"
                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-wine/10 text-wine placeholder-wine/30 text-sm transition-all duration-200 focus:outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-wine/80 mb-1.5">
                    <MessageSquare size={14} className="text-gold" />
                    Message
                  </label>
                  <textarea
                    rows={1}
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Any specific queries..."
                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-wine/10 text-wine placeholder-wine/30 text-sm transition-all duration-200 focus:outline-none focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold/20 resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={submitted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-wine font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {submitted ? "Redirecting..." : "Send Enquiry"}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-gold text-wine font-semibold text-sm shadow-xl shadow-gold/20"
        >
          {toast}
        </motion.div>
      )}
    </section>
  );
}
