"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { shopApi } from "@/lib/shop-api";
import MagneticButton from "@/components/animations/MagneticButton";

interface OrderItem {
  productId: string; name: string; price: number; quantity: number; image: string;
}

interface Order {
  id: string; orderId: string;
  items: OrderItem[];
  subtotal: number; discount: number; shipping: number; total: number;
  status: string; paymentStatus: string; paymentMethod: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-gold/10 text-gold border border-gold/20",
  processing: "bg-purple/10 text-purple border border-purple/20",
  shipped: "bg-blue-50 text-blue-600 border border-blue-200",
  delivered: "bg-green-50 text-green-600 border border-green-200",
  cancelled: "bg-rose text-wine/60 border border-wine/10",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopApi.getMyOrders().then((res) => {
      setOrders(Array.isArray(res) ? res : res.orders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 animate-pulse">
          <div className="h-8 w-48 bg-wine/10 rounded mb-8" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-wine/5 rounded-2xl mb-4" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple mb-8">Order History</h1>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-wine/30" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-wine mb-2">No Orders Yet</h2>
            <p className="text-wine/60 mb-8 max-w-md mx-auto">You haven&apos;t placed any orders yet. Start shopping to see your order history here.</p>
            <MagneticButton>
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg">
                <ShoppingBag className="w-4 h-4" />
                Start Shopping
              </Link>
            </MagneticButton>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-light rounded-2xl overflow-hidden hover:shadow-wine transition-all"
              >
                <Link href={`/shop/orders/${order.id}`} className="block p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-wine/40">ORDER ID</p>
                      <p className="font-mono text-sm font-medium text-wine">{order.orderId}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider", statusStyles[order.status] || "bg-wine/10 text-wine/60")}>
                        {order.status}
                      </span>
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider", order.paymentStatus === "paid" ? "bg-green-50 text-green-600 border border-green-200" : "bg-gold/10 text-gold border border-gold/20")}>
                        {order.paymentStatus}
                      </span>
                      <ArrowRight className="w-4 h-4 text-wine/20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-10 h-10 rounded-lg bg-wine/5 border-2 border-white overflow-hidden relative">
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-wine/40 font-medium">
                            {item.name.charAt(0)}
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-wine/10 border-2 border-white flex items-center justify-center">
                          <span className="text-[10px] font-medium text-wine/50">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-wine font-medium">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                      <p className="text-xs text-wine/40">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-bold text-gradient-wine-purple">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
