'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, CheckCircle, XCircle, Clock, Loader2, Copy, CheckCheck, ExternalLink, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  paymentMethod: string;
  reference: string;
  screenshot: string | null;
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

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiry');
      if (res.ok) setEnquiries(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch('/api/enquiry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } finally {
      setUpdating(null);
    }
  };

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
  };

  const filtered = enquiries.filter((e) => {
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.reference.toLowerCase().includes(q) ||
      (e.phone || '').includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === 'PENDING').length,
    approved: enquiries.filter((e) => e.status === 'APPROVED').length,
    rejected: enquiries.filter((e) => e.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-wine">Enquiries</h1>
          <p className="text-wine/50 text-sm">Manage payment enquiry submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: stats.total, color: 'text-wine', bg: 'bg-wine/5' },
          { label: 'Pending', count: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', count: stats.approved, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejected', count: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl p-4', s.bg)}>
            <p className={cn('text-2xl font-bold', s.color)}>{s.count}</p>
            <p className="text-xs text-wine/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
          <input
            type="text"
            placeholder="Search by name, email, reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-beige bg-white text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium border transition-colors',
                statusFilter === s
                  ? 'bg-wine text-white border-wine'
                  : 'bg-white text-wine/50 border-beige hover:border-wine/30'
              )}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-wine/30" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-wine/30 text-sm">No enquiries found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ivory/50 border-b border-beige">
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Method</th>
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Reference</th>
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Screenshot</th>
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-wine/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enquiry) => (
                  <motion.tr
                    key={enquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-beige/50 hover:bg-ivory/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-wine/50 text-xs whitespace-nowrap">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-wine">{enquiry.name}</p>
                      {enquiry.message && (
                        <p className="text-xs text-wine/40 truncate max-w-[150px]">{enquiry.message}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-wine text-xs">{enquiry.email}</p>
                      {enquiry.phone && <p className="text-wine/40 text-xs">{enquiry.phone}</p>}
                    </td>
                    <td className="px-4 py-3 capitalize text-wine/70 text-xs">{enquiry.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <code className="text-xs font-mono text-wine/60">{enquiry.reference}</code>
                        <button onClick={() => copyRef(enquiry.reference)} className="text-wine/20 hover:text-wine transition-colors">
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {enquiry.screenshot ? (
                        <button
                          onClick={() => setPreviewImg(enquiry.screenshot)}
                          className="inline-flex items-center gap-1 text-xs text-gold hover:text-wine transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-wine/30">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border', statusStyles[enquiry.status])}>
                        {statusIcons[enquiry.status]}
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {enquiry.status === 'PENDING' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(enquiry.id, 'APPROVED')}
                            disabled={updating === enquiry.id}
                            className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {updating === enquiry.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(enquiry.id, 'REJECTED')}
                            disabled={updating === enquiry.id}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <XCircle size={12} />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Screenshot preview modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[400px]">
              <img src={previewImg} alt="Payment screenshot" className="w-full h-full object-contain" />
            </div>
            <div className="p-4 flex justify-end">
              <button onClick={() => setPreviewImg(null)}
                className="px-4 py-2 rounded-lg bg-wine text-white text-sm font-medium hover:bg-wine/90 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
