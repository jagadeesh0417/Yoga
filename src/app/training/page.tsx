'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Monitor,
  ClipboardCheck,
  ScrollText,
  Users,
  TrendingUp,
  ArrowRight,
  Download,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Star,
  Globe,
  Clock,
  Send,
} from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import GlassCard from '@/components/animations/GlassCard';
import { cn } from '@/lib/utils';
import PaymentModal from '@/components/sections/PaymentModal';

const features = [
  { icon: Award, title: 'International Curriculum', desc: 'Globally recognized comprehensive training syllabus' },
  { icon: Monitor, title: 'Live Online Training', desc: 'Interactive real-time sessions with expert instructors' },
  { icon: ClipboardCheck, title: 'Practical Assessments', desc: 'Hands-on teaching practice and evaluations' },
  { icon: ScrollText, title: 'Certification', desc: 'Internationally accredited yoga teacher certificate' },
  { icon: Users, title: 'Lifetime Community Access', desc: 'Join our global network of certified instructors' },
  { icon: TrendingUp, title: 'Business Growth Guidance', desc: 'Launch and scale your yoga teaching career' },
];

const timeline = [
  { period: 'Month 1', title: 'Foundations', items: ['Yoga Philosophy & History', 'Anatomy & Physiology', 'Basic Asana Alignment', 'Pranayama Fundamentals'] },
  { period: 'Month 2', title: 'Intermediate', items: ['Advanced Asana Practice', 'Teaching Methodology', 'Sequencing & Adjustments', 'Meditation Techniques'] },
  { period: 'Month 3', title: 'Mastery', items: ['Specialized Modules', 'Practice Teaching', 'Final Assessments', 'Graduation & Certification'] },
];

const pricingPlans = [
  { name: 'Standard', price: 2499, currency: 'USD', features: ['Full 200-Hour Curriculum', 'Live Online Classes', 'Study Materials', 'Practice Sessions', 'Certificate of Completion'], popular: false },
  { name: 'Premium', price: 3499, currency: 'USD', features: ['Everything in Standard', '1-on-1 Mentorship', 'Business Coaching', 'Lifetime Community Access', 'Resume & Portfolio Building', 'Job Placement Assistance'], popular: true },
  { name: 'Elite', price: 4999, currency: 'USD', features: ['Everything in Premium', 'In-Person Retreat Module', 'Personal Brand Strategy', 'Marketing Toolkit', 'Website & Booking Setup', 'Ongoing Business Support'], popular: false },
];

const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Certified Teacher'];

interface FormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  experience?: string;
  message?: string;
}

const inputClasses =
  'w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-ivory text-sm placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300';

const inputErrorClasses = 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20';

