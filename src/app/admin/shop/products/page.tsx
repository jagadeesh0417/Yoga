'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';
import { generateId } from '@/lib/utils';

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

const categories = ['Wellness Products'];

const empty: Partial<Product> = {
  name: '',
  description: '',
  category: categories[0],
  price: 0,
  comparePrice: null,
  stock: 10,
  image: '',
  featured: false,
  bestSeller: false,
  newArrival: false,
  tags: [],
  active: true,
};

const seedProducts: Product[] = [
  { id: generateId(), name: 'Quantum Cure™', description: 'Premium concentrated black water crafted for individuals who seek elevated living, vitality, and sophistication.', category: 'Wellness Products', price: 39900, comparePrice: 49900, stock: 100, image: '/images/product1.png', featured: true, bestSeller: false, newArrival: true, tags: ['premium', 'black-water', 'wellness'], active: true, createdAt: new Date().toISOString() },
];

function loadProducts(): Product[] {
  const stored = localStorage.getItem('shop_products');
  if (stored) {
    try { return JSON.parse(stored); } catch { return []; }
  }
  localStorage.setItem('shop_products', JSON.stringify(seedProducts));
  console.log('[shop_products] Seeded with', seedProducts.length, 'products');
  return seedProducts;
}

function saveProducts(items: Product[]) {
  localStorage.setItem('shop_products', JSON.stringify(items));
  console.log('[shop_products] Saved', items.length, 'products');
}

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(empty);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setItems(loadProducts());
    setLoading(false);
  }, []);

  const handleEdit = (item: Product) => {
    setEditingItem(item);
    setForm({ ...item, tags: [...item.tags] });
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
    if (!form.description?.trim()) errs.description = 'Description is required';
    if (!form.price || form.price <= 0) errs.price = 'Valid price is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editingItem) {
      const updated = items.map((p) =>
        p.id === editingItem.id
          ? { ...p, ...form }
          : p
      );
      setItems(updated);
      saveProducts(updated);
      setToast({ message: 'Product updated successfully', type: 'success' });
    } else {
      const newItem: Product = {
        id: generateId(),
        name: form.name || '',
        description: form.description || '',
        category: form.category || categories[0],
        price: form.price || 0,
        comparePrice: form.comparePrice || null,
        stock: form.stock ?? 10,
        image: form.image || '',
        featured: form.featured || false,
        bestSeller: form.bestSeller || false,
        newArrival: form.newArrival || false,
        tags: (form.tags as string[]) || [],
        active: form.active ?? true,
        createdAt: new Date().toISOString(),
      };
      const updated = [...items, newItem];
      setItems(updated);
      saveProducts(updated);
      setToast({ message: 'Product created successfully', type: 'success' });
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const updated = items.filter((p) => p.id !== deleteTarget.id);
    setItems(updated);
    saveProducts(updated);
    setDeleteTarget(null);
    setToast({ message: 'Product deleted', type: 'success' });
  };

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (item: Product) => (
        <div className="w-10 h-10 rounded-lg bg-ivory flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Package size={16} className="text-wine/30" />
          )}
        </div>
      ),
    },
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category' },
    {
      key: 'price',
      header: 'Price',
      render: (item: Product) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-wine">₹{item.price.toLocaleString('en-IN')}</span>
          {item.comparePrice && (
            <span className="text-xs text-wine/40 line-through">₹{item.comparePrice.toLocaleString('en-IN')}</span>
          )}
        </div>
      ),
    },
    { key: 'stock', header: 'Stock' },
    {
      key: 'active',
      header: 'Status',
      render: (item: Product) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.active ? 'bg-emerald-50 text-emerald-700' : 'bg-wine/5 text-wine/50'}`}>
          {item.active ? 'Active' : 'Inactive'}
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
        <h2 className="text-2xl font-serif text-gradient-wine-purple">Products</h2>
        <p className="text-wine/50 text-sm mt-1">Manage your product catalog</p>
      </div>

      <AdminTable columns={columns} data={items} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(item)} onAdd={handleAdd} title="Products" addLabel="Add Product" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Name *</label>
            <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Description *</label>
            <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm resize-none`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Category *</label>
              <select value={form.category || categories[0]} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm bg-white">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Price *</label>
              <input type="number" step="1" value={form.price || 0} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className={`w-full px-3 py-2 rounded-lg border ${errors.price ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Compare Price (for sale badge)</label>
              <input type="number" step="1" value={form.comparePrice || ''} onChange={(e) => setForm({ ...form, comparePrice: e.target.value ? parseFloat(e.target.value) : null })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Stock</label>
              <input type="number" value={form.stock ?? 10} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Image URL</label>
            <input type="text" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Tags (comma separated)</label>
            <input type="text" value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.bestSeller || false} onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.newArrival || false} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">Active</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingItem ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Product" message="Are you sure you want to delete this product?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
