"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, CreditCard, ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";
import { shopApi } from "@/lib/shop-api";
import MagneticButton from "@/components/animations/MagneticButton";

interface OrderItem {
  productId: string; name: string; price: number; quantity: number; image: string;
}

interface ShippingAddress {
  name: string; phone: string; line1: string; city: string; state: string; pincode: string;
}

interface Order {
  id: string; orderId: string; items: OrderItem[];
  subtotal: number; discount: number; shipping: number; total: number;
  status: string; paymentStatus: string; paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string; deliveredAt: string | null;
  coupon: { code: string; discount: number } | null;
}

const statusSteps = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-gold/10 text-gold",
  processing: "bg-purple/10 text-purple",
  shipped: "bg-blue-50 text-blue-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-rose text-wine/60",
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    shopApi.getOrder(id).then((res) => {
      setOrder(res.order || null);
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-8 w-64 bg-wine/10 rounded mb-8" />
          <div className="h-48 bg-wine/5 rounded-2xl mb-4" />
          <div className="h-32 bg-wine/5 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-wine/30" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-wine mb-3">Order Not Found</h1>
          <p className="text-wine/60 mb-8">The order you are looking for does not exist.</p>
          <MagneticButton>
            <Link href="/shop/orders" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg">
              Back to Orders
            </Link>
          </MagneticButton>
        </div>
      </main>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 text-xs text-wine/50 mb-6">
          <Link href="/shop" className="hover:text-wine">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop/orders" className="hover:text-wine">Orders</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-wine/80 truncate max-w-[150px]">{order.orderId}</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple">Order Details</h1>
            <p className="text-sm text-wine/50 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Link href="/shop/orders" className="inline-flex items-center gap-1.5 text-sm text-wine/50 hover:text-wine transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Orders
          </Link>
        </div>

        <div className={cn("mb-6 px-4 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2", statusStyles[order.status] || "bg-wine/10 text-wine/60")}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-light rounded-2xl p-6 mb-6">
          <h2 className="font-serif text-lg font-bold text-wine mb-6">Order Timeline</h2>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-wine/10" />
            <div className="space-y-6">
              {statusSteps.map((step, i) => {
                const isActive = i <= currentStepIndex;
                const isCancelled = order.status === "cancelled" && i > currentStepIndex;
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className={cn("relative z-10 w-[15px] h-[15px] rounded-full border-2 mt-0.5 shrink-0", isActive ? "bg-wine border-wine" : isCancelled ? "bg-rose border-wine/20" : "bg-white border-wine/20")}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isActive ? "text-wine" : isCancelled ? "text-wine/30" : "text-wine/40")}>{step.label}</p>
                      {i === currentStepIndex && order.status === "delivered" && order.deliveredAt && (
                        <p className="text-xs text-green-600 mt-0.5">{formatDate(order.deliveredAt)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {order.status === "cancelled" && (
                <div className="flex items-start gap-4">
                  <div className="relative z-10 w-[15px] h-[15px] rounded-full border-2 bg-rose border-wine/20 mt-0.5 shrink-0">
                    <div className="w-2 h-2 bg-wine/60 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm font-medium text-wine/60">Cancelled</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-wine" />
              <h2 className="font-serif text-lg font-bold text-wine">Shipping Address</h2>
            </div>
            <p className="text-sm font-medium text-wine">{order.shippingAddress.name}</p>
            <p className="text-sm text-wine/60">{order.shippingAddress.phone}</p>
            <p className="text-sm text-wine/60">{order.shippingAddress.line1}</p>
            <p className="text-sm text-wine/60">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-wine" />
              <h2 className="font-serif text-lg font-bold text-wine">Payment Info</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-wine/60">Method</span>
                <span className="font-medium text-wine capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-wine/60">Status</span>
                <span className={cn("font-medium capitalize", order.paymentStatus === "paid" ? "text-green-600" : "text-gold")}>{order.paymentStatus}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-light rounded-2xl overflow-hidden mb-6">
          <div className="p-6 pb-0">
            <h2 className="font-serif text-lg font-bold text-wine mb-4">Items</h2>
          </div>
          <div className="px-6 pb-6 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-wine/5 last:border-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-wine/5 shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-wine/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-wine truncate">{item.name}</p>
                  <p className="text-xs text-wine/40">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-wine">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-light rounded-2xl p-6 mb-8">
          <h2 className="font-serif text-lg font-bold text-wine mb-4">Total Breakdown</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-wine/60">Subtotal</span>
              <span className="font-medium text-wine">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wine/60">Shipping</span>
              <span className={cn("font-medium", order.shipping === 0 ? "text-green-600" : "text-wine")}>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Discount{order.coupon ? ` (${order.coupon.code})` : ""}</span>
                <span className="font-medium text-green-600">-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-wine/10">
              <span className="font-serif text-lg font-bold text-wine">Total</span>
              <span className="font-serif text-2xl font-bold text-gradient-wine-purple">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <MagneticButton>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </MagneticButton>
        </div>
      </div>
    </main>
  );
}
