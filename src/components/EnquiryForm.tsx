'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, Sparkles, Wallet, CreditCard, Smartphone, Upload, Copy, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type PaymentMethod = 'razorpay' | 'alipay' | 'fps' | null;
type Step = 'details' | 'payment' | 'upload' | 'success';

export default function EnquiryForm() {
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('details');
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [reference] = useState(
    () => `ENQ${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const seen = localStorage.getItem('enquiry-seen');
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('enquiry-seen', 'true');
  };

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateDetails()) setStep('payment');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!method) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set('name', form.name);
      fd.set('email', form.email);
      fd.set('phone', form.phone);
      fd.set('message', form.message);
      fd.set('paymentMethod', method);
      fd.set('reference', reference);
      if (file) fd.set('screenshot', file);
      const res = await fetch('/api/enquiry', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');
      setStep('success');
      localStorage.setItem('enquiry-seen', 'true');
    } catch {
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const qrImage = method === 'razorpay' ? '/images/razorpay-qr.png' :
    method === 'alipay' ? '/images/alipay-qr.png' :
    method === 'fps' ? '/images/fps-qr.png' : null;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
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
                      {step === 'success' ? 'Thank You!' : 'Start Your Journey'}
                    </h2>
                    <p className="text-wine/50 text-xs">
                      {step === 'details' ? 'Tell us about yourself' :
                       step === 'payment' ? 'Choose payment method' :
                       step === 'upload' ? 'Upload payment proof' :
                       "We'll be in touch shortly"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-wine/50 hover:text-wine hover:bg-rose transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Step indicators */}
              <div className="px-6 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  {(['details', 'payment', 'upload', 'success'] as const).map((s, i) => {
                    const idx = ['details', 'payment', 'upload', 'success'].indexOf(step);
                    const active = i <= idx && step !== 'success';
                    const done = i < idx;
                    return (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors shrink-0',
                          done ? 'bg-green-500 text-white' :
                          active ? 'bg-gradient-to-r from-wine to-purple text-white' :
                          'bg-ivory text-wine/30'
                        )}>
                          {done ? <Check size={14} /> : i + 1}
                        </div>
                        {i < 3 && (
                          <div className={cn('h-0.5 flex-1 transition-colors', i < idx ? 'bg-green-400' : 'bg-beige')} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6">
                {step === 'details' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="text-wine/60 text-sm mb-6">
                      Share your details and we&apos;ll help you get started with the right program.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-wine/80 mb-1.5">Full Name *</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className={cn('w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold/30',
                            errors.name ? 'border-red-300 bg-red-50' : 'border-beige bg-ivory/50 text-wine placeholder:text-wine/30')} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-wine/80 mb-1.5">Email Address *</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className={cn('w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold/30',
                            errors.email ? 'border-red-300 bg-red-50' : 'border-beige bg-ivory/50 text-wine placeholder:text-wine/30')} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-wine/80 mb-1.5">Phone Number</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+852 4464 4381"
                          className="w-full px-4 py-3 rounded-xl border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-wine/80 mb-1.5">Your Message</label>
                        <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="Tell us about your goals or questions..." rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={dismiss} className="flex-1 py-3 rounded-xl border border-beige text-wine/60 font-medium text-sm hover:bg-ivory transition-all">Skip</button>
                        <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-wine/20">Next — Choose Payment</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="text-wine/60 text-sm mb-6">Select your payment method to complete the enquiry.</p>
                    <div className="space-y-3">
                      <button onClick={() => { setMethod('razorpay'); setStep('upload'); }}
                        className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <Wallet className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-wine">Razorpay</p>
                          <p className="text-xs text-wine/50">Pay with Razorpay UPI / Card / Net Banking</p>
                        </div>
                        <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button onClick={() => { setMethod('alipay'); setStep('upload'); }}
                        className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <CreditCard className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-wine">Alipay</p>
                          <p className="text-xs text-wine/50">Pay with Alipay QR code</p>
                        </div>
                        <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button onClick={() => { setMethod('fps'); setStep('upload'); }}
                        className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                          <Smartphone className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-wine">FPS</p>
                          <p className="text-xs text-wine/50">Pay with Faster Payment System</p>
                        </div>
                        <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                    <button onClick={() => setStep('details')} className="mt-4 text-sm text-wine/50 hover:text-wine transition-colors">← Back</button>
                  </motion.div>
                )}

                {step === 'upload' && method && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    {errors.submit && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4">{errors.submit}</div>
                    )}

                    {/* QR Code */}
                    {qrImage && (
                      <div className="text-center mb-4">
                        <div className="relative w-40 h-40 mx-auto rounded-xl border-2 border-beige p-2 overflow-hidden bg-white">
                          <Image src={qrImage} alt={`${method} QR`} fill className="object-contain p-1" />
                        </div>
                        <p className="text-wine font-semibold text-sm mt-2">
                          Scan & Pay via {method === 'razorpay' ? 'Razorpay' : method === 'alipay' ? 'Alipay' : 'FPS'}
                        </p>
                      </div>
                    )}

                    {/* Reference */}
                    <div className="bg-ivory rounded-xl p-3 mb-4">
                      <p className="text-xs text-wine/50 mb-1">Reference Number</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold text-wine bg-white px-3 py-1.5 rounded-lg border border-beige flex-1 truncate">{reference}</code>
                        <button onClick={() => handleCopy(reference)}
                          className="w-8 h-8 rounded-lg bg-white border border-beige flex items-center justify-center text-wine/50 hover:text-wine hover:border-gold transition-colors">
                          {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-wine/40 mb-4 leading-relaxed">
                      After making the payment, take a screenshot and upload it below.
                    </p>

                    {/* File upload */}
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-beige rounded-xl p-6 text-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all mb-4"
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check size={18} className="text-green-500" />
                          <span className="text-sm text-wine/70 truncate max-w-[200px]">{file.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="text-wine/30 hover:text-red-500 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-wine/30 mx-auto mb-2" />
                          <p className="text-sm text-wine/50">Click to upload payment screenshot</p>
                          <p className="text-xs text-wine/30 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-3">
                      <button type="button" onClick={() => setStep('payment')}
                        className="flex-1 py-3 rounded-xl border border-beige text-wine/60 font-medium text-sm hover:bg-ivory transition-all">← Back</button>
                      <button type="submit" disabled={submitting}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60 shadow-lg shadow-wine/20 flex items-center justify-center gap-2">
                        {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Enquiry'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-wine mb-2">Enquiry Submitted!</h3>
                    <p className="text-wine/60 text-sm mb-4">
                      Thank you, {form.name.split(' ')[0]}! Your enquiry and payment details have been received. We&apos;ll confirm your registration within 24 hours.
                    </p>
                    <p className="text-xs text-wine/40 mb-6">Reference: <strong className="text-wine">{reference}</strong></p>
                    <button onClick={dismiss} className="px-8 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-wine/20">Done</button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
