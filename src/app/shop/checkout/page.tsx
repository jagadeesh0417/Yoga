"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { shopApi } from "@/lib/shop-api";
import type { ShopProduct } from "@/components/shop/ProductCard";
import MagneticButton from "@/components/animations/MagneticButton";

interface FormState {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialForm: FormState = {
  name: "", email: "", phone: "", country: "",
  state: "", city: "", address: "", pincode: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email format";
  if (!form.phone.trim()) errors.phone = "Mobile number is required";
  else if (!/^[\d\s\-+()]{7,20}$/.test(form.phone)) errors.phone = "Invalid phone number";
  if (!form.country.trim()) errors.country = "Country is required";
  if (!form.state.trim()) errors.state = "State is required";
  if (!form.city.trim()) errors.city = "City is required";
  if (!form.address.trim()) errors.address = "Shipping address is required";
  if (!form.pincode.trim()) errors.pincode = "Postal code is required";
  return errors;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (!productId) {
      router.replace("/shop");
      return;
    }
    shopApi.getProduct(productId).then((res) => {
      setProduct(res.product || null);
      setLoading(false);
    }).catch(() => {
      router.replace("/shop");
    });
  }, [productId, router]);

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
        customer: form,
      });

      if (!orderRes.success && !orderRes.razorpay_order_id) {
        setGeneralError("Failed to create order. Please try again.");
        setSubmitting(false);
        return;
      }

      const order = orderRes.order;
      const razorpayOrderId = orderRes.razorpay_order_id;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx",
        amount: orderRes.amount || product.price * quantity * 100,
        currency: orderRes.currency || "INR",
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
            router.push(`/shop/order-success?orderId=${encodeURIComponent(order?.orderId || response.razorpay_order_id)}&method=razorpay`);
          } catch {
            setGeneralError("Payment verification failed. Please contact support.");
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      };

      const rzp = new (window as any).Razorpay(options);
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

  if (!product) return null;

  const total = product.price * quantity;
  const discount = product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const fields: { label: string; key: keyof FormState; type: string; placeholder: string; colSpan?: string }[] = [
    { label: "Full Name *", key: "name", type: "text", placeholder: "John Doe" },
    { label: "Email Address *", key: "email", type: "email", placeholder: "john@example.com" },
    { label: "Mobile Number *", key: "phone", type: "tel", placeholder: "+1 234 567 8900" },
    { label: "Country *", key: "country", type: "text", placeholder: "United States" },
    { label: "State *", key: "state", type: "text", placeholder: "California" },
    { label: "City *", key: "city", type: "text", placeholder: "Los Angeles" },
    { label: "Complete Shipping Address *", key: "address", type: "text", placeholder: "123 Wellness Street, Apt 4B", colSpan: "sm:col-span-2" },
    { label: "Postal Code *", key: "pincode", type: "text", placeholder: "90001" },
  ];

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 text-xs text-wine/50 mb-6">
          <span>Shop</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-wine/80 font-medium">{product.name}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-wine/80 font-medium">Checkout</span>
        </div>

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple mb-8">Complete Your Order</h1>

        {generalError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 text-red-500 text-sm border border-red-100">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-wine/5">
                <h2 className="font-serif text-lg font-bold text-wine mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.map((f) => (
                    <div key={f.key} className={f.colSpan || ""}>
                      <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40 transition-colors ${errors[f.key] ? "border-red-300" : "border-wine/10"}`}
                        placeholder={f.placeholder}
                      />
                      {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
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
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
