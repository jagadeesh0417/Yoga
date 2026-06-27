'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Star, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  featured: boolean;
  order: number;
}

const categories = ['Yoga Classes', 'Retreats', 'Events', 'Studio', 'Teachers'];

export default function AdminGallery() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Yoga Classes', image: '', featured: false });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function fetchItems() {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setForm({ title: item.title, category: item.category, image: item.image, featured: item.featured });
    setModalOpen(true);
    setErrors({});
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ title: '', category: 'Yoga Classes', image: '', featured: false });
    setModalOpen(true);
    setErrors({});
  };

  const validate = () => {
    const errs: Partial<Record<string, string>> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let res;

      if (editingItem) {
        res = await fetch(`/api/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, order: items.length }),
        });
      }

      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) { setToast({ message: 'Failed to save', type: 'error' }); return; }

      setToast({ message: editingItem ? 'Gallery image updated' : 'Gallery image added', type: 'success' });
      setModalOpen(false);
      fetchItems();
    } catch {
      setToast({ message: 'Failed to save gallery image', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.status === 401) { router.replace('/admin'); return; }
      setDeleteTarget(null);
      setToast({ message: 'Gallery image deleted', type: 'success' });
      fetchItems();
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' });
    }
  };

  const placeholderStyle = (idx: number) => {
    const colors = [
      'bg-gradient-to-br from-wine/20 to-gold/20',
      'bg-gradient-to-br from-gold/20 to-wine/10',
      'bg-gradient-to-br from-purple/10 to-gold/15',
      'bg-gradient-to-br from-wine/15 to-purple/5',
    ];
    return colors[idx % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory to-beige/30 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-gradient-wine-purple">Gallery</h2>
          <p className="text-wine/50 text-sm mt-1">Manage your gallery images</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-wine to-purple text-white rounded-lg hover:bg-wine/90 transition-colors text-sm font-medium">
          <Plus size={16} /> Add Image
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gold/30 rounded-2xl">
          <ImageIcon size={48} className="mx-auto text-gold/40 mb-4" />
          <p className="text-wine/50 text-sm">No gallery images yet. Click &ldquo;Add Image&rdquo; to upload.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all">
              {item.image ? (
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
              ) : (
                <div className={`aspect-[4/3] ${placeholderStyle(idx)} flex items-center justify-center`}>
                  <ImageIcon size={32} className="text-gold/40" />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium text-wine truncate">{item.title}</p>
                <p className="text-xs text-wine/50 mt-0.5">{item.category}</p>
              </div>
              {item.featured && <Star size={14} className="absolute top-2 right-2 fill-gold text-gold" />}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => handleEdit(item)} className="p-2 rounded-full bg-white/90 text-wine hover:bg-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingItem !== null ? 'Edit Gallery Image' : 'Add Gallery Image'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Image URL</label>
            <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" placeholder="https://..." />
            {form.image && (
              <div className="mt-2 aspect-[4/3] rounded-lg bg-cover bg-center border border-gold/20" style={{ backgroundImage: `url(${form.image})` }} />
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
            <span className="text-sm text-wine/80">Featured</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingItem !== null ? 'Save Changes' : 'Add Image'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Image" message="Are you sure you want to delete this gallery image?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
