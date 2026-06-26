import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/product.service";
import ProductGrid from "../components/product/ProductGrid";
import SearchBar from "../components/common/SearchBar";
import CategoryFilter from "../components/common/CategoryFilter";
import PriceFilter from "../components/common/PriceFilter";
import SortSelect from "../components/common/SortSelect";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import Breadcrumb from "../components/common/Breadcrumb";
import { HiOutlineFilter, HiX } from "react-icons/hi";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const search = searchParams.get("search") || "";
  const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.set("page", "1");
    setSearchParams(params);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { page: String(page), limit: "12" };
      if (search) params.search = search;
      if (categories.length) params.categories = categories.join(",");
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;
      const res = await productService.list(params);
      const data = res.data;
      setProducts(data.products || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 12) || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, categories, minPrice, maxPrice, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (search) activeFilters.push({ label: `"${search}"`, onRemove: () => { const p = new URLSearchParams(searchParams); p.delete("search"); setSearchParams(p); } });
  if (categories.length) activeFilters.push({ label: `${categories.length} categories`, onRemove: () => { const p = new URLSearchParams(searchParams); p.delete("categories"); setSearchParams(p); } });
  if (minPrice || maxPrice) activeFilters.push({ label: `$${minPrice || "0"} - $${maxPrice || "∞"}`, onRemove: () => { const p = new URLSearchParams(searchParams); p.delete("minPrice"); p.delete("maxPrice"); setSearchParams(p); } });

  const FilterContent = () => (
    <div className="space-y-8">
      <CategoryFilter
        selected={categories}
        onChange={(vals) => updateParam("categories", vals.join(","))}
      />
      <PriceFilter
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinChange={(v) => updateParam("minPrice", v)}
        onMaxChange={(v) => updateParam("maxPrice", v)}
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[{ label: "Shop" }]} />

      <div className="mb-6">
        <SearchBar value={search} onChange={(v) => updateParam("search", v)} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-wine-300 transition-colors"
        >
          <HiOutlineFilter /> Filters
        </button>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-3">
          <SortSelect value={sort} onChange={(v) => updateParam("sort", v)} />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activeFilters.map((f, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory-100 text-gray-700 rounded-full text-sm">
              {f.label}
              <button onClick={f.onRemove} className="text-gray-400 hover:text-red-500"><HiX /></button>
            </span>
          ))}
          <button
            onClick={() => setSearchParams({})}
            className="text-xs text-gray-500 hover:text-wine-500 underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterContent />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {error ? (
            <ErrorMessage message={error} onRetry={fetchProducts} />
          ) : loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try adjusting your filters or search terms."
              action={{ label: "Clear Filters", onClick: () => setSearchParams({}) }}
            />
          ) : (
            <>
              <ProductGrid products={products} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => updateParam("page", String(p))} />
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-gray-800">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <HiX className="text-xl" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
