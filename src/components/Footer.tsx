"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { siteConfig } from "@/lib/data";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Why Us", href: "/why-us" },
  { label: "Benefits", href: "/benefits" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "Training", href: "/training" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Personal Yoga Training",
  "Meditation & Mindfulness",
  "Corporate Wellness",
  "Luxury Wellness Retreats",
  "Online Classes",
];

const socialLinks = [
  { icon: FaInstagram, href: siteConfig.socials.instagram, label: "Instagram" },
  { icon: FaFacebook, href: siteConfig.socials.facebook, label: "Facebook" },
  { icon: FaYoutube, href: siteConfig.socials.youtube, label: "YouTube" },
  { icon: FaLinkedinIn, href: siteConfig.socials.linkedin, label: "LinkedIn" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative gradient-primary overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/logo.png"
              alt="MYSTIC YOGA"
              width={160}
              height={45}
              className="h-10 w-auto object-contain brightness-0 invert mb-4"
            />
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold/20 flex items-center justify-center text-white/60 hover:text-gold transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-gold font-semibold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-gold font-semibold text-sm uppercase tracking-widest mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-white/60 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-gold font-semibold text-sm uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <span className="text-white/60">{siteConfig.headquarters}</span>
              </li>
              {siteConfig.phones.map((phone) => (
                <li key={phone} className="flex items-start gap-3">
                  <Phone size={16} className="text-gold shrink-0 mt-0.5" />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold shrink-0 mt-0.5" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-white/60 hover:text-gold transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 max-w-md w-full">
              <h5 className="text-white/80 text-sm font-medium mb-3">
                Subscribe to our newsletter
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-gold hover:bg-gold/90 text-wine font-semibold text-sm transition-all duration-300"
                >
                  <Send size={16} />
                </button>
              </form>
              {subscribed && (
                <p className="text-gold text-xs mt-2">
                  Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
