"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { shopApi } from "@/lib/shop-api";
import MagneticButton from "@/components/animations/MagneticButton";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  stock: number;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: { code: string; discount: number } | null;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    shopApi.getCart().then((res) => {
      setCart(res.cart || res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try {
      const res = await shopApi.updateCartItem(itemId, newQty);
      setCart(res.cart || res);
    } catch { /* ignore */ }
    setUpdatingId(null);
  };

  const handleRemove = async (itemId: string) => {
    try {
      const res = await shopApi.removeCartItem(itemId);
      setCart(res.cart || res);
    } catch { /* ignore */ }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponMsg(null);
    try {
      const res = await shopApi.verifyCoupon(couponCode);
      if (res.valid) {
        const discountVal = res.type === "percentage" ? (cart?.subtotal || 0) * (res.discount / 100) : res.discount;
        setCart((prev) => prev ? { ...prev, discount: discountVal, total: prev.subtotal - discountVal + prev.shipping, coupon: { code: res.code, discount: res.discount } } : prev);
        setCouponMsg({ type: "success", text: `Coupon "${res.code}" applied!` });
      }
    } catch {
      setCouponMsg({ type: "error", text: "Invalid coupon code. Please try again." });
    }
    setApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setCart((prev) => prev ? { ...prev, discount: 0, total: prev.subtotal + prev.shipping, coupon: null } : prev);
    setCouponCode("");
    setCouponMsg(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          <div className="h-8 w-48 bg-wine/10 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-wine/5 rounded-2xl" />
              ))}
            </div>
            <div className="h-64 bg-wine/5 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-24 h-24 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-wine/30" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-wine mb-3">Your Cart is Empty</h1>
            <p className="text-wine/60 mb-8">Looks like you haven&apos;t added anything yet. Explore our premium wellness products.</p>
            <MagneticButton>
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg">
                <ShoppingBag className="w-4 h-4" />
                Browse Shop
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple">Shopping Cart</h1>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-wine/50 hover:text-wine transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="glass-light rounded-2xl p-4 flex items-center gap-4"
              >
                <Link href={`/shop/product/${item.slug}`} className="relative w-20 h-20 rounded-xl overflow-hidden bg-wine/5 shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-wine/30" />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/product/${item.slug}`} className="font-serif text-sm font-bold text-wine hover:text-purple transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-sm font-semibold text-gradient-wine-purple mt-0.5">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-wine/15 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity - 1)}
                      disabled={updatingId === item.id}
                      className="w-8 h-8 flex items-center justify-center text-wine hover:bg-wine/5 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium text-wine">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      disabled={updatingId === item.id || item.quantity >= item.stock}
                      className="w-8 h-8 flex items-center justify-center text-wine hover:bg-wine/5 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-wine w-16 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button onClick={() => handleRemove(item.id)} className="text-wine/30 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-light rounded-2xl p-6 sticky top-24">
              <h2 className="font-serif text-lg font-bold text-wine mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-wine/10">
                <div className="flex justify-between text-sm">
                  <span className="text-wine/60">Subtotal</span>
                  <span className="font-medium text-wine">${(cart?.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-wine/60">Shipping</span>
                  <span className={cn("font-medium", (cart?.shipping || 0) === 0 ? "text-green-600" : "text-wine")}>
                    {(cart?.shipping || 0) === 0 ? "Free" : `$${(cart?.shipping || 0).toFixed(2)}`}
                  </span>
                </div>
                {cart?.coupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({cart.coupon.code})</span>
                    <span className="font-medium text-green-600">-${(cart?.discount || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-serif text-lg font-bold text-wine">Total</span>
                <span className="font-serif text-2xl font-bold text-gradient-wine-purple">
                  ${(cart?.total || 0).toFixed(2)}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-wine/30" />
                    <input
                      type="text" placeholder="Coupon code"
                      value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine to-purple text-white text-xs font-medium disabled:opacity-50 hover:brightness-110 transition-all"
                  >
                    {applyingCoupon ? "..." : "Apply"}
                  </button>
                </div>
                {couponMsg && (
                  <div className={cn("flex items-center justify-between mt-2 text-xs", couponMsg.type === "success" ? "text-green-600" : "text-rose-500")}>
                    <span>{couponMsg.text}</span>
                    {couponMsg.type === "success" && (
                      <button onClick={handleRemoveCoupon} className="hover:underline">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/shop/checkout"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg shadow-wine/20 hover:shadow-xl hover:brightness-110 transition-all"
              >
                Proceed to Checkout
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
