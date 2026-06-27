"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Loader2, Minus, Plus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { shopApi } from "@/lib/shop-api";
import type { ShopProduct } from "@/components/shop/ProductCard";
import MagneticButton from "@/components/animations/MagneticButton";
import Link from "next/link";

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialForm: FormState = {
  name: "", phone: "", email: "", address: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required";
  if (!form.phone.trim()) errors.phone = "Mobile number is required";
  else if (!/^[\d\s\-+()]{7,20}$/.test(form.phone)) errors.phone = "Invalid phone number";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email format";
  if (!form.address.trim()) errors.address = "Shipping address is required";
  return errors;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");
  const quantityParam = parseInt(searchParams.get("quantity") || "1", 10);

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [quantity, setQuantity] = useState(quantityParam);

  useEffect(() => {
    if (!productParam) {
      setError("No product specified.");
      setLoading(false);
      return;
    }
    shopApi.getProduct(productParam).then((res) => {
      const p = res.product;
      if (!p) { setError("Product not found."); setLoading(false); return; }
      setProduct(p);
      setLoading(false);
    }).catch(() => {
      setError("Product not found.");
      setLoading(false);
    });
  }, [productParam]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!product) return;
    setSubmitting(true);

    try {
      const razorpayReady = await loadRazorpay();
      if (!razorpayReady) {
        setGeneralError("Failed to load payment gateway. Please try again.");
        setSubmitting(false);
        return;
      }

      const orderRes = await shopApi.createBuyNowOrder({
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || "",
        price: product.price,
        quantity,
        currency: product.currency || "HKD",
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
        },
      });

      if (!orderRes.success) {
        setGeneralError("Failed to create order. Please try again.");
        setSubmitting(false);
        return;
      }

      const order = orderRes.order;
      const razorpayOrderId = orderRes.razorpay_order_id;
      const totalAmount = product.price * quantity;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx",
        amount: orderRes.amount || totalAmount * 100,
        currency: orderRes.currency || "HKD",
        name: "MYSTIC YOGA",
        description: `Order ${order?.orderId || ""}`,
        order_id: razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#8B1E3F" },
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            await shopApi.verifyBuyNowPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            router.push(`/shop/order-success?orderId=${encodeURIComponent(order?.orderId || response.razorpay_order_id)}`);
          } catch {
            router.push(`/shop/order-failure?reason=verification_failed`);
          }
        },
        modal: {
          ondismiss: () => {
            router.push(`/shop/order-failure?reason=cancelled`);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function () {
        router.push(`/shop/order-failure?reason=failed`);
      });

      rzp.open();
    } catch {
      setGeneralError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          <div className="h-8 w-48 bg-wine/10 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-4">
              <div className="h-64 bg-wine/5 rounded-2xl" />
            </div>
            <div className="lg:col-span-2 h-48 bg-wine/5 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-wine/30" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-wine mb-3">Product Not Found</h1>
          <p className="text-wine/60 mb-8">{error || "The requested product does not exist."}</p>
          <MagneticButton>
            <Link href="/shop" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg">
              Back to Shop
            </Link>
          </MagneticButton>
        </div>
      </main>
    );
  }

  const total = product.price * quantity;
  const discount = product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-wine/50 hover:text-wine transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Shop
        </Link>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple mb-8">Checkout</h1>

        {generalError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 text-red-500 text-sm border border-red-100">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-wine/5">
                <h2 className="font-serif text-lg font-bold text-wine mb-6">Customer Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Product</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-wine/5 border border-wine/10">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-wine/10 shrink-0">
                        {product.images?.[0] && (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-wine">{product.name}</p>
                        <p className="text-xs text-wine/50">{product.currency || "HKD"} {product.price} each</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                    <input
                      type="text" value={form.name} placeholder="John Doe"
                      onChange={(e) => updateField("name", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40 transition-colors ${errors.name ? "border-red-300" : "border-wine/10"}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Mobile Number *</label>
                    <input
                      type="tel" value={form.phone} placeholder="+1 234 567 8900"
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40 transition-colors ${errors.phone ? "border-red-300" : "border-wine/10"}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Email Address *</label>
                    <input
                      type="email" value={form.email} placeholder="john@example.com"
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40 transition-colors ${errors.email ? "border-red-300" : "border-wine/10"}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Shipping Address *</label>
                    <textarea
                      value={form.address} placeholder="123 Wellness Street, Apt 4B, New York, NY 10001"
                      onChange={(e) => updateField("address", e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40 transition-colors resize-none ${errors.address ? "border-red-300" : "border-wine/10"}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Quantity</label>
                    <div className="flex items-center border border-wine/20 rounded-xl w-fit overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-wine hover:bg-wine/5 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-medium text-wine">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center text-wine hover:bg-wine/5 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-wine/5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-wine" />
                  <h2 className="font-serif text-lg font-bold text-wine">Payment</h2>
                </div>
                <p className="text-sm text-wine/60">Pay securely via Razorpay (Credit/Debit Card, UPI, Net Banking, Wallet)</p>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-wine/5 sticky top-24">
                <h2 className="font-serif text-lg font-bold text-wine mb-4">Order Summary</h2>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-wine/10">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-wine/5 shrink-0">
                    {product.images?.[0] && (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-wine">{product.name}</p>
                    <p className="text-xs text-wine/50">Qty: {quantity}</p>
                    {discount > 0 && (
                      <p className="text-xs text-green-600">-{discount}% off</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-wine">{product.currency || "HKD"} {total}</p>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-wine/60">Subtotal</span>
                    <span className="font-medium text-wine">{product.currency || "HKD"} {total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-wine/60">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-wine/10 mb-6">
                  <span className="font-serif text-lg font-bold text-wine">Total</span>
                  <span className="font-serif text-2xl font-bold text-gradient-wine-purple">{product.currency || "HKD"} {total}</span>
                </div>

                <MagneticButton>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg shadow-wine/20 hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Pay Now — {product.currency || "HKD"} {total}
                      </>
                    )}
                  </button>
                </MagneticButton>

                <p className="text-[10px] text-wine/30 text-center mt-4">Secure checkout powered by Razorpay</p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-wine border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
