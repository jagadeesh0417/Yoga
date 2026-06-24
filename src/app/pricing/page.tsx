'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Sparkles,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { classPackages, membershipPlans, faqs } from '@/lib/data';
import { cn, whatsappLink, bookConsultationLink } from '@/lib/utils';
import SectionTitle from '@/components/SectionTitle';
import PaymentModal from '@/components/sections/PaymentModal';
import ResponsiveImage from '@/components/ResponsiveImage';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const tierConfig: Record<string, { gradient: string; border: string }> = {
  Silver: {
    gradient: 'from-slate-300/20 to-slate-400/10',
    border: 'border-slate-400/20',
  },
  Gold: {
    gradient: 'from-gold/20 to-gold/10',
    border: 'border-gold/30',
  },
  Platinum: {
    gradient: 'from-purple-400/20 to-indigo-400/10',
    border: 'border-purple-400/20',
  },
  Elite: {
    gradient: 'from-wine/20 to-gold/10',
    border: 'border-wine/30',
  },
};

const pricingFaqs = faqs.filter((faq) =>
  ['Classes', 'Membership', 'Booking'].includes(faq.category)
);

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-wine/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
      >
        <span className="font-serif text-lg md:text-xl font-semibold text-wine group-hover:text-wine transition-colors duration-300 pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full bg-wine/5 flex items-center justify-center flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-wine" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 md:pb-6 text-wine/60 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    plan: string;
    price?: string;
  }>({ open: false, plan: "" });

  return (
    <>
      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, plan: "" })}
        planName={paymentModal.plan}
        planPrice={paymentModal.price}
      />
      <main>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] animate-mandala" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ivory/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-wine/60 via-transparent to-wine/30" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gold text-sm tracking-widest uppercase mb-6">
              <Sparkles size={14} />
              Investment in You
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-ivory leading-tight"
          >
            Investment in Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold">
              Wellness
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 text-lg md:text-xl text-ivory/70 max-w-2xl mx-auto leading-relaxed"
          >
            Choose from our flexible class packages and membership plans
            designed to support your wellness journey.
          </motion.p>
        </div>
      </section>

      <section className="gradient-primary pb-20 md:pb-28 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Group Classes & Pricing"
            subtitle="Choose Your Wellness Journey"
            light
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {classPackages.map((pkg) => (
              <motion.div
                key={pkg.name}
                variants={cardVariants}
                whileHover={{
                  y: pkg.popular ? -10 : -6,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
                className={cn(
                  'relative flex flex-col bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500',
                  pkg.popular && 'lg:scale-105 border-gold/40 shadow-gold',
                  pkg.bestValue && 'border-wine/40'
                )}
              >
                {(pkg.popular || pkg.bestValue) && (
                  <div
                    className={cn(
                      'absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider z-20',
                      pkg.popular && 'bg-gold text-wine',
                      pkg.bestValue && 'bg-gradient-to-r from-wine to-purple text-white'
                    )}
                  >
                    {pkg.popular ? 'Popular' : 'Best Value'}
                  </div>
                )}

                {(pkg as any).image && (
                  <div className="relative overflow-hidden">
                    <ResponsiveImage src={(pkg as any).image} alt={pkg.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="p-6 md:p-8 pt-4">
                <div className="mb-6">
                  <h3 className="font-serif text-xl font-bold text-ivory mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-ivory/50 text-sm">{pkg.duration}</p>
                </div>

                <div className="mb-6">
                  <span className="text-ivory/40 text-lg font-medium align-top">
                    {pkg.currency}
                  </span>
                  <span className="font-serif text-5xl md:text-6xl font-bold text-ivory mx-1">
                    {pkg.price.toLocaleString()}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-ivory/70"
                    >
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 mt-auto">
                  <button
                    onClick={() =>
                      setPaymentModal({
                        open: true,
                        plan: pkg.name,
                        price: `${pkg.currency} ${pkg.price.toLocaleString()}`,
                      })
                    }
                    className={cn(
                      'w-full py-3 rounded-xl font-medium text-sm transition-all duration-300',
                      pkg.popular
                        ? 'bg-gold text-wine hover:bg-gold/90 shadow-lg shadow-gold/20'
                        : 'bg-white/10 text-ivory hover:bg-white/20 border border-white/10'
                    )}
                  >
                    Book Now
                  </button>
                  <div className="flex gap-2">
                    <Link
                      href="/contact"
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-ivory/70 border border-white/10 hover:bg-white/10 hover:text-ivory transition-all duration-300 text-center"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="gradient-primary py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Membership Plans"
            subtitle="Choose the plan that fits your lifestyle and goals"
            light
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {membershipPlans.map((plan) => {
              const config = tierConfig[plan.type] || tierConfig.Silver;
              return (
                <motion.div
                  key={plan.name}
                  variants={cardVariants}
                  whileHover={{
                    y: plan.popular ? -10 : -6,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  className={cn(
                    'relative flex flex-col rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500',
                    'backdrop-blur-xl bg-white/5 border',
                    config.border,
                    plan.popular && 'lg:scale-105 shadow-gold/10'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-wine text-xs font-semibold uppercase tracking-wider z-10">
                      Popular
                    </div>
                  )}

                  {('image' in plan) && (plan as any).image && (
                    <div className="-mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6">
                      <ResponsiveImage
                        src={(plan as any).image}
                        alt={plan.name}
                      />
                    </div>
                  )}

                  <h3 className="font-serif text-xl font-bold text-ivory mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-ivory/40 text-sm mb-5">{plan.type}</p>

                  <div className="mb-6">
                    <span className="text-ivory/40 text-lg font-medium align-top">
                      {plan.currency === 'USD' ? '$' : plan.currency}
                    </span>
                    <span className="font-serif text-5xl md:text-6xl font-bold text-ivory mx-1">
                      {plan.price}
                    </span>
                    <span className="text-ivory/40 text-sm ml-1">
                      /{plan.period.toLowerCase()}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-ivory/65"
                      >
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-gold" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3 mt-auto">
                    <button
                      onClick={() =>
                        setPaymentModal({
                          open: true,
                          plan: plan.name,
                          price: `$${plan.price}/${plan.period.toLowerCase()}`,
                        })
                      }
                      className={cn(
                        'w-full py-3 rounded-xl font-medium text-sm transition-all duration-300',
                        plan.popular
                          ? 'bg-gold text-wine hover:bg-gold/90 shadow-lg shadow-gold/20'
                          : 'bg-white/10 text-ivory hover:bg-white/20 border border-white/10'
                      )}
                    >
                      Join Now
                    </button>
                    <button className="w-full py-2.5 rounded-xl text-sm font-medium text-ivory/50 border border-white/10 hover:bg-white/10 hover:text-ivory/70 transition-all duration-300">
                      Contact
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 gradient-rose overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-wine/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our classes, memberships, and bookings"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            {pricingFaqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === faq.question}
                onToggle={() =>
                  setOpenFaq(openFaq === faq.question ? null : faq.question)
                }
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-36 overflow-hidden gradient-primary">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center bg-no-repeat bg-cover opacity-[0.03] animate-mandala" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-ivory/5 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-ivory/80 text-xs font-medium mb-8">
              <Sparkles size={14} className="text-gold" />
              Begin Your Journey
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-ivory leading-tight"
          >
            Still Have Questions?
            <br />
            <span className="text-gold">We&apos;re Here to Help</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-6 text-ivory/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Not sure which plan is right for you? Schedule a free consultation
            and we will guide you to the perfect choice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={bookConsultationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold hover:bg-gold/90 text-wine font-semibold text-sm transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5"
            >
              Book Free Consultation
              <ArrowRight size={16} />
            </Link>
            <Link
              href={whatsappLink(
                'Hi! I have a question about the pricing and plans at MYSTIC YOGAâ„¢.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-ivory/30 hover:border-ivory/60 text-ivory font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}
