'use client';

import { useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';
import { useLocalStorage } from '@/components/admin/useLocalStorage';

interface Retreat {
  title: string;
  description: string;
  location: string;
  date: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  features: string[];
  published: boolean;
}

const empty: Retreat = {
  title: '', description: '', location: '', date: '', duration: '',
  price: 0, currency: 'USD', image: '', features: [], published: true,
};

export default function AdminRetreats() {
  const { data: items, add, update, remove } = useLocalStorage<Retreat>('admin_retreats', []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Retreat>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Retreat, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleEdit = (item: Retreat) => {
    const idx = items.findIndex((r) => r.title === item.title);
    setEditingIndex(idx);
    setForm({ ...item, features: [...item.features] });
    setModalOpen(true);
    setErrors({});
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setForm({ ...empty });
    setModalOpen(true);
    setErrors({});
  };

  const validate = () => {
    const errs: Partial<Record<keyof Retreat, string>> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (form.price <= 0) errs.price = 'Price must be greater than 0';
    if (!form.date.trim()) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingIndex !== null) {
      update(editingIndex, form);
      setToast({ message: 'Retreat updated successfully', type: 'success' });
    } else {
      add(form);
      setToast({ message: 'Retreat created successfully', type: 'success' });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget !== null) {
      remove(deleteTarget);
      setDeleteTarget(null);
      setToast({ message: 'Retreat deleted', type: 'success' });
    }
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'location', header: 'Location' },
    {
      key: 'price',
      header: 'Price',
      render: (item: Retreat) => `${item.currency} ${item.price}`,
    },
    { key: 'date', header: 'Date' },
  ];

  return (
    <div className="space-y-6">
      <AdminTable columns={columns} data={items} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(items.findIndex((r) => r.title === item.title))} onAdd={handleAdd} title="Retreats" addLabel="Add Retreat" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingIndex !== null ? 'Edit Retreat' : 'Add Retreat'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.location ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.date ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" placeholder="e.g. 7 Days" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Price</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 rounded-lg border ${errors.price ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Currency</label>
              <input type="text" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Image URL</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Features (comma separated)</label>
            <input type="text" value={form.features.join(', ')} onChange={(e) => setForm({ ...form, features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
            <span className="text-sm text-wine/80">Published</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingIndex !== null ? 'Save Changes' : 'Add Retreat'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Retreat" message="Are you sure you want to delete this retreat?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
