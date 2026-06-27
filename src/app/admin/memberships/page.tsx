'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular: boolean;
  published: boolean;
  stripePriceId: string;
}

const empty: Partial<MembershipPlan> = { name: '', price: 0, interval: 'month', features: [], popular: false, published: true, stripePriceId: '' };

export default function AdminMemberships() {
  const router = useRouter();
  const [items, setItems] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MembershipPlan | null>(null);
  const [form, setForm] = useState<Partial<MembershipPlan>>(empty);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<MembershipPlan | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function fetchItems() {
    try {
      const res = await fetch('/api/memberships');
      if (res.status === 401) { router.replace('/admin'); return; }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  const handleEdit = (item: MembershipPlan) => {
    setEditingItem(item);
    setForm({ ...item, features: [...item.features] });
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
    if (!form.price || form.price <= 0) errs.price = 'Price must be greater than 0';
    if (!form.interval?.trim()) errs.interval = 'Interval is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const body = { name: form.name, price: form.price, interval: form.interval, features: form.features || [], popular: form.popular || false, published: form.published !== undefined ? form.published : true, stripePriceId: form.stripePriceId || '' };
      let res;

      if (editingItem) {
        res = await fetch(`/api/memberships/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) { setToast({ message: 'Failed to save', type: 'error' }); return; }

      setToast({ message: editingItem ? 'Membership plan updated' : 'Membership plan created', type: 'success' });
      setModalOpen(false);
      fetchItems();
    } catch {
      setToast({ message: 'Failed to save membership plan', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/memberships/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) { setToast({ message: 'Failed to delete', type: 'error' }); return; }
      setDeleteTarget(null);
      setToast({ message: 'Membership plan deleted', type: 'success' });
      fetchItems();
    } catch {
      setToast({ message: 'Failed to delete membership plan', type: 'error' });
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'price',
      header: 'Price',
      render: (item: MembershipPlan) => `$${item.price}`,
    },
    { key: 'interval', header: 'Interval' },
    {
      key: 'popular',
      header: 'Popular',
      render: (item: MembershipPlan) => item.popular ? <span className="px-2 py-1 rounded-full text-xs font-medium bg-gold/20 text-gold">Yes</span> : <span className="text-wine/40">-</span>,
    },
    {
      key: 'published',
      header: 'Published',
      render: (item: MembershipPlan) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-wine/5 text-wine/50'}`}>
          {item.published ? 'Yes' : 'No'}
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
    <div className="space-y-6">
      <AdminTable columns={columns} data={items} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(item)} onAdd={handleAdd} title="Membership Plans" addLabel="Add Plan" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem !== null ? 'Edit Membership Plan' : 'Add Membership Plan'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Name</label>
            <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Price ($)</label>
              <input type="number" step="0.01" value={form.price || 0} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 rounded-lg border ${errors.price ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Interval</label>
              <input type="text" value={form.interval || ''} onChange={(e) => setForm({ ...form, interval: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.interval ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} placeholder="month / year" />
              {errors.interval && <p className="text-xs text-red-500 mt-1">{errors.interval}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Stripe Price ID</label>
            <input type="text" value={form.stripePriceId || ''} onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Features (comma separated)</label>
            <input type="text" value={(form.features || []).join(', ')} onChange={(e) => setForm({ ...form, features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.popular || false} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">Popular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published !== false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">Published</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingItem !== null ? 'Save Changes' : 'Add Plan'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Membership Plan" message="Are you sure you want to delete this membership plan?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
