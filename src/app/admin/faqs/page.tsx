'use client';

import { useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Toast from '@/components/admin/Toast';
import { useLocalStorage } from '@/components/admin/useLocalStorage';
import { faqs as defaultFaqs } from '@/lib/data';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

const categories = ['Classes', 'Booking', 'Corporate', 'Membership', 'General'];

const empty: FAQ = { question: '', answer: '', category: 'General', order: 0, published: true };

export default function AdminFAQ() {
  const { data: items, add, update, remove } = useLocalStorage<FAQ>('admin_faqs', defaultFaqs as FAQ[]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<FAQ>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FAQ, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleEdit = (item: FAQ) => {
    const idx = items.findIndex((f) => f.question === item.question);
    setEditingIndex(idx);
    setForm({ ...item });
    setModalOpen(true);
    setErrors({});
  };

  const handleAdd = () => {
    setEditingIndex(null);
    setForm({ ...empty, order: items.length + 1 });
    setModalOpen(true);
    setErrors({});
  };

  const validate = () => {
    const errs: Partial<Record<keyof FAQ, string>> = {};
    if (!form.question.trim()) errs.question = 'Question is required';
    if (!form.answer.trim()) errs.answer = 'Answer is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingIndex !== null) {
      update(editingIndex, form);
      setToast({ message: 'FAQ updated successfully', type: 'success' });
    } else {
      add(form);
      setToast({ message: 'FAQ created successfully', type: 'success' });
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget !== null) {
      remove(deleteTarget);
      setDeleteTarget(null);
      setToast({ message: 'FAQ deleted', type: 'success' });
    }
  };

  const columns = [
    {
      key: 'question',
      header: 'Question',
      render: (item: FAQ) => (
        <div className="max-w-xs truncate">{item.question}</div>
      ),
    },
    { key: 'category', header: 'Category' },
    { key: 'order', header: 'Order' },
    {
      key: 'published',
      header: 'Published',
      render: (item: FAQ) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-wine/5 text-wine/50'}`}>
          {item.published ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminTable columns={columns} data={items} onEdit={handleEdit} onDelete={(item) => setDeleteTarget(items.findIndex((f) => f.question === item.question))} onAdd={handleAdd} title="FAQs" addLabel="Add FAQ" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingIndex !== null ? 'Edit FAQ' : 'Add FAQ'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Question</label>
            <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.question ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm`} />
            {errors.question && <p className="text-xs text-red-500 mt-1">{errors.question}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-wine/80 mb-1">Answer</label>
            <textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={`w-full px-3 py-2 rounded-lg border ${errors.answer ? 'border-red-300 bg-red-50' : 'border-gold/30'} focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm resize-none`} />
            {errors.answer && <p className="text-xs text-red-500 mt-1">{errors.answer}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-wine/80 mb-1">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-wine/20 text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gold/30 text-wine focus:ring-wine/20" />
            <span className="text-sm text-wine/80">Published</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-wine/10 text-wine/70 hover:bg-wine/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-wine to-purple text-white hover:from-wine-dark hover:to-purple-dark transition-colors text-sm font-medium">{editingIndex !== null ? 'Save Changes' : 'Add FAQ'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete FAQ" message="Are you sure you want to delete this FAQ?" />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
