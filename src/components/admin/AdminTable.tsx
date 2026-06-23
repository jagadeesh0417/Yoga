'use client';

import { Pencil, Trash2, Plus } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onAdd: () => void;
  title: string;
  addLabel?: string;
}

export default function AdminTable<T extends { [key: string]: any }>({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  title,
  addLabel = 'Add New',
}: AdminTableProps<T>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-gradient-wine-purple">{title}</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-wine to-purple text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-wine/5 border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 font-semibold text-wine/70 text-xs uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              <th className="text-right px-4 py-3 font-semibold text-wine/70 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-12 text-center text-wine/50"
                >
                    No items found. Click &ldquo;{addLabel}&rdquo; to create one.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-wine/5 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-wine/80">
                      {col.render
                        ? col.render(item)
                        : item[col.key]?.toString() || '-'}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg hover:bg-gold/20 text-gold transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
