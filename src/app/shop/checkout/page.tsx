"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, MapPin, ChevronDown, Tag, Truck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { shopApi } from "@/lib/shop-api";
import MagneticButton from "@/components/animations/MagneticButton";

interface CartItem {
  id: string; productId: string; name: string; price: number;
  quantity: number; image: string; slug: string; stock: number;
}

interface Address {
  id: string; name: string; phone: string; line1: string;
  city: string; state: string; pincode: string; isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ items: CartItem[]; subtotal: number; discount: number; shipping: number; total: number; coupon: { code: string; discount: number } | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: string; text: string } | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddresses, setShowAddresses] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", line1: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    shopApi.getCart().then((res) => {
      const c = res.cart || res;
      setCart(c);
      if (!c.items || c.items.length === 0) { router.replace("/shop/cart"); return; }
      setLoading(false);
    }).catch(() => { router.replace("/shop/cart"); });
  }, [router]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("shop_token") : null;
    if (token) {
      shopApi.getAddresses().then((res) => {
        const addrs = res.addresses || [];
        setSavedAddresses(addrs);
        const def = addrs.find((a: Address) => a.isDefault);
        if (def) {
          setSelectedAddressId(def.id);
          setForm({ name: def.name, phone: def.phone, line1: def.line1, city: def.city, state: def.state, pincode: def.pincode });
        }
      }).catch(() => {});
    }
  }, []);

  const selectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setForm({ name: addr.name, phone: addr.phone, line1: addr.line1, city: addr.city, state: addr.state, pincode: addr.pincode });
    setShowAddresses(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg(null);
    try {
      const res = await shopApi.verifyCoupon(couponCode);
      if (res.valid) {
        const discountVal = res.type === "percentage" ? (cart?.subtotal || 0) * (res.discount / 100) : res.discount;
        setCart((prev) => prev ? { ...prev, discount: discountVal, total: prev.subtotal - discountVal + prev.shipping, coupon: { code: res.code, discount: res.discount } } : prev);
        setCouponMsg({ type: "success", text: `Coupon "${res.code}" applied!` });
      }
    } catch { setCouponMsg({ type: "error", text: "Invalid coupon code." }); }
  };

  interface RazorpayWindow {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as unknown as RazorpayWindow).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      setCouponMsg({ type: "error", text: "Please fill in all shipping details." });
      return;
    }
    setPlacing(true);
    const orderData = {
      items: cart?.items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
      shippingAddress: form,
      paymentMethod,
      coupon: cart?.coupon || null,
      subtotal: cart?.subtotal,
      discount: cart?.discount || 0,
      shipping: cart?.shipping || 0,
      total: cart?.total,
    };

    try {
      if (paymentMethod === "cod") {
        const res = await shopApi.createOrder(orderData);
        const orderId = res.order?.orderId || res.order?.id || "";
        router.push(`/shop/order-success?orderId=${encodeURIComponent(orderId)}&method=cod`);
        return;
      }

      const razorpayReady = await loadRazorpay();
      if (!razorpayReady) { setCouponMsg({ type: "error", text: "Failed to load payment gateway." }); setPlacing(false); return; }

      const res = await shopApi.createOrder(orderData);
      const { razorpay_order_id, order } = res;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxx",
        amount: (cart?.total || 0) * 100,
        currency: "INR",
        name: "MYSTIC YOGA",
        description: `Order ${order?.orderId || ""}`,
        order_id: razorpay_order_id,
        prefill: { name: form.name, contact: form.phone },
        theme: { color: "#8B1E3F" },
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            await shopApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            router.push(`/shop/order-success?orderId=${encodeURIComponent(order?.orderId || response.razorpay_order_id)}&method=razorpay`);
          } catch { setCouponMsg({ type: "error", text: "Payment verification failed. Please contact support." }); setPlacing(false); }
        },
        modal: { ondismiss: () => setPlacing(false) },
      };

      const rzp = new (window as unknown as RazorpayWindow).Razorpay(options);
      rzp.open();
    } catch { setCouponMsg({ type: "error", text: "Failed to place order. Please try again." }); setPlacing(false); }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          <div className="h-8 w-48 bg-wine/10 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-4">
              <div className="h-48 bg-wine/5 rounded-2xl" />
              <div className="h-32 bg-wine/5 rounded-2xl" />
            </div>
            <div className="lg:col-span-2 h-64 bg-wine/5 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple mb-8">Checkout</h1>

        {couponMsg && (
          <div className={cn("mb-6 px-4 py-3 rounded-xl text-sm", couponMsg.type === "success" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-500 border border-red-100")}>
            {couponMsg.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-light rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-wine" />
                <h2 className="font-serif text-lg font-bold text-wine">Shipping Address</h2>
              </div>

              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <button onClick={() => setShowAddresses(!showAddresses)} className="flex items-center gap-2 text-sm text-purple hover:text-wine transition-colors">
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showAddresses && "rotate-180")} />
                    Saved Addresses ({savedAddresses.length})
                  </button>
                  {showAddresses && (
                    <div className="mt-2 space-y-2">
                      {savedAddresses.map((addr) => (
                        <button key={addr.id} onClick={() => selectAddress(addr)} className={cn("w-full text-left p-3 rounded-xl border text-sm transition-all", selectedAddressId === addr.id ? "border-wine bg-wine/5" : "border-wine/10 hover:border-wine/30")}>
                          <p className="font-medium text-wine">{addr.name} - {addr.phone}</p>
                          <p className="text-wine/60 text-xs">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" placeholder="+1 234 567 8900" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Address Line *</label>
                  <input type="text" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" placeholder="123 Wellness Street" />
                </div>
                <div>
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">City *</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">State *</label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" placeholder="Maharashtra" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-wine/50 uppercase tracking-wider mb-1.5 block">Pincode *</label>
                  <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" placeholder="400001" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-light rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-wine" />
                <h2 className="font-serif text-lg font-bold text-wine">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[
                  { value: "razorpay", label: "Razorpay", sub: "Credit/Debit Card, UPI, Net Banking, Wallet", icon: CreditCard },
                  { value: "cod", label: "Cash on Delivery", sub: "Pay when you receive your order", icon: Wallet },
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value as "razorpay" | "cod")}
                    className={cn("w-full flex items-center gap-4 p-4 rounded-xl border transition-all", paymentMethod === method.value ? "border-wine bg-wine/5" : "border-wine/10 hover:border-wine/30")}
                  >
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", paymentMethod === method.value ? "border-wine" : "border-wine/30")}>
                      {paymentMethod === method.value && <div className="w-2.5 h-2.5 rounded-full bg-wine" />}
                    </div>
                    <method.icon className="w-5 h-5 text-wine/50 shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-wine">{method.label}</p>
                      <p className="text-xs text-wine/40">{method.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-light rounded-2xl p-6 sticky top-24">
              <h2 className="font-serif text-lg font-bold text-wine mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-wine/5 shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-wine truncate">{item.name}</p>
                      <p className="text-xs text-wine/50">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-wine">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-wine/10 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-wine/60">Subtotal</span>
                  <span className="font-medium text-wine">${(cart?.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-wine/60">Shipping</span>
                  <span className={cn("font-medium", (cart?.shipping || 0) === 0 ? "text-green-600" : "text-wine")}>
                    {(cart?.shipping || 0) === 0 ? "Free" : `$${(cart?.shipping || 0).toFixed(2)}`}
                  </span>
                </div>
                {cart?.coupon && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-${(cart?.discount || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center my-4 pt-3 border-t border-wine/10">
                <span className="font-serif text-lg font-bold text-wine">Total</span>
                <span className="font-serif text-2xl font-bold text-gradient-wine-purple">${(cart?.total || 0).toFixed(2)}</span>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-wine/30" />
                  <input type="text" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()} className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 border border-wine/10 text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:border-gold/40" />
                </div>
                <button onClick={handleApplyCoupon} disabled={!couponCode.trim()} className="px-4 py-2 rounded-xl bg-gradient-to-r from-wine to-purple text-white text-xs font-medium disabled:opacity-50 hover:brightness-110 transition-all">
                  Apply
                </button>
              </div>

              <MagneticButton>
                <button onClick={handlePlaceOrder} disabled={placing} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg shadow-wine/20 hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <Truck className="w-4 h-4" />
                  {placing ? "Placing Order..." : "Place Order"}
                </button>
              </MagneticButton>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-wine/30">
                <ShoppingBag className="w-3 h-3" />
                <span>Secure checkout powered by Razorpay</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
