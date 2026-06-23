'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Loader2,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  plan: string;
  paymentMethod: string;
  reference: string;
  status: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
  APPROVED: 'bg-green-50 text-green-600 border-green-200',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock size={14} />,
  APPROVED: <CheckCircle size={14} />,
  REJECTED: <XCircle size={14} />,
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    let cancelled = false;
    async function fetchPayments() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'ALL') params.set('status', statusFilter);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        const res = await fetch(`/api/payments?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (cancelled) return;
        setPayments(data.payments || []);

        const all = data.payments || [];
        setStats({
          total: all.length,
          pending: all.filter((p: Payment) => p.status === 'PENDING').length,
          approved: all.filter((p: Payment) => p.status === 'APPROVED').length,
          rejected: all.filter((p: Payment) => p.status === 'REJECTED').length,
        });
      } catch {
        if (!cancelled) setPayments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPayments();
    return () => { cancelled = true; };
  }, [statusFilter, searchQuery]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setPayments((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
      }
    } catch {
      // silent
    } finally {
      setUpdating(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(id);
    setTimeout(() => setCopiedRef(null), 2000);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-gradient-wine-purple">
          Payment Submissions
        </h2>
        <p className="text-wine/50 text-sm mt-1">
          Verify and manage payment submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', count: stats.total, color: 'text-wine', bg: 'bg-wine/5' },
          { label: 'Pending', count: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', count: stats.approved, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejected', count: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn('rounded-xl p-4 border', stat.bg, 'border-transparent')}
          >
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.count}</p>
            <p className="text-xs text-wine/50 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or reference..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-beige bg-white text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-beige bg-white text-sm text-wine/70 hover:text-wine hover:border-gold/30 transition-colors"
          >
            <Filter size={16} />
            {statusFilter === 'ALL' ? 'All Status' : statusFilter}
            <ChevronDown size={14} />
          </button>
          {showFilter && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-beige z-20 overflow-hidden">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setShowFilter(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    statusFilter === s
                      ? 'bg-wine/5 text-wine font-medium'
                      : 'text-wine/60 hover:bg-ivory'
                  )}
                >
                  {s === 'ALL' ? 'All Status' : s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-wine/30" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center mx-auto mb-4">
              <Clock size={28} className="text-wine/20" />
            </div>
            <p className="text-wine/50 text-sm">No payment submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige bg-ivory/50">
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Method
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-wine/50 text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-beige/50 last:border-0 hover:bg-ivory/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-wine">{payment.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-wine text-xs">{payment.email}</p>
                      {payment.phone && (
                        <p className="text-wine/40 text-xs">{payment.phone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-wine font-medium text-xs">
                        {payment.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs capitalize text-wine/60">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleCopy(payment.reference, payment.id)
                        }
                        className="flex items-center gap-1.5 text-xs font-mono text-wine/60 hover:text-wine transition-colors"
                      >
                        {payment.reference.slice(0, 12)}...
                        {copiedRef === payment.id ? (
                          <CheckCheck size={12} className="text-green-500" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                          statusStyles[payment.status] ||
                            'bg-gray-50 text-gray-600 border-gray-200'
                        )}
                      >
                        {statusIcons[payment.status]}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-wine/40 whitespace-nowrap">
                        {formatDate(payment.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {payment.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(payment.id, 'APPROVED')
                              }
                              disabled={updating === payment.id}
                              className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              {updating === payment.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle size={12} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(payment.id, 'REJECTED')
                              }
                              disabled={updating === payment.id}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              {updating === payment.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <XCircle size={12} />
                              )}
                              Reject
                            </button>
                          </>
                        )}
                        {payment.status === 'APPROVED' && (
                          <span className="text-xs text-green-500 font-medium">
                            Approved
                          </span>
                        )}
                        {payment.status === 'REJECTED' && (
                          <span className="text-xs text-red-500 font-medium">
                            Rejected
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
