"use client";

import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingBag, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import MagneticButton from "@/components/animations/MagneticButton";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.replace("/shop");
    }
  }, [orderId, router]);

  if (!orderId) return null;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-8 shadow-lg shadow-green-200"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-serif text-3xl md:text-4xl font-bold text-gradient-wine-purple mb-3"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-wine/60 mb-2"
        >
          Thank you for your purchase.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-light border border-wine/10 mb-8"
        >
          <Package className="w-4 h-4 text-wine/50" />
          <span className="text-sm font-medium text-wine">Order: <span className="font-mono">{orderId}</span></span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-sm text-wine/50 mb-10 max-w-sm mx-auto"
        >
          You will receive an email confirmation with your order details and tracking information once your order ships.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton>
            <Link
              href={`/shop/orders`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg shadow-wine/20 hover:shadow-xl transition-all"
            >
              <Package className="w-4 h-4" />
              View Order Details
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-wine/20 text-wine font-medium text-sm hover:bg-wine/5 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-wine border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
