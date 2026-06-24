'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Mail, Phone, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/enquiries');
        if (res.ok) setEnquiries(await res.json());
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = enquiries.filter((e) => {
    const q = searchQuery.toLowerCase();
    return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.phone || '').includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-wine">Enquiries</h1>
        <p className="text-wine/50 text-sm">Website enquiry form submissions</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/30" />
        <input type="text" placeholder="Search by name, email, or phone..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-beige bg-white text-sm text-wine placeholder:text-wine/30 focus:outline-none focus:ring-2 focus:ring-gold/30" />
      </div>

      <div className="bg-white rounded-xl border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-wine/30" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-wine/30 text-sm">No enquiries found</div>
        ) : (
          <div className="space-y-3 p-4">
            {filtered.map((enquiry) => (
              <motion.div key={enquiry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-beige hover:border-gold/30 hover:bg-gold/5 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-wine">{enquiry.name}</p>
                    <p className="text-xs text-wine/50">{new Date(enquiry.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-wine/60">
                    <Mail size={14} />
                    <a href={`mailto:${enquiry.email}`} className="hover:text-wine transition-colors">{enquiry.email}</a>
                  </div>
                  {enquiry.phone && (
                    <div className="flex items-center gap-2 text-wine/60">
                      <Phone size={14} />
                      <span>{enquiry.phone}</span>
                    </div>
                  )}
                  {enquiry.message && (
                    <div className="flex items-start gap-2 text-wine/60 mt-2 pt-2 border-t border-beige">
                      <MessageSquare size={14} className="mt-0.5 shrink-0" />
                      <p className="text-wine/70">{enquiry.message}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
