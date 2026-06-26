'use client';

import { useState, useEffect } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';
import { generateId } from '@/lib/utils';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

const empty: Partial<Coupon> = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscount: null,
  usageLimit: 100,
  usedCount: 0,
  expiresAt: '',
  isActive: true,
};

const seedCoupons: Coupon[] = [
  {
    id: generateId(),
    code: 'WELCOME10',
    description: '10% off for new customers',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscount: 500,
    usageLimit: 100,
    usedCount: 15,
    expiresAt: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    code: 'YOGA100',
    description: 'Flat ₹100 off on orders above ₹999',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 999,
    maxDiscount: null,
    usageLimit: 50,
    usedCount: 8,
    expiresAt: new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

function loadCoupons(): Coupon[] {
  const stored = localStorage.getItem('shop_coupons');
  if (stored) {
    try { return JSON.parse(stored); } catch { return []; }
  }
  localStorage.setItem('shop_coupons', JSON.stringify(seedCoupons));
  console.log('[shop_coupons] Seeded with', seedCoupons.length, 'coupons');
  return seedCoupons;
}

function saveCoupons(items: Coupon[]) {
  localStorage.setItem('shop_coupons', JSON.stringify(items));
  console.log('[shop_coupons] Saved', items.length, 'coupons');
}

export default function AdminCoupons() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>(empty);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setItems(loadCoupons());
    setLoading(false);
  }, []);

  const handleEdit = (item: Coupon) => {
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
    if (!form.code?.trim()) errs.code = 'Code is required';
    if (!form.discountValue || form.discountValue <= 0) errs.discountValue = 'Valid discount value is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editingItem) {
      const updated = items.map((c) =>
        c.id === editingItem.id ? { ...c, ...form } : c
      );
      setItems(updated);
      saveCoupons(updated);
      setToast({ message: 'Coupon updated successfully', type: 'success' });
    } else {
      const newItem: Coupon = {
        id: generateId(),
        code: (form.code || '').toUpperCase(),
        description: form.description || '',
        discountType: form.discountType || 'percentage',
        discountValue: form.discountValue || 0,
        minOrderAmount: form.minOrderAmount || 0,
        maxDiscount: form.maxDiscount || null,
        usageLimit: form.usageLimit ?? 100,
        usedCount: 0,
        expiresAt: form.expiresAt || '',
        isActive: form.isActive ?? true,
        createdAt: new Date().toISOString(),
      };
      const updated = [...items, newItem];
      setItems(updated);
      saveCoupons(updated);
      setToast({ message: 'Coupon created successfully', type: 'success' });
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const updated = items.filter((c) => c.id !== deleteTarget.id);
    setItems(updated);
    saveCoupons(updated);
    setDeleteTarget(null);
    setToast({ message: 'Coupon deleted', type: 'success' });
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (item: Coupon) => (
        <span className="font-mono font-bold text-wine bg-gold/10 px-2 py-0.5 rounded text-xs">{item.code}</span>
      ),
    },
    {
      key: 'discountValue',
      header: 'Discount',
      render: (item: Coupon) => (
        <span className="font-medium text-wine">
          {item.discountType === 'percentage' ? `${item.discountValue}%` : `₹${item.discountValue}`}
          {item.discountType === 'percentage' && item.maxDiscount && <span className="text-xs text-wine/40 ml-1">(max ₹{item.maxDiscount})</span>}
        </span>
      ),
    },
    {
      key: 'minOrderAmount',
      header: 'Min Order',
      render: (item: Coupon) => (
        <span className="text-wine">{item.minOrderAmount > 0 ? `₹${item.minOrderAmount.toLocaleString('en-IN')}` : '—'}</span>
      ),
    },
    {
      key: 'usedCount',
      header: 'Uses',
      render: (item: Coupon) => (
        <span className="text-wine">{item.usedCount}/{item.usageLimit}</span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item: Coupon) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-wine/5 text-wine/50'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (item: Coupon) => (
        <span className={`text-xs ${item.expiresAt && new Date(item.expiresAt) < new Date() ? 'text-red-500' : 'text-wine/50'}`}>
          {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-gradient-wine-purple">Coupons</h2>
        <p className="text-wine/50 text-sm mt-1">Manage discount coupons</p>
      </div>

      <AdminTable columns={columns} data={items} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(item)} onAdd={handleAdd} title="Coupons" addLabel="Add Coupon" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Coupon' : 'Add Coupon'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Code *</label>
              <input
                type="text"
                value={form.code || ''}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 rounded-lg border font-mono uppercase ${errors.code ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`}
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Discount Type</label>
              <select value={form.discountType || 'percentage'} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm bg-white">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Description</label>
            <input type="text" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Discount Value *</label>
              <input type="number" step="1" value={form.discountValue || 0} onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 rounded-lg border ${errors.discountValue ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
              {errors.discountValue && <p className="text-xs text-red-500 mt-1">{errors.discountValue}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Min Order Amount</label>
              <input type="number" step="1" value={form.minOrderAmount || 0} onChange={(e) => setForm({ ...form, minOrderAmount: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Max Discount (for percentage)</label>
              <input type="number" step="1" value={form.maxDiscount || ''} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value ? parseFloat(e.target.value) : null })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Usage Limit</label>
              <input type="number" value={form.usageLimit ?? 100} onChange={(e) => setForm({ ...form, usageLimit: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Expires At</label>
            <input type="date" value={form.expiresAt || ''} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
            <span className="text-sm text-wine/80">Is Active</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingItem ? 'Save Changes' : 'Add Coupon'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Coupon" message="Are you sure you want to delete this coupon?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
