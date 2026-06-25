"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import SectionTitle from "@/components/SectionTitle";
import { siteConfig } from "@/lib/data";
import { cn, whatsappLink } from "@/lib/utils";
import { whatsappUrl } from "@/lib/constants";
import type { ContactFormData } from "@/lib/types";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const socialLinks = [
  { icon: FaInstagram, href: siteConfig.socials.instagram, label: "Instagram" },
  { icon: FaFacebook, href: siteConfig.socials.facebook, label: "Facebook" },
  { icon: FaYoutube, href: siteConfig.socials.youtube, label: "YouTube" },
  { icon: FaLinkedinIn, href: siteConfig.socials.linkedin, label: "LinkedIn" },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Location",
    value: siteConfig.headquarters,
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phones[0],
    href: `tel:${siteConfig.phones[0].replace(/\s/g, "")}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phones[1],
    href: `tel:${siteConfig.phones[1].replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
];

const inputClasses =
  "w-full px-4 py-3 rounded-xl bg-white border border-wine/10 text-wine text-sm placeholder:text-wine/40 focus:outline-none focus:border-wine focus:ring-2 focus:ring-wine/10 transition-all duration-300";

const inputErrorClasses =
  "border-red-400 focus:border-red-400 focus:ring-red-100";

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const msg = [
      "New Yoga Enquiry",
      "",
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || "Not provided"}`,
      `Message: ${formData.message}`,
    ].join("\n");

    const url = whatsappUrl(msg);

    window.open(url, "_blank", "noopener,noreferrer");

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 overflow-hidden bg-rose-light"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 25%, #7A3045 1px, transparent 1px), radial-gradient(circle at 25% 75%, #D4A373 1px, transparent 1px)",
          backgroundSize: "60px 60px, 40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Get In Touch"
          subtitle="We'd love to hear from you. Reach out and let's start a conversation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="space-y-8"
          >
            <div className="space-y-5">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={`${info.label}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:border-wine/20 transition-all duration-300"
                >
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-wine/5 flex items-center justify-center">
                    <info.icon size={20} className="text-wine" />
                  </div>
                  <div>
                    <p className="text-xs text-wine/40 font-medium uppercase tracking-wider mb-0.5">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-wine font-medium hover:text-wine transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-wine font-medium">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-green-500 hover:bg-green-500/90 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-4"
            >
              <p className="text-wine/60 text-sm font-medium mb-4">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-wine/5 hover:bg-wine/10 flex items-center justify-center text-wine/30 hover:text-wine transition-all duration-300"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-lg shadow-wine/5"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 sm:hidden" />

                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold text-wine/60 uppercase tracking-wider"
                  >
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={cn(inputClasses, errors.name && inputErrorClasses)}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle size={12} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-wine/60 uppercase tracking-wider"
                  >
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={cn(inputClasses, errors.email && inputErrorClasses)}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-semibold text-wine/60 uppercase tracking-wider"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+852 4464 4381"
                    className={cn(inputClasses, errors.phone && inputErrorClasses)}
                  />
                  {errors.phone && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle size={12} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="subject"
                    className="text-xs font-semibold text-wine/60 uppercase tracking-wider"
                  >
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={cn(
                      inputClasses,
                      errors.subject && inputErrorClasses
                    )}
                  />
                  {errors.subject && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle size={12} />
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-semibold text-wine/60 uppercase tracking-wider"
                  >
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your inquiry..."
                    className={cn(
                      inputClasses,
                      "resize-none",
                      errors.message && inputErrorClasses
                    )}
                  />
                  {errors.message && (
                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <AlertCircle size={12} />
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-wine/20 hover:shadow-wine/30"
                >
                  Submit Enquiry
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
