'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  featured: boolean;
  createdAt: string;
}

const empty: Partial<Testimonial> = { name: '', location: '', rating: 5, text: '', image: '', featured: false };

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)} className="p-0.5">
        <Star size={20} className={star <= value ? 'fill-gold text-gold' : 'text-wine/20'} />
      </button>
    ))}
  </div>
);

export default function AdminTestimonials() {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>(empty);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function fetchItems() {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setForm({ ...item });
    setModalOpen(true);
    setErrors({});
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ ...empty });
    setModalOpen(true);
    setErrors({});
  };

  const validate = () => {
    const errs: Partial<Record<string, string>> = {};
    if (!form.name?.trim()) errs.name = 'Name is required';
    if (!form.text?.trim()) errs.text = 'Text is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const body = { name: form.name, location: form.location, rating: form.rating || 5, text: form.text, image: form.image || '', featured: form.featured || false };
      let res;

      if (editingItem) {
        res = await fetch(`/api/testimonials/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) { setToast({ message: 'Failed to save', type: 'error' }); return; }

      setToast({ message: editingItem ? 'Testimonial updated successfully' : 'Testimonial created successfully', type: 'success' });
      setModalOpen(false);
      fetchItems();
    } catch {
      setToast({ message: 'Failed to save testimonial', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/testimonials/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) { setToast({ message: 'Failed to delete', type: 'error' }); return; }
      setDeleteTarget(null);
      setToast({ message: 'Testimonial deleted', type: 'success' });
      fetchItems();
    } catch {
      setToast({ message: 'Failed to delete testimonial', type: 'error' });
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
    {
      key: 'rating',
      header: 'Rating',
      render: (item: Testimonial) => (
        <div className="flex gap-0.5">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} size={14} className="fill-gold text-gold" />
          ))}
        </div>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (item: Testimonial) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.featured ? 'bg-gold/20 text-gold' : 'bg-wine/5 text-wine/50'}`}>
          {item.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory to-beige/30 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory to-beige/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-wine/60 hover:text-wine transition-colors text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <AdminTable columns={columns} data={items} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(item)} onAdd={handleAdd} title="Testimonials" addLabel="Add Testimonial" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem !== null ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Name</label>
            <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Location</label>
            <input type="text" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Rating</label>
            <StarRating value={form.rating || 5} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Text</label>
            <textarea rows={3} value={form.text || ''} onChange={(e) => setForm({ ...form, text: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.text ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm resize-none`} />
            {errors.text && <p className="text-xs text-red-500 mt-1">{errors.text}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Image URL</label>
            <input type="text" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
            <span className="text-sm text-wine/80">Featured</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingItem !== null ? 'Save Changes' : 'Add Testimonial'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Testimonial" message="Are you sure you want to delete this testimonial?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
