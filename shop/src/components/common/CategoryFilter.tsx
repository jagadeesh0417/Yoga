import { useState, useEffect } from "react";
import { categoryService } from "../../services/category.service";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  selected: string[];
  onChange: (slugs: string[]) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .list()
      .then((res) => setCategories(res.data.categories || res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  if (loading) {
    return (
      <div>
        <h4 className="font-serif text-lg text-wine-700 mb-3">Categories</h4>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-serif text-lg text-wine-700 mb-3">Categories</h4>
      <div className="space-y-2">
        {categories.map((cat) => (
          <label key={cat._id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-wine-600 transition-colors">
            <input
              type="checkbox"
              checked={selected.includes(cat.slug)}
              onChange={() => toggle(cat.slug)}
              className="accent-wine-500 rounded"
            />
            {cat.name}
          </label>
        ))}
      </div>
    </div>
  );
}
