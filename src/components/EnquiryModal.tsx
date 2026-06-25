"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Phone, Mail, User, Clock, MessageSquare } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const services = [
  "Yoga Classes",
  "Meditation",
  "Personal Training",
  "Corporate Wellness",
  "Other",
];

const STORAGE_KEY = "mystic-enquiry-dismissed";

export default function EnquiryModal() {
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setOpen(true);
    }, 5000);

    const onTrigger = () => {
      clearTimeout(timer);
      setOpen(true);
    };
    window.addEventListener("trigger-enquiry", onTrigger);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("trigger-enquiry", onTrigger);
    };
  }, []);

  const close = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

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
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setTimeout(() => {
      setFormData({ name: "", phone: "", email: "", service: "", time: "", message: "" });
      setSubmitted(false);
      setOpen(false);
      setToast(null);
    }, 1000);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
            >
              <div
                className="relative w-full max-w-lg rounded-2xl bg-rose-light border border-white/60 shadow-2xl shadow-purple/10 p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={close}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/60 text-wine/40 hover:text-wine hover:bg-white transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="mb-5 pr-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-gradient-wine-purple">
                    Send Us Your Enquiry
                  </h3>
                  <p className="mt-1 text-sm text-wine/60">
                    We&apos;ll connect on WhatsApp to discuss your wellness journey.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-wine/70 mb-1">
                        <User size={12} className="text-gold" />
                        Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-wine/10 text-wine placeholder-wine/25 text-sm transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                      />
                      {errors.name && <p className="mt-0.5 text-xs text-rose-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-wine/70 mb-1">
                        <Phone size={12} className="text-gold" />
                        Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-wine/10 text-wine placeholder-wine/25 text-sm transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                      />
                      {errors.phone && <p className="mt-0.5 text-xs text-rose-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-wine/70 mb-1">
                        <Mail size={12} className="text-gold" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-wine/10 text-wine placeholder-wine/25 text-sm transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                      />
                      {errors.email && <p className="mt-0.5 text-xs text-rose-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-wine/70 mb-1">
                        Service <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => updateField("service", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-wine/10 text-wine text-sm transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-wine/40">Select service</option>
                        {services.map((s) => (
                          <option key={s} value={s} className="text-wine">{s}</option>
                        ))}
                      </select>
                      {errors.service && <p className="mt-0.5 text-xs text-rose-500">{errors.service}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-wine/70 mb-1">
                        <Clock size={12} className="text-gold" />
                        Preferred Time
                      </label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => updateField("time", e.target.value)}
                        placeholder="Morning / Afternoon"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-wine/10 text-wine placeholder-wine/25 text-sm transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-wine/70 mb-1">
                        <MessageSquare size={12} className="text-gold" />
                        Message
                      </label>
                      <textarea
                        rows={1}
                        value={formData.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Your message..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-wine/10 text-wine placeholder-wine/25 text-sm transition-all focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 resize-none"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitted}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-wine font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    {submitted ? "Redirecting..." : "Send Enquiry"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-6 py-3 rounded-xl bg-gold text-wine font-semibold text-sm shadow-xl shadow-gold/20"
        >
          {toast}
        </motion.div>
      )}
    </>
  );
}
