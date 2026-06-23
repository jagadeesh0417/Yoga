'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Wallet,
  CreditCard,
  Smartphone,
  Loader2,
  Copy,
  CheckCheck,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice?: string;
}

type PaymentMethod = 'alipay' | 'fps' | 'gpay' | 'phonpe' | null;

type Step = 'select' | 'qr' | 'form' | 'success';

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  planPrice,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference] = useState(
    () => `MY${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  const reset = () => {
    setStep('select');
    setMethod(null);
    setCopied(false);
    setSubmitting(false);
    setForm({ name: '', email: '', phone: '' });
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectMethod = (m: PaymentMethod) => {
    setMethod(m);
    setStep('qr');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !method) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          plan: planName,
          paymentMethod: method,
          reference,
        }),
      });
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
                <div>
                  <h2 className="font-serif text-xl font-bold text-wine">
                    Complete Payment
                  </h2>
                  <p className="text-wine/50 text-sm mt-0.5">{planName}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-wine/50 hover:text-wine hover:bg-rose transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-6">
                  {(['select', 'qr', 'form'] as const).map((s, i) => {
                    const stepIndex = ['select', 'qr', 'form'].indexOf(step);
                    const isActive = i <= stepIndex;
                    return (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                            isActive
                              ? 'bg-gradient-to-r from-wine to-purple text-white'
                              : 'bg-ivory text-wine/30'
                          )}
                        >
                          {i + 1}
                        </div>
                        {i < 2 && (
                          <div
                            className={cn(
                              'h-0.5 flex-1 transition-colors',
                              i < stepIndex ? 'bg-wine' : 'bg-beige'
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {step === 'select' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-wine/60 text-sm mb-6">
                      Select your preferred payment method
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleSelectMethod('alipay')}
                        className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <Wallet className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-wine">Alipay</p>
                          <p className="text-xs text-wine/50">
                            Pay with Alipay QR code
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleSelectMethod('fps')}
                        className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <CreditCard className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-wine">FPS</p>
                          <p className="text-xs text-wine/50">
                            Pay with Faster Payment System
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleSelectMethod('gpay')}
                        className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <Smartphone className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-wine">Google Pay</p>
                          <p className="text-xs text-wine/50">
                            Pay with GPay QR code
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleSelectMethod('phonpe')}
                        className="w-full p-4 rounded-xl border-2 border-beige hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                          <Smartphone className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-wine">PhonePe</p>
                          <p className="text-xs text-wine/50">
                            Pay with PhonePe QR code
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'qr' && method && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center"
                  >
                    <div className="relative w-48 h-48 mx-auto rounded-xl border-2 border-beige p-2 overflow-hidden bg-white">
                      <Image
                        src={
                          method === 'alipay' ? '/images/alipay-qr.png' :
                          method === 'fps' ? '/images/fps-qr.png' :
                          method === 'gpay' ? '/images/gpay.png' :
                          '/images/phonpe.png'
                        }
                        alt={`${method === 'alipay' ? 'Alipay' : method === 'fps' ? 'FPS' : method === 'gpay' ? 'GPay' : 'PhonePe'} QR Code`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <p className="text-wine font-semibold text-sm mb-1">
                      Scan to Pay via{' '}
                      {method === 'alipay' ? 'Alipay' : method === 'fps' ? 'FPS' : method === 'gpay' ? 'Google Pay' : 'PhonePe'}
                    </p>
                    <p className="text-wine/50 text-xs mb-4">
                      {planPrice && `Amount: ${planPrice}`}
                    </p>

                    <div className="bg-ivory rounded-xl p-4 mb-4 text-left">
                      <p className="text-xs text-wine/50 mb-1">
                        Reference Number
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold text-wine bg-white px-3 py-1.5 rounded-lg border border-beige flex-1 truncate">
                          {reference}
                        </code>
                        <button
                          onClick={() => handleCopy(reference)}
                          className="w-8 h-8 rounded-lg bg-white border border-beige flex items-center justify-center text-wine/50 hover:text-wine hover:border-gold transition-colors"
                        >
                          {copied ? (
                            <CheckCheck size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-wine/40 mb-6 leading-relaxed">
                      After making the payment, please click the button below
                      to submit your details and complete the registration.
                    </p>

                    <button
                      onClick={() => setStep('form')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-wine/20"
                    >
                      I Have Paid — Submit Details
                    </button>
                  </motion.div>
                )}

                {step === 'form' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-wine/60 text-sm mb-6">
                      Please fill in your details to complete the registration.
                    </p>

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
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Your full name"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30',
                            errors.name
                              ? 'border-red-300 bg-red-50'
                              : 'border-beige bg-ivory/50 text-wine placeholder:text-wine/30'
                          )}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-wine/80 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="your@email.com"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30',
                            errors.email
                              ? 'border-red-300 bg-red-50'
                              : 'border-beige bg-ivory/50 text-wine placeholder:text-wine/30'
                          )}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-wine/80 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          placeholder="+852 4464 4381"
                          className="w-full px-4 py-3 rounded-xl border border-beige bg-ivory/50 text-wine placeholder:text-wine/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors"
                        />
                      </div>

                      <div className="bg-ivory rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-wine/50">Plan</span>
                          <span className="font-medium text-wine">
                            {planName}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-wine/50">Payment Method</span>
                          <span className="font-medium text-wine capitalize">
                            {method}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-wine/50">Reference</span>
                          <span className="font-mono text-xs font-medium text-wine">
                            {reference}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60 shadow-lg shadow-wine/20 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-wine mb-2">
                      Submission Received!
                    </h3>
                    <p className="text-wine/60 text-sm mb-6">
                      Thank you, {form.name}! Your payment for{' '}
                      <strong>{planName}</strong> has been submitted for
                      verification. We&apos;ll confirm your registration within
                      24 hours.
                    </p>
                    <p className="text-xs text-wine/40 mb-6">
                      Reference: <strong className="text-wine">{reference}</strong>
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-wine/20"
                    >
                      Done
                    </button>
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
