'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, IndianRupee, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  image: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  tags: string[];
  active: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  payment: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function ShopOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProducts = localStorage.getItem('shop_products');
    const storedOrders = localStorage.getItem('shop_orders');
    if (storedProducts) {
      try { setProducts(JSON.parse(storedProducts)); } catch { setProducts([]); }
    }
    if (storedOrders) {
      try { setOrders(JSON.parse(storedOrders)); } catch { setOrders([]); }
    }
    setLoading(false);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length;

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 10).sort((a, b) => a.stock - b.stock);

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
      processing: 'bg-amber-50 text-amber-600 border-amber-200',
      shipped: 'bg-purple-50 text-purple-600 border-purple-200',
      delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      cancelled: 'bg-red-50 text-red-600 border-red-200',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-gradient-wine-purple">Shop Overview</h2>
          <p className="text-wine/50 text-sm mt-1">Manage your online store</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', count: products.length, icon: Package, color: 'text-gold', bg: 'bg-gold/5' },
          { label: 'Total Orders', count: orders.length, icon: ShoppingBag, color: 'text-purple', bg: 'bg-purple/5' },
          { label: 'Total Revenue', count: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Orders', count: pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 border border-white/10 ${stat.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-wine">{stat.count}</p>
            <p className="text-xs text-wine/50 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-beige p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-wine text-lg">Recent Orders</h3>
            <Link href="/admin/shop/orders" className="inline-flex items-center gap-1 text-xs text-gold hover:text-wine transition-colors font-medium">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-wine/40 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-beige/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-wine">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-wine/50">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-wine">₹{order.total.toLocaleString('en-IN')}</p>
                    <div className="mt-0.5">{statusBadge(order.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-beige p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-wine text-lg">Low Stock Alerts</h3>
            <Link href="/admin/shop/products" className="inline-flex items-center gap-1 text-xs text-gold hover:text-wine transition-colors font-medium">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle size={24} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-wine/40 text-sm">All products are well stocked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b border-beige/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ivory flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={14} className="text-wine/30" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-wine">{product.name}</p>
                      <p className="text-xs text-wine/40">{product.category}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${product.stock <= 3 ? 'text-red-500' : 'text-amber-500'}`}>
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
