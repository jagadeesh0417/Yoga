'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Download, ChevronDown, ChevronUp, Filter, RefreshCw } from 'lucide-react';
import Toast from '@/components/admin/Toast';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  pincode?: string;
}

interface Order {
  id: string;
  orderId: string;
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: string;
  createdAt: string;
  updatedAt?: string;
}

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
  processing: 'bg-purple-50 text-purple-600 border-purple-200',
  shipped: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const paymentColors: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  failed: 'bg-red-50 text-red-600 border-red-200',
  refunded: 'bg-gray-50 text-gray-600 border-gray-200',
};

function exportToCsv(orders: Order[]) {
  const headers = [
    'Order ID', 'Customer Name', 'Email', 'Phone', 'Country', 'State', 'City',
    'Address', 'Postal Code', 'Product', 'Quantity', 'Amount Paid', 'Currency',
    'Payment Status', 'Order Status', 'Transaction ID', 'Purchase Date',
  ];

  const rows = orders.flatMap((o) =>
    o.items.map((item) => [
      o.orderId,
      o.customer?.name || '',
      o.customer?.email || '',
      o.customer?.phone || '',
      o.customer?.country || '',
      o.customer?.state || '',
      o.customer?.city || '',
      o.customer?.address || '',
      o.customer?.pincode || '',
      item.name,
      item.quantity,
      o.total,
      o.currency || 'HKD',
      o.paymentStatus,
      o.orderStatus,
      o.razorpayPaymentId || '',
      new Date(o.createdAt).toISOString(),
    ]),
  );

  const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter) params.set('status', statusFilter);

    try {
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      const stored = localStorage.getItem('admin_orders');
      if (stored) {
        try { setOrders(JSON.parse(stored)); } catch { setOrders([]); }
      } else {
        setOrders([]);
      }
    }
    setLoading(false);
  }, [searchQuery, statusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, orderStatus: status } : o)));
        setToast({ message: `Order marked as ${status}`, type: 'success' });
      } else {
        setToast({ message: 'Failed to update order', type: 'error' });
      }
    } catch {
      const updated = orders.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, orderStatus: status } : o));
      setOrders(updated);
      localStorage.setItem('admin_orders', JSON.stringify(updated));
      setToast({ message: `Order marked as ${status} (offline)`, type: 'success' });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const badge = (value: string, colorMap: Record<string, string>) => {
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${colorMap[value] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-gradient-wine-purple">Orders</h2>
          <p className="text-wine/50 text-sm mt-1">Manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadOrders()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-beige text-wine text-sm hover:bg-ivory/50 transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => exportToCsv(orders)} disabled={orders.length === 0} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
          <input
            type="text" placeholder="Search by order ID, customer name, email, or phone..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-beige bg-white text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-wine/20"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/30" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 rounded-lg border border-beige bg-white text-sm text-wine focus:outline-none focus:ring-2 focus:ring-wine/20 appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-wine/30 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-wine/50 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige bg-ivory/50">
                  <th className="text-left px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-wine/40 text-xs uppercase tracking-wider">Action</th>
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
                          <span className="font-mono text-xs text-wine">#{order.orderId?.slice(0, 12) || order.id.slice(0, 12)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-wine text-sm">{order.customer?.name || 'N/A'}</p>
                        <p className="text-xs text-wine/40">{order.customer?.email || ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        {order.items?.map((item, i) => (
                          <p key={i} className="text-xs text-wine">
                            {item.name} <span className="text-wine/40">x{item.quantity}</span>
                          </p>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-wine">{order.currency || 'HKD'} {order.total}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-wine/50">{order.paymentMethod || 'Razorpay'}</span>
                          {badge(order.paymentStatus, paymentColors)}
                        </div>
                      </td>
                      <td className="px-4 py-3">{badge(order.orderStatus, statusColors)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-wine/40 whitespace-nowrap">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => { e.stopPropagation(); updateStatus(order.id || order.orderId, e.target.value); }}
                          className="px-2 py-1.5 rounded-lg border border-gold/30 text-xs text-wine bg-white focus:outline-none focus:ring-2 focus:ring-wine/20 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-detail`} className="bg-ivory/50">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="pl-6 border-l-2 border-gold/20 ml-2 space-y-3">
                            <div>
                              <p className="text-xs font-medium text-wine/50 uppercase tracking-wider mb-2">Customer Details</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-xs text-wine/40">Name</p>
                                  <p className="text-wine">{order.customer?.name || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">Email</p>
                                  <p className="text-wine">{order.customer?.email || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">Phone</p>
                                  <p className="text-wine">{order.customer?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">Country</p>
                                  <p className="text-wine">{order.customer?.country || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">State</p>
                                  <p className="text-wine">{order.customer?.state || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">City</p>
                                  <p className="text-wine">{order.customer?.city || 'N/A'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                  <p className="text-xs text-wine/40">Address</p>
                                  <p className="text-wine">{order.customer?.address || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">Postal Code</p>
                                  <p className="text-wine">{order.customer?.pincode || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-beige">
                              <p className="text-xs font-medium text-wine/50 uppercase tracking-wider mb-2">Payment Info</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-xs text-wine/40">Transaction ID</p>
                                  <p className="text-wine font-mono text-xs">{order.razorpayPaymentId || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">Razorpay Order ID</p>
                                  <p className="text-wine font-mono text-xs">{order.razorpayOrderId || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">Payment Status</p>
                                  <div className="mt-0.5">{badge(order.paymentStatus, paymentColors)}</div>
                                </div>
                                <div>
                                  <p className="text-xs text-wine/40">Total</p>
                                  <p className="font-bold text-wine">{order.currency || 'HKD'} {order.total}</p>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-beige">
                              <p className="text-xs font-medium text-wine/50 uppercase tracking-wider mb-2">Order Timeline</p>
                              <div className="flex items-center gap-2 text-xs text-wine/50">
                                <span>Created: {formatDate(order.createdAt)}</span>
                                {order.updatedAt && order.updatedAt !== order.createdAt && (
                                  <><span className="text-wine/20">|</span><span>Updated: {formatDate(order.updatedAt)}</span></>
                                )}
                              </div>
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
