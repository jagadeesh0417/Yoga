'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EnquiryForm() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const seen = localStorage.getItem('enquiry-seen');
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: 'Website Enquiry',
          message: form.message || 'No message provided',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      localStorage.setItem('enquiry-seen', 'true');
    } catch {
      setErrors({ submit: 'Failed to send. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('enquiry-seen', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-beige">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine to-purple flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-wine">
                      {submitted ? 'Thank You!' : 'Begin Your Journey'}
                    </h2>
                    <p className="text-wine/50 text-xs">
                      {submitted ? "We'll be in touch shortly" : 'Share your details to get started'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-wine/50 hover:text-wine hover:bg-rose transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-wine mb-2">
                      Enquiry Submitted!
                    </h3>
                    <p className="text-wine/60 text-sm mb-6">
                      Thank you, {form.name.split(' ')[0]}! Our team will review your enquiry and get back to you within 24 hours.
                    </p>
                    <button
                      onClick={handleDismiss}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-wine/20"
                    >
                      Done
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.submit && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {errors.submit}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30',
                          errors.name ? 'border-red-300 bg-red-50' : 'border-beige bg-ivory/50 text-wine placeholder:text-wine/30'
                        )}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30',
                          errors.email ? 'border-red-300 bg-red-50' : 'border-beige bg-ivory/50 text-wine placeholder:text-wine/30'
                        )}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+852 4464 4381"
                        className="w-full px-4 py-3 rounded-xl border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us about your goals or questions..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDismiss}
                        className="flex-1 py-3 rounded-xl border border-beige text-wine/60 font-medium text-sm hover:bg-ivory transition-all"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60 shadow-lg shadow-wine/20 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Submit Enquiry'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
