"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { classPackages } from "@/lib/data";
import { cn, whatsappLink } from "@/lib/utils";
import PaymentModal from "@/components/sections/PaymentModal";
import ResponsiveImage from "@/components/ResponsiveImage";

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

const gradientPlaceholders = [
  "bg-gradient-to-br from-wine/40 to-gold/30",
  "bg-gradient-to-br from-gold/30 to-wine/40",
  "bg-gradient-to-br from-wine/50 to-gold/20",
  "bg-gradient-to-br from-gold/20 to-wine/50",
];

export default function PricingCards() {
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
      <section id="pricing" className="bg-rose-light py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Group Classes & Pricing"
          subtitle="Choose Your Wellness Journey"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {classPackages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              variants={cardVariants}
              whileHover={{
                y: pkg.popular ? -10 : -6,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className={cn(
                "pricing-card group relative flex flex-col bg-rose backdrop-blur-xl border border-wine/10 rounded-[20px] shadow-lg hover:shadow-2xl transition-all duration-500",
                pkg.popular && "lg:scale-105 border-wine/40 shadow-wine/20",
                pkg.bestValue && "border-purple/40"
              )}
            >
              {(pkg.popular || pkg.bestValue) && (
                <div
                  className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider z-20 whitespace-nowrap",
                    pkg.popular && "bg-gold text-wine",
                    pkg.bestValue && "bg-purple text-white"
                  )}
                >
                  {pkg.popular ? "Popular" : "Best Value"}
                </div>
              )}

              <div className="w-full overflow-hidden rounded-t-[20px]">
                {pkg.image ? (
                  <ResponsiveImage
                    src={pkg.image}
                    alt={pkg.name}
                    aspectRatio="aspect-[4/3]"
                    containerClassName="group-hover:scale-[1.03] transition-transform duration-[0.4s] ease-[ease] will-change-transform rounded-t-[20px]"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-full aspect-[4/3] flex items-center justify-center",
                      gradientPlaceholders[idx % gradientPlaceholders.length]
                    )}
                  >
                    <div className="text-center px-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-wine/5 backdrop-blur-md border border-wine/15 flex items-center justify-center mb-3">
                        <span className="font-serif text-2xl text-wine/80 font-bold">
                          {pkg.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-wine/50 text-xs uppercase tracking-widest font-medium">
                        {pkg.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pricing-content flex flex-col flex-grow p-5 md:p-6 lg:p-7">
                <div className="mb-4">
                  <h3 className="font-serif text-xl font-bold text-wine mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-wine/50 text-sm">{pkg.duration}</p>
                </div>

                <div className="mb-5">
                  <span className="text-wine/40 text-lg font-medium align-top">
                    {pkg.currency}
                  </span>
                  <span className="font-serif text-4xl md:text-5xl font-bold text-gold mx-1">
                    {pkg.price.toLocaleString()}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-wine/70">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pricing-button space-y-3 mt-auto">
                  <button
                    onClick={() =>
                      setPaymentModal({
                        open: true,
                        plan: pkg.name,
                        price: `${pkg.currency} ${pkg.price.toLocaleString()}`,
                      })
                    }
                    className={cn(
                      "w-full py-3 rounded-xl font-medium text-sm transition-all duration-300",
                      pkg.popular
                        ? "bg-gradient-to-r from-wine to-purple text-white shadow-lg shadow-wine/20"
                        : "border border-wine text-wine hover:bg-wine/5"
                    )}
                  >
                    Book Now
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 rounded-xl text-sm font-medium text-wine/70 border border-wine/10 hover:bg-wine/5 hover:text-wine transition-all duration-300">
                      Contact
                    </button>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl border border-wine/10 text-wine/70 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30 transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
    </>
  );
}
