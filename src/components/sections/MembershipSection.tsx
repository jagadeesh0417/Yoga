"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import ResponsiveImage from "@/components/ResponsiveImage";
import { membershipPlans } from "@/lib/data";
import { cn } from "@/lib/utils";
import PaymentModal from "@/components/sections/PaymentModal";

const containerVariants = {
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
    gradient: "from-slate-300/20 to-slate-400/10",
    border: "border-slate-400/20",
  },
  Gold: {
    gradient: "from-gold/20 to-gold/10",
    border: "border-gold/30",
  },
  Platinum: {
    gradient: "from-purple-400/20 to-indigo-400/10",
    border: "border-purple-400/20",
  },
  Elite: {
    gradient: "from-wine/20 to-gold/10",
    border: "border-wine/30",
  },
};

export default function MembershipSection() {
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
      <section className="gradient-primary py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Membership Plans"
          subtitle="Choose the plan that fits your lifestyle and goals"
          light
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
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
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className={cn(
                  "relative flex flex-col rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500",
                  "backdrop-blur-xl bg-white/5 border",
                  config.border,
                  plan.popular && "lg:scale-105 shadow-gold/10"
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
                    {plan.currency === "USD" ? "$" : plan.currency}
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
                    <li key={feature} className="flex items-start gap-3 text-sm text-ivory/65">
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
                      "w-full py-3 rounded-xl font-medium text-sm transition-all duration-300",
                      plan.popular
                        ? "bg-gold text-wine hover:bg-gold/90 shadow-lg shadow-gold/20"
                        : "bg-white/10 text-ivory hover:bg-white/20 border border-white/10"
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
    </>
  );
}
