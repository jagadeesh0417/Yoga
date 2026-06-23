'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  readTime: string;
  createdAt: string;
}

const emptyPost: Partial<BlogPost> = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  tags: [],
  published: false,
  featured: false,
  readTime: '',
};

export default function AdminBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>(emptyPost);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function loadBlogs() {
    try {
      const res = await fetch('/api/blog');
      if (res.status === 401) { router.replace('/admin'); return; }
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

  const handleEdit = (item: BlogPost) => {
    setEditingId(item.id);
    setForm({ ...item, tags: item.tags || [] });
    setModalOpen(true);
    setErrors({});
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({ ...emptyPost });
    setModalOpen(true);
    setErrors({});
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (title: string) => {
    if (editingId === null) {
      setForm((prev) => ({ ...prev, title, slug: generateSlug(title) }));
    } else {
      setForm((prev) => ({ ...prev, title }));
    }
  };

  const validate = () => {
    const errs: Partial<Record<string, string>> = {};
    if (!form.title?.trim()) errs.title = 'Title is required';
    if (!form.excerpt?.trim()) errs.excerpt = 'Excerpt is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const body = {
        title: form.title,
        content: form.content || '',
        excerpt: form.excerpt,
        image: form.image || '',
        tags: form.tags || [],
        published: form.published || false,
        featured: form.featured || false,
        readTime: form.readTime || '',
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/blog/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.status === 401) { router.replace('/admin'); return; }

      if (!res.ok) {
        const errData = await res.json();
        setToast({ message: errData.error || 'Failed to save', type: 'error' });
        return;
      }

      setToast({ message: editingId ? 'Blog post updated successfully' : 'Blog post created successfully', type: 'success' });
      setModalOpen(false);
      loadBlogs();
    } catch {
      setToast({ message: 'Failed to save blog post', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/blog/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.status === 401) { router.replace('/admin'); return; }
      if (!res.ok) {
        setToast({ message: 'Failed to delete', type: 'error' });
        return;
      }
      setDeleteTarget(null);
      setToast({ message: 'Blog post deleted', type: 'success' });
      loadBlogs();
    } catch {
      setToast({ message: 'Failed to delete blog post', type: 'error' });
    }
  };

  const columns = [
    { key: 'title', header: 'Title', render: (item: BlogPost) => <div className="max-w-xs truncate">{item.title}</div> },
    { key: 'tags', header: 'Tags', render: (item: BlogPost) => (item.tags?.length ? item.tags.join(', ') : '-') },
    { key: 'createdAt', header: 'Date', render: (item: BlogPost) => new Date(item.createdAt).toLocaleDateString() },
    {
      key: 'published',
      header: 'Published',
      render: (item: BlogPost) => (
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
    <div className="min-h-screen bg-gradient-to-br from-ivory to-beige/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-wine/60 hover:text-wine transition-colors text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <AdminTable columns={columns} data={blogs} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(item)} onAdd={handleAdd} title="Blog Posts" addLabel="Add Post" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId !== null ? 'Edit Blog Post' : 'Add Blog Post'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Title</label>
            <input type="text" value={form.title || ''} onChange={(e) => handleTitleChange(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Excerpt</label>
            <textarea rows={2} value={form.excerpt || ''} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.excerpt ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm resize-none`} />
            {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Content</label>
            <textarea rows={5} value={form.content || ''} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Tags (comma separated)</label>
              <input type="text" value={(form.tags || []).join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Read Time</label>
              <input type="text" value={form.readTime || ''} onChange={(e) => setForm({ ...form, readTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" placeholder="e.g. 5 min" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Image URL</label>
            <input type="text" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published || false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
              <span className="text-sm text-wine/80">Featured</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingId !== null ? 'Save Changes' : 'Create Post'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Blog Post" message="Are you sure you want to delete this blog post? This action cannot be undone." />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
