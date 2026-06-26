"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Filter } from "lucide-react";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import ProductCard, { ProductCardSkeleton, type ShopProduct } from "@/components/shop/ProductCard";
import MagneticButton from "@/components/animations/MagneticButton";
import { shopApi } from "@/lib/shop-api";

export default function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([shopApi.getProducts(), shopApi.getCategories()]).then(([prodRes, catRes]) => {
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "all" || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featured = products.filter((p) => p.tags.includes("featured"));
  const newArrivals = products.filter((p) => p.isNew);
  const bestSellers = products.filter((p) => p.tags.includes("bestseller"));

  const handleToggleWishlist = async (product: ShopProduct) => {
    try {
      await shopApi.toggleWishlist(product.id);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, inWishlist: !p.inWishlist } : p)));
    } catch { /* ignore */ }
  };

  const handleAddToCart = async (product: ShopProduct) => {
    try {
      await shopApi.addToCart(product.id, 1);
    } catch { /* ignore */ }
  };

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden gradient-primary py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.svg')] bg-center opacity-[0.03] animate-mandala" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple/10 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-gold text-xs tracking-widest uppercase mb-6">
              <ShoppingBag size={14} />
              Premium Wellness Products
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mb-4"
          >
            MYSTIC YOGA Shop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-ivory/70 text-lg max-w-xl mx-auto"
          >
            Premium wellness products for your practice
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wine/40" />
            <input
              type="text" placeholder="Search products..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-wine/10 text-wine text-sm placeholder:text-wine/30 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-none">
            <Filter className="w-4 h-4 text-wine/40 shrink-0" />
            {[{ id: "all", name: "All", slug: "all" }, ...categories.filter((c) => c.slug !== "all")].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                  activeCategory === cat.slug
                    ? "bg-gradient-to-r from-wine to-purple text-white shadow-md"
                    : "bg-white/50 text-wine/60 hover:text-wine hover:bg-white border border-wine/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-wine/30" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-wine mb-2">No products found</h3>
            <p className="text-wine/50 mb-6 max-w-md mx-auto">
              {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "We're restocking our shop with premium wellness products. Please check back soon."}
            </p>
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-wine to-purple text-white text-sm font-medium shadow-lg">
                Clear filters
              </button>
            )}
          </motion.div>
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 pb-12">
              <SectionTitle title="Featured Products" align="left" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featured.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </section>
          )}

          {newArrivals.length > 0 && (
            <section className="bg-gradient-to-r from-rose-light/50 to-lavender-light/50 py-12">
              <div className="max-w-7xl mx-auto px-4">
                <SectionTitle title="New Arrivals" subtitle="Fresh additions to elevate your practice" align="left" />
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
                  {newArrivals.map((product, i) => (
                    <div key={product.id} className="min-w-[260px] sm:min-w-[280px] snap-start">
                      <ProductCard product={product} index={i} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {bestSellers.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 pb-20 pt-12">
              <SectionTitle title="Best Sellers" subtitle="Most loved by our community" align="left" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {bestSellers.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </section>
          )}

          <section className="max-w-7xl mx-auto px-4 pb-20">
            <SectionTitle title="All Products" align="left" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </section>
        </>
      )}

      <section className="gradient-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-3xl md:text-4xl font-bold text-ivory mb-4">
            Join Our Wellness Community
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="text-ivory/70 mb-8 max-w-lg mx-auto">
            Subscribe for exclusive offers, new product launches, and wellness tips delivered to your inbox.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <MagneticButton>
              <Link href="/shop/register" className="inline-block px-8 py-3 rounded-full bg-gold text-wine font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-gold/30 transition-all">
                Create Account
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
