'use client';

import { useState, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, Wallet, CreditCard, Smartphone, Loader2, Copy, CheckCheck, Upload, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice?: string;
}

type PaymentMethod = 'gpay' | 'phonpe' | 'alipay' | 'fps' | null;
type Step = 'details' | 'payment' | 'upload' | 'success';

const methodIcons: Record<string, React.ReactNode> = {
  gpay: <Smartphone className="w-6 h-6 text-blue-500" />,
  phonpe: <Smartphone className="w-6 h-6 text-purple-500" />,
  alipay: <Wallet className="w-6 h-6 text-blue-500" />,
  fps: <CreditCard className="w-6 h-6 text-green-500" />,
};

const methodColors: Record<string, string> = {
  gpay: 'bg-blue-50 group-hover:bg-blue-100',
  phonpe: 'bg-purple-50 group-hover:bg-purple-100',
  alipay: 'bg-blue-50 group-hover:bg-blue-100',
  fps: 'bg-green-50 group-hover:bg-green-100',
};

const methodLabels: Record<string, string> = {
  gpay: 'Google Pay',
  phonpe: 'PhonePe',
  alipay: 'Alipay',
  fps: 'FPS',
};

const methodDescs: Record<string, string> = {
  gpay: 'Pay with GPay QR code',
  phonpe: 'Pay with PhonePe QR code',
  alipay: 'Pay with Alipay QR code',
  fps: 'Pay with Faster Payment System',
};

const qrImages: Record<string, string> = {
  gpay: '/images/gpay.png',
  phonpe: '/images/phonpe.png',
  alipay: '/images/alipay-qr.png',
  fps: '/images/fps-qr.png',
};

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  planPrice,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>('details');
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference] = useState(
    () => `MY${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  const reset = () => {
    setStep('details');
    setMethod(null);
    setCopied(false);
    setSubmitting(false);
    setFile(null);
    setForm({ name: '', email: '', phone: '', message: '' });
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
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
      fd.set('plan', planName);
      fd.set('paymentMethod', method);
      fd.set('reference', reference);
      fd.set('message', form.message);
      if (file) fd.set('screenshot', file);
      const res = await fetch('/api/payments', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Submission failed');
      setStep('success');
    } catch {
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-beige">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-wine to-purple flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-wine">
                      {step === 'success' ? 'Submission Received!' : 'Complete Your Registration'}
                    </h2>
                    <p className="text-wine/50 text-sm mt-0.5">{planName}{planPrice ? ` — ${planPrice}` : ''}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
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
                      Please fill in your details to continue with the registration.
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
                          placeholder="Any questions or special requests..." rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none" />
                      </div>
                      <button onClick={() => { if (validateDetails()) setStep('payment'); }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-wine/20">
                        Next — Choose Payment
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="text-wine/60 text-sm mb-6">Select your payment method.</p>
                    <div className="space-y-3">
                      {(['gpay', 'phonpe', 'alipay', 'fps'] as const).map((m) => (
                        <button key={m} onClick={() => { setMethod(m); setStep('upload'); }}
                          className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group">
                          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-colors', methodColors[m])}>
                            {methodIcons[m]}
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-semibold text-wine">{methodLabels[m]}</p>
                            <p className="text-xs text-wine/50">{methodDescs[m]}</p>
                          </div>
                          <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setStep('details')} className="mt-4 text-sm text-wine/50 hover:text-wine transition-colors">← Back to details</button>
                  </motion.div>
                )}

                {step === 'upload' && method && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    {errors.submit && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4">{errors.submit}</div>
                    )}

                    {/* QR */}
                    <div className="text-center mb-4">
                      <div className="relative w-40 h-40 mx-auto rounded-xl border-2 border-beige p-2 overflow-hidden bg-white">
                        <Image src={qrImages[method]} alt={`${methodLabels[method]} QR`} fill className="object-contain p-1" />
                      </div>
                      <p className="text-wine font-semibold text-sm mt-2">Scan & Pay via {methodLabels[method]}</p>
                      {planPrice && <p className="text-wine/50 text-xs">Amount: {planPrice}</p>}
                    </div>

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
                    <div onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-beige rounded-xl p-6 text-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all mb-4">
                      <input ref={fileRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)} />
                      {file ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check size={18} className="text-green-500" />
                          <span className="text-sm text-wine/70 truncate max-w-[200px]">{file.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="text-wine/30 hover:text-red-500 transition-colors"><X size={16} /></button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-wine/30 mx-auto mb-2" />
                          <p className="text-sm text-wine/50">Click to upload payment screenshot</p>
                          <p className="text-xs text-wine/30 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSubmit}>
                      <button type="submit" disabled={submitting}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60 shadow-lg shadow-wine/20 flex items-center justify-center gap-2">
                        {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Submit & Complete Registration'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-wine mb-2">Submission Received!</h3>
                    <p className="text-wine/60 text-sm mb-6">
                      Thank you, {form.name.split(' ')[0]}! Your payment for <strong>{planName}</strong> has been submitted for verification. We&apos;ll confirm your registration within 24 hours.
                    </p>
                    <p className="text-xs text-wine/40 mb-6">Reference: <strong className="text-wine">{reference}</strong></p>
                    <button onClick={handleClose}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-wine/20">Done</button>
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
