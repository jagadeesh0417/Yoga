"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Calendar, Clock, User, Phone, Mail, MapPin, MessageSquare, ArrowLeft, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | null;
  duration: string | null;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM",
];

const steps = ["Select Service", "Choose Date & Time", "Your Details", "Confirmation"];

export default function BookPage() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(setServices).catch(() => {});
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !form.name || !form.email || !form.phone || !form.country) {
      setError("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selectedService.id, ...form, date: selectedDate, time: selectedTime }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to book");
      }
      setSubmitted(true);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-wine mb-4">Booking Confirmed! ðŸ™</h1>
          <p className="text-wine/60 text-lg mb-2">Thank you, <strong>{form.name}</strong>!</p>
          <p className="text-wine/50 mb-8">Your <strong>{selectedService?.title}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been received. We will confirm shortly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/85244644381" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white font-semibold text-sm transition-all hover:brightness-110 shadow-lg">
              <MessageSquare size={18} />
              Chat on WhatsApp
            </a>
            <a href="/" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gold text-wine font-semibold text-sm transition-all hover:brightness-110 shadow-lg">
              Return Home
            </a>
          </div>
          <div className="mt-8 p-4 rounded-xl bg-wine/5 border border-wine/10 text-xs text-wine/40">
            A confirmation email has been sent to {form.email}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <section className="relative py-20 md:py-28 overflow-hidden gradient-gold">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #7A3045 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-wine">Book Your Session</h1>
          <p className="mt-4 text-wine/60 text-lg max-w-2xl mx-auto">Begin your transformative journey with MYSTIC YOGAâ„¢. Select a service and reserve your slot.</p>
        </div>
      </section>

      <section className="relative -mt-10 z-10 max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
          {/* Steps */}
          <div className="flex border-b border-wine/5">
            {steps.map((s, i) => (
              <div key={i} className={`flex-1 py-4 text-center text-xs font-semibold tracking-wider uppercase transition-colors $              {i === step ? "bg-wine/5 text-gradient-wine-purple border-b-2 border-wine" : i < step ? "text-green-500" : "text-wine/30"}`}>
                {i < step ? "âœ“ " : ""}{s}
              </div>
            ))}
          </div>

          <div className="p-6 md:p-10">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
            )}

            {/* Step 0: Select Service */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <SectionTitle title="Choose Your Service" subtitle="Select the type of session you'd like to book" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <motion.button
                      key={service.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setSelectedService(service); setStep(1); }}
                      className={`text-left p-5 rounded-xl border-2 transition-all ${selectedService?.id === service.id ? "border-gold bg-gold/5" : "border-wine/10 hover:border-gold/30 bg-white"}`}
                    >
                      <h3 className="font-serif text-lg font-bold text-wine mb-1">{service.title}</h3>
                      <p className="text-wine/50 text-sm line-clamp-2 mb-3">{service.description}</p>
                      <div className="flex items-center justify-between">
                        {service.price ? <span className="text-gradient-wine-purple font-bold">${service.price}</span> : <span />}
                        <span className="text-xs text-wine/40 flex items-center gap-1"><Clock size={12} /> {service.duration || "TBD"}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-wine/50 hover:text-wine mb-6 transition-colors">
                  <ArrowLeft size={14} /> Back to services
                </button>
                <SectionTitle title="Select Date & Time" subtitle={`Choose your preferred slot for ${selectedService?.title}`} />
                <div className="mb-6">
                  <label className="block text-sm font-medium text-wine/80 mb-2">Date</label>
                  <input type="date" value={selectedDate} min={minDateStr} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-wine/20 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-wine/80 mb-2">Time</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((t) => (
                      <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all border ${selectedTime === t ? "bg-gradient-to-r from-wine to-purple text-white border-wine" : "bg-ivory text-wine/60 border-wine/10 hover:border-gold/30"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                  className="mt-8 w-full py-3.5 rounded-full bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue to Details
                </button>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-wine/50 hover:text-wine mb-6 transition-colors">
                  <ArrowLeft size={14} /> Back to time selection
                </button>
                <SectionTitle title="Your Details" subtitle="We'll send your confirmation to this information" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="w-full pl-10 pr-4 py-3 rounded-xl border border-wine/20 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-wine/20 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">Phone Number *</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+852 4464 4381" className="w-full pl-10 pr-4 py-3 rounded-xl border border-wine/20 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-wine/80 mb-1.5">Country *</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
                        <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Your country" className="w-full pl-10 pr-4 py-3 rounded-xl border border-wine/20 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wine/80 mb-1.5">Notes (Optional)</label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any special requests or information..." className="w-full px-4 py-3 rounded-xl border border-wine/20 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm resize-none" />
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/20 text-sm text-wine/60">
                  <p className="font-medium text-wine mb-1">Booking Summary</p>
                  <p>{selectedService?.title} â€” {selectedDate} at {selectedTime}</p>
                  {selectedService?.price && <p className="text-gradient-wine-purple font-semibold mt-1">${selectedService.price}</p>}
                </div>
                <button
                  disabled={submitting || !form.name || !form.email || !form.phone || !form.country}
                  onClick={handleSubmit}
                  className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-wine to-purple text-white font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {submitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
