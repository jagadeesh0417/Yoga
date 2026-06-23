'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '@/components/admin/Toast';
import { siteConfig } from '@/lib/data';

interface ContactData {
  address: string;
  phones: string[];
  email: string;
  workingHours: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function loadInitialForm(): ContactData {
  try {
    const stored = localStorage.getItem('admin_contact');
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    address: siteConfig.headquarters,
    phones: [...siteConfig.phones],
    email: siteConfig.email,
    workingHours: 'Mon - Fri: 6:00 AM - 8:00 PM | Sat - Sun: 7:00 AM - 6:00 PM',
    instagram: siteConfig.socials.instagram,
    facebook: siteConfig.socials.facebook,
    youtube: siteConfig.socials.youtube,
    linkedin: siteConfig.socials.linkedin,
  };
}

export default function AdminContact() {
  const router = useRouter();
  const [form, setForm] = useState<ContactData>(loadInitialForm);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch('/api/contact');
        if (res.status === 401) { router.replace('/admin'); return; }
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch {
      } finally {
        setLoadingMessages(false);
      }
    }
    loadMessages();
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('admin_contact', JSON.stringify(form));
      setToast({ message: 'Contact information saved successfully', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save contact information', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory to-beige/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-wine/60 hover:text-wine transition-colors text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-gradient-wine-purple">Contact Information</h2>
          <p className="text-sm text-wine/60 mt-1">Manage your business contact details and social media links</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-sm">
            <h3 className="text-lg font-serif font-semibold text-gradient-wine-purple mb-4">Business Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">Address / Headquarters</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">Phone Numbers (comma separated)</label>
                <input type="text" value={form.phones.join(', ')} onChange={(e) => setForm({ ...form, phones: e.target.value.split(',').map((p) => p.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">Working Hours</label>
                <input type="text" value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-sm">
            <h3 className="text-lg font-serif font-semibold text-gradient-wine-purple mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">Instagram URL</label>
                <input type="url" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">Facebook URL</label>
                <input type="url" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">YouTube URL</label>
                <input type="url" value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-wine/80 mb-1">LinkedIn URL</label>
                <input type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-wine to-purple text-white rounded-lg hover:bg-wine/90 transition-colors text-sm font-medium">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-gradient-wine-purple mb-4">Contact Messages ({messages.length})</h3>
          {loadingMessages ? (
            <div className="flex justify-center py-8">
              <span className="w-6 h-6 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-wine/50 text-center py-8">No messages yet.</p>
          ) : (
            <div className="divide-y divide-gold/10">
              {messages.map((msg) => (
                <div key={msg.id} className="py-4 cursor-pointer hover:bg-gold/5 px-3 -mx-3 rounded-lg transition-colors" onClick={() => setSelectedMsg(selectedMsg?.id === msg.id ? null : msg)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-wine">{msg.name}</p>
                      <p className="text-xs text-wine/50">{msg.email} {msg.phone ? `| ${msg.phone}` : ''}</p>
                    </div>
                    <span className="text-xs text-wine/40">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  {msg.subject && <p className="text-xs font-medium text-wine mt-1">{msg.subject}</p>}
                  {selectedMsg?.id === msg.id && (
                    <p className="text-sm text-wine/70 mt-2 bg-ivory/50 p-3 rounded-lg">{msg.message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
