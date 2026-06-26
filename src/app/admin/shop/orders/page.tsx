'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Toast from '@/components/admin/Toast';
import { generateId } from '@/lib/utils';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  payment: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const statusOptions = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyles: Record<string, string> = {
  confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
  processing: 'bg-amber-50 text-amber-600 border-amber-200',
  shipped: 'bg-purple-50 text-purple-600 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const seedOrders: Order[] = [
  {
    id: generateId(),
    customer: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    address: '42, Lotus Lane, Andheri West, Mumbai, Maharashtra 400053',
    items: [
      { productId: '1', name: 'Premium Yoga Mat', price: 2499, quantity: 1 },
      { productId: '2', name: 'Cork Yoga Blocks Set', price: 999, quantity: 1 },
    ],
    total: 3498,
    payment: 'Razorpay',
    paymentStatus: 'paid',
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: generateId(),
    customer: 'Arun Kumar',
    email: 'arun@example.com',
    phone: '+91 87654 32109',
    address: '15, Yoga Nagar, Koramangala, Bengaluru, Karnataka 560034',
    items: [
      { productId: '3', name: 'Meditation Cushion', price: 1799, quantity: 2 },
    ],
    total: 3598,
    payment: 'Cash on Delivery',
    paymentStatus: 'pending',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

function loadOrders(): Order[] {
  const stored = localStorage.getItem('shop_orders');
  if (stored) {
    try { return JSON.parse(stored); } catch { return []; }
  }
  localStorage.setItem('shop_orders', JSON.stringify(seedOrders));
  console.log('[shop_orders] Seeded with', seedOrders.length, 'orders');
  return seedOrders;
}

function saveOrders(items: Order[]) {
  localStorage.setItem('shop_orders', JSON.stringify(items));
  console.log('[shop_orders] Saved', items.length, 'orders');
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setOrders(loadOrders());
    setLoading(false);
  }, []);

  const updateStatus = (id: string, status: string) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    saveOrders(updated);
    setToast({ message: 'Order status updated', type: 'success' });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const paymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      pending: 'bg-amber-50 text-amber-600 border-amber-200',
      failed: 'bg-red-50 text-red-600 border-red-200',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-gradient-wine-purple">Orders</h2>
        <p className="text-wine/50 text-sm mt-1">Manage customer orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-beige overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-wine/50 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige bg-ivory/50">
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-b border-beige/50 last:border-0 hover:bg-ivory/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {expandedId === order.id ? <ChevronUp size={14} className="text-wine/30" /> : <ChevronDown size={14} className="text-wine/30" />}
                          <span className="font-mono text-xs text-wine">#{order.id.slice(0, 8)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-wine text-sm">{order.customer}</p>
                        <p className="text-xs text-wine/40">{order.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-wine">₹{order.total.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-wine/60">{order.payment}</span>
                          {paymentStatusBadge(order.paymentStatus)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {statusBadge(order.status)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-wine/40 whitespace-nowrap">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-gold/30 text-xs text-wine bg-white focus:outline-none focus:ring-2 focus:ring-wine/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-items`} className="bg-ivory/50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="pl-6 border-l-2 border-gold/20 ml-2">
                            <p className="text-xs font-medium text-wine/50 uppercase tracking-wider mb-2">Order Items</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-wine">{item.name} <span className="text-wine/40">x{item.quantity}</span></span>
                                  <span className="font-medium text-wine">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-beige flex items-center justify-between">
                              <span className="text-xs text-wine/50">{order.phone} | {order.address}</span>
                              <span className="font-bold text-wine">₹{order.total.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