export default function TrainingPage() {
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    plan: string;
    price?: string;
  }>({ open: false, plan: "" });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number>(1);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.experience.trim()) newErrors.experience = 'Please select your experience level';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
      setFormData({ name: '', email: '', phone: '', experience: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
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

  return (
    <>
      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, plan: "" })}
        planName={paymentModal.plan}
        planPrice={paymentModal.price}
      />
      <section className="relative py-28 md:py-36 overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 70%, #D4A373 1px, transparent 1px), radial-gradient(circle at 70% 20%, #7A3045 1px, transparent 1px)',
              backgroundSize: '60px 60px, 50px 50px',
            }}
          />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-wine/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory tracking-tight"
          >
            International Yoga Teacher Training
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 text-lg md:text-xl text-ivory/70 max-w-3xl mx-auto leading-relaxed"
          >
            Embark on a transformative journey to become an internationally certified yoga instructor
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
              'radial-gradient(circle at 25% 75%, #7A3045 1px, transparent 1px), radial-gradient(circle at 75% 25%, #D4A373 1px, transparent 1px)',
            backgroundSize: '60px 60px, 40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <div className="space-y-6">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-wine leading-tight">
                  Become a Certified Yoga Instructor
                </h3>
                <div className="space-y-4 text-wine/70 leading-relaxed">
                  <p>
                    Our 200-hour internationally certified Yoga Teacher Training program combines
                    ancient yogic wisdom with modern anatomical science, preparing you to teach with
                    confidence, authenticity, and professionalism.
                  </p>
                  <p>
                    Whether you dream of leading classes in prestigious studios, hosting luxury
                    retreats worldwide, or building your own wellness empire, this program provides
                    the comprehensive knowledge, practical skills, and globally recognized
                    certification you need to succeed.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    { icon: BookOpen, label: '200+ Hours', sub: 'Comprehensive curriculum' },
                    { icon: Globe, label: 'Globally Recognized', sub: 'International certification' },
                    { icon: Clock, label: 'Flexible Schedule', sub: 'Self-paced learning' },
                    { icon: Star, label: 'Expert Mentors', sub: 'Industry-leading instructors' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-white shadow-sm"
                    >
                      <stat.icon size={20} className="text-wine mb-2" />
                      <p className="text-wine font-semibold text-sm">{stat.label}</p>
                      <p className="text-wine/40 text-xs">{stat.sub}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="space-y-4"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group flex items-start gap-4 p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:border-wine/20 transition-all duration-300"
                >
                  <div className="shrink-0 w-11 h-11 rounded-lg bg-wine/10 flex items-center justify-center group-hover:bg-wine/20 transition-colors duration-300">
                    <feature.icon size={20} className="text-wine" />
                  </div>
                  <div>
                    <p className="text-wine font-semibold text-sm">{feature.title}</p>
                    <p className="text-wine/50 text-xs mt-0.5">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #D4A373 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="absolute top-0 left-0 w-96 h-96 bg-wine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Program Structure"
            subtitle="A comprehensive 12-week journey divided into three progressive phases"
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeline.map((phase, i) => (
              <GlassCard key={phase.period} delay={i * 0.15}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <Calendar size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-ivory/50 text-xs font-medium uppercase tracking-wider">{phase.period}</p>
                      <p className="text-ivory font-semibold">{phase.title}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-ivory/70 text-sm">
                        <CheckCircle size={14} className="text-gold shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden gradient-rose">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, #7A3045 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Choose Your Path"
            subtitle="Select the training package that aligns with your goals"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setSelectedPlan(i)}
                className={cn(
                  'relative p-6 md:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300',
                  selectedPlan === i
                    ? 'border-wine bg-white shadow-xl shadow-wine/10'
                    : 'border-white/50 bg-white/60 shadow-sm hover:shadow-md hover:border-wine/20',
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-wine to-purple text-white text-xs font-semibold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-serif text-xl font-bold text-gradient-wine-purple">{plan.name}</h3>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gradient-wine-purple">${plan.price}</span>
                    <span className="text-wine/40 text-sm ml-1">USD</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-wine/70 text-sm">
                      <CheckCircle size={14} className="text-wine shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300',
                    selectedPlan === i
                      ? 'bg-gradient-to-r from-wine to-purple text-white shadow-lg shadow-wine/20'
                      : 'bg-wine/5 text-wine hover:bg-wine/10',
                  )}
                >
                  {selectedPlan === i ? 'Selected' : 'Select Plan'}
                </button>
                <button
                  onClick={() =>
                    setPaymentModal({
                      open: true,
                      plan: plan.name,
                      price: `$${plan.price} USD`,
                    })
                  }
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold to-gold-dark text-wine hover:brightness-110 transition-all duration-300 shadow-lg shadow-gold/20 mt-3"
                >
                  Buy Now
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 p-6 md:p-8 rounded-2xl bg-wine/5 border border-wine/10 text-center"
          >
            <Award size={32} className="text-wine mx-auto mb-3" />
            <h4 className="font-serif text-xl font-bold text-wine mb-2">Internationally Accredited Certification</h4>
            <p className="text-wine/60 text-sm max-w-2xl mx-auto leading-relaxed">
              Upon successful completion, you will receive a globally recognized 200-Hour Yoga Teacher
              Training certificate, accredited by the International Yoga Federation. This certification
              qualifies you to teach yoga anywhere in the world.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 70%, #D4A373 1px, transparent 1px), radial-gradient(circle at 70% 30%, #7A3045 1px, transparent 1px)',
              backgroundSize: '60px 60px, 40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            >
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-ivory mb-6">
                Apply for the Program
              </h3>
              <p className="text-ivory/60 leading-relaxed mb-8">
                Take the first step toward your dream career. Fill out the application form and our
                admissions team will get back to you within 24 hours.
              </p>

              <form
                onSubmit={handleSubmit}
                className="p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="train-name" className="text-xs font-semibold text-ivory/50 uppercase tracking-wider">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="train-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={cn(inputClasses, errors.name && inputErrorClasses)}
                    />
                    {errors.name && (
                      <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="train-email" className="text-xs font-semibold text-ivory/50 uppercase tracking-wider">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="train-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={cn(inputClasses, errors.email && inputErrorClasses)}
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="train-phone" className="text-xs font-semibold text-ivory/50 uppercase tracking-wider">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="train-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+852 4464 4381"
                      className={cn(inputClasses, errors.phone && inputErrorClasses)}
                    />
                    {errors.phone && (
                      <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                        <AlertCircle size={12} /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="train-experience" className="text-xs font-semibold text-ivory/50 uppercase tracking-wider">
                      Experience Level <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="train-experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={cn(inputClasses, 'appearance-none cursor-pointer', errors.experience && inputErrorClasses)}
                    >
                      <option value="" disabled className="text-wine">Select your level</option>
                      {experienceLevels.map((l) => (
                        <option key={l} value={l} className="text-wine">{l}</option>
                      ))}
                    </select>
                    {errors.experience && (
                      <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                        <AlertCircle size={12} /> {errors.experience}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="train-message" className="text-xs font-semibold text-ivory/50 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      id="train-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your yoga journey and why you want to join..."
                      className={cn(inputClasses, 'resize-none')}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gold hover:bg-gold/90 disabled:bg-gold/60 text-wine font-semibold text-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Application
                        <Send size={16} />
                      </>
                    )}
                  </button>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-ivory/30 hover:border-ivory/50 text-ivory font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Download size={16} />
                    Download Brochure
                  </a>
                </div>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 px-4 py-3 rounded-xl bg-gold/10 text-gold text-sm font-medium inline-flex items-center gap-2 w-full"
                    >
                      <CheckCircle size={16} />
                      Application submitted! We will contact you within 24 hours.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="space-y-6"
            >
              <GlassCard>
                <div className="p-6 md:p-8">
                  <h4 className="font-serif text-xl font-bold text-ivory mb-4 flex items-center gap-3">
                    <Award size={22} className="text-gold" />
                    Why Train With Us?
                  </h4>
                  <ul className="space-y-4">
                    {[
                      'Internationally recognized certification',
                      'Expert faculty with decades of experience',
                      'Flexible online learning with live sessions',
                      'Comprehensive curriculum covering all aspects of yoga',
                      'Lifetime access to community and resources',
                      'Business development and career guidance',
                    ].map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex items-start gap-3 text-ivory/70 text-sm"
                      >
                        <CheckCircle size={15} className="text-gold shrink-0 mt-0.5" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </GlassCard>

              <GlassCard delay={0.2}>
                <div className="p-6 md:p-8">
                  <h4 className="font-serif text-xl font-bold text-ivory mb-4 flex items-center gap-3">
                    <Globe size={22} className="text-gold" />
                    Certification Details
                  </h4>
                  <div className="space-y-3 text-ivory/70 text-sm leading-relaxed">
                    <p>
                      Upon successful completion of the 200-hour program, you will receive a
                      certification that is internationally recognized and accredited.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {[
                        { label: 'Duration', value: '200 Hours / 12 Weeks' },
                        { label: 'Format', value: 'Live Online + Self-Study' },
                        { label: 'Accreditation', value: 'International Yoga Federation' },
                        { label: 'Language', value: 'English' },
                      ].map((detail) => (
                        <div key={detail.label} className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <p className="text-ivory/40 text-xs uppercase tracking-wider">{detail.label}</p>
                          <p className="text-ivory font-medium text-sm mt-1">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #D4A373 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ivory tracking-tight"
          >
            Ready to Begin Your Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-lg text-ivory/70 max-w-2xl mx-auto leading-relaxed"
          >
            Join a global community of certified yoga instructors and transform your passion into a
            rewarding career.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() =>
                setPaymentModal({
                  open: true,
                  plan: pricingPlans[selectedPlan].name,
                  price: `$${pricingPlans[selectedPlan].price} USD`,
                })
              }
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-gold hover:bg-gold/90 text-wine font-semibold text-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5"
            >
              Apply Now
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('train-name');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full border-2 border-ivory/30 hover:border-ivory/50 text-ivory font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              <Download size={18} />
              Download Brochure
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
