'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';

interface Service {
  id: string;
  title: string;
  description: string;
  shortDesc: string;
  icon: string;
  features: string[];
  image: string;
  price: number;
  order: number;
  published: boolean;
}

const empty: Partial<Service> = { title: '', description: '', shortDesc: '', icon: 'sparkles', features: [], image: '', price: 0, order: 0, published: true };

export default function AdminServices() {
  const router = useRouter();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>(empty);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function fetchItems() {
    try {
      const res = await fetch('/api/services');
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

  const handleEdit = (item: Service) => {
    setEditingItem(item);
    setForm({ ...item, features: [...item.features] });
    setModalOpen(true);
    setErrors({});
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ ...empty, order: items.length + 1 });
    setModalOpen(true);
    setErrors({});
  };

  const validate = () => {
    const errs: Partial<Record<string, string>> = {};
    if (!form.title?.trim()) errs.title = 'Title is required';
    if (!form.description?.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const body = { title: form.title, description: form.description, shortDesc: form.shortDesc, icon: form.icon, features: form.features, image: form.image, price: form.price || 0, order: form.order || 0, published: form.published };
      let res;

      if (editingItem) {
        res = await fetch(`/api/services/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) { const err = await res.json(); setToast({ message: err.error || 'Failed to save', type: 'error' }); return; }

      setToast({ message: editingItem ? 'Service updated successfully' : 'Service created successfully', type: 'success' });
      setModalOpen(false);
      fetchItems();
    } catch {
      setToast({ message: 'Failed to save service', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/services/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) { setToast({ message: 'Failed to delete', type: 'error' }); return; }
      setDeleteTarget(null);
      setToast({ message: 'Service deleted', type: 'success' });
      fetchItems();
    } catch {
      setToast({ message: 'Failed to delete service', type: 'error' });
    }
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'order', header: 'Order' },
    {
      key: 'published',
      header: 'Published',
      render: (item: Service) => (
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
      <AdminTable columns={columns} data={items} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(item)} onAdd={handleAdd} title="Services" addLabel="Add Service" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem !== null ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Title</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Description</label>
            <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm resize-none`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Short Description</label>
              <input type="text" value={form.shortDesc || ''} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Price</label>
              <input type="number" step="0.01" value={form.price || 0} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Icon Name</label>
              <input type="text" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Features (comma separated)</label>
            <input type="text" value={(form.features || []).join(', ')} onChange={(e) => setForm({ ...form, features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Image URL</label>
            <input type="text" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published || false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
            <span className="text-sm text-wine/80">Published</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingItem !== null ? 'Save Changes' : 'Add Service'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Service" message="Are you sure you want to delete this service?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
