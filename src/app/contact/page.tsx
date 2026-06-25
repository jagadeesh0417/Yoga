'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedinIn,
} from 'react-icons/fa';
import SectionTitle from '@/components/SectionTitle';
import { siteConfig, faqs } from '@/lib/data';
import { cn, whatsappLink } from '@/lib/utils';
import { whatsappUrl } from '@/lib/constants';
import type { ContactFormData } from '@/lib/types';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const socialLinks = [
  { icon: FaInstagram, href: siteConfig.socials.instagram, label: 'Instagram' },
  { icon: FaFacebook, href: siteConfig.socials.facebook, label: 'Facebook' },
  { icon: FaYoutube, href: siteConfig.socials.youtube, label: 'YouTube' },
  { icon: FaLinkedinIn, href: siteConfig.socials.linkedin, label: 'LinkedIn' },
];

const subjects = [
  'General Inquiry',
  'Class Booking',
  'Corporate Wellness',
  'Teacher Training',
  'Retreat Inquiry',
  'Other',
];

const inputClasses =
  'w-full px-4 py-3 rounded-xl bg-white border border-wine/10 text-wine text-sm placeholder:text-wine/30 focus:outline-none focus:border-wine/30 focus:ring-2 focus:ring-wine/10 transition-all duration-300';

const inputErrorClasses = 'border-red-400 focus:border-red-400 focus:ring-red-100';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const msg = [
      "New Contact Request",
      "",
      `Name: ${formData.name}`,
      `Phone: ${formData.phone || "Not provided"}`,
      `Email: ${formData.email}`,
      `Subject: ${formData.subject}`,
      `Message: ${formData.message}`,
    ].join("\n");

    const url = whatsappUrl(msg);

    setTimeout(() => {
      setSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      window.open(url, '_blank', 'noopener,noreferrer');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }, 500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const staggerItem = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: i * 0.1 },
  });

  return (
    <>
      <section className="relative py-28 md:py-36 overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, #D4A373 1px, transparent 1px), radial-gradient(circle at 80% 30%, #F8F5F0 1px, transparent 1px)',
              backgroundSize: '60px 60px, 50px 50px',
            }}
          />
        </div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory tracking-tight"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 text-lg md:text-xl text-ivory/70 max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;d love to hear from you. Reach out and let&apos;s start a conversation.
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-0.5 bg-gold rounded-full mx-auto mt-8"
          />
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden gradient-rose">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 75% 25%, #7A3045 1px, transparent 1px), radial-gradient(circle at 25% 75%, #D4A373 1px, transparent 1px)',
            backgroundSize: '60px 60px, 40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <div className="space-y-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-4xl md:text-5xl font-bold text-gradient-wine-purple leading-tight"
                >
                  {siteConfig.name}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-wine/60 text-base leading-relaxed"
                >
                  {siteConfig.description}
                </motion.p>
              </div>

              <div className="mt-10 space-y-4">
                {[
                  { icon: MapPin, label: 'International Headquarters', value: siteConfig.headquarters },
                  { icon: Phone, label: 'Phone', value: siteConfig.phones[0], href: `tel:${siteConfig.phones[0].replace(/\s/g, '')}` },
                  { icon: Phone, label: 'Phone', value: siteConfig.phones[1], href: `tel:${siteConfig.phones[1].replace(/\s/g, '')}` },
                  { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                ].map((info, i) => (
                  <motion.div
                    key={`${info.label}-${i}`}
                    {...staggerItem(i)}
                    className="flex items-start gap-4 p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:border-gold/20 transition-all duration-300"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-lg bg-wine/10 flex items-center justify-center">
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <p className="text-wine/50 text-sm font-medium mb-4">Working Hours</p>
                <div className="p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white shadow-sm">
                  <p className="text-wine font-medium">Monday - Saturday: 6:00 AM - 8:00 PM</p>
                  <p className="text-wine/50 text-sm mt-1">Sunday: 7:00 AM - 12:00 PM</p>
                </div>
              </motion.div>

              <motion.a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-green-500 hover:bg-green-500/90 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5 mt-6"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </motion.a>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="pt-6"
              >
                <p className="text-wine/50 text-sm font-medium mb-4">Follow Us</p>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-wine/5 hover:bg-wine/10 flex items-center justify-center text-wine/50 hover:text-wine transition-all duration-300"
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
                <h3 className="font-serif text-2xl font-bold text-wine mb-6">Send Us a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-wine/60 uppercase tracking-wider">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={cn(inputClasses, errors.name && inputErrorClasses)}
                    />
                    {errors.name && (
                      <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-wine/60 uppercase tracking-wider">
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
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold text-wine/60 uppercase tracking-wider">
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
                        <AlertCircle size={12} /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-semibold text-wine/60 uppercase tracking-wider">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={cn(
                        inputClasses,
                        'appearance-none cursor-pointer',
                        errors.subject && inputErrorClasses,
                      )}
                    >
                      <option value="" disabled>Select a subject</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                        <AlertCircle size={12} /> {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="message" className="text-xs font-semibold text-wine/60 uppercase tracking-wider">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your inquiry..."
                      className={cn(inputClasses, 'resize-none', errors.message && inputErrorClasses)}
                    />
                    {errors.message && (
                      <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                        <AlertCircle size={12} /> {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-wine hover:bg-wine/90 disabled:bg-wine/60 text-ivory font-semibold text-sm transition-all duration-300 shadow-lg shadow-wine/20 hover:shadow-wine/30"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 px-4 py-3 rounded-xl bg-wine/10 text-wine text-sm font-medium inline-flex items-center gap-2 w-full"
                    >
                      <CheckCircle size={16} />
                      Redirecting to WhatsApp...
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-wine overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #D4A373 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Visit Us"
            subtitle="Find us at our international headquarters in the heart of Hong Kong"
            light
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="w-full h-[400px] rounded-2xl overflow-hidden glass-dark flex items-center justify-center cursor-pointer group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-purple/80 via-transparent to-transparent z-10" />
            <div className="relative z-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors duration-300">
                <MapPin size={32} className="text-gold" />
              </div>
              <p className="text-ivory font-serif text-xl font-semibold">{siteConfig.headquarters}</p>
              <p className="text-gold/70 text-xs mt-4 font-medium tracking-wider uppercase">
                Click to open in Google Maps
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden gradient-rose">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, #7A3045 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our programs and services"
          />

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl bg-white/70 backdrop-blur-sm border border-white shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-wine font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-wine transition-transform duration-300',
                      openFaq === i && 'rotate-180',
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-wine/70 text-sm leading-relaxed border-t border-wine/5 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
