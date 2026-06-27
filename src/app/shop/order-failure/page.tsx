"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { XCircle, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MagneticButton from "@/components/animations/MagneticButton";
import { WHATSAPP_NUMBER } from "@/lib/constants";

function OrderFailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center mb-8 shadow-lg shadow-red-200"
        >
          <XCircle className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-serif text-3xl md:text-4xl font-bold text-gradient-wine-purple mb-3"
        >
          Payment {reason === "cancelled" ? "Cancelled" : "Failed"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-wine/60 mb-8 max-w-sm mx-auto"
        >
          {reason === "cancelled"
            ? "You cancelled the payment. Your order has not been processed."
            : "We were unable to process your payment. Please try again or contact support."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg shadow-wine/20 hover:shadow-xl transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Try Again
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Help%20with%20payment%20issue`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-wine/20 text-wine font-medium text-sm hover:bg-wine/5 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </main>
  );
}

export default function OrderFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-wine border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderFailureContent />
    </Suspense>
  );
}
