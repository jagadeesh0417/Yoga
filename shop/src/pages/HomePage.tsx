import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/product.service";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";
import { HiArrowRight } from "react-icons/hi";

const heroSlides = [
  {
    title: "Find Your Inner Peace",
    subtitle: "Premium yoga essentials for every practice",
    cta: "Shop Now",
    bg: "bg-gradient-to-r from-wine-700 via-purple-700 to-wine-800",
  },
  {
    title: "Elevate Your Practice",
    subtitle: "Handcrafted mats, apparel & accessories",
    cta: "Explore Collection",
    bg: "bg-gradient-to-r from-purple-700 via-wine-600 to-purple-800",
  },
  {
    title: "Mindful Living",
    subtitle: "Sustainable yoga gear for body & soul",
    cta: "Discover More",
    bg: "bg-gradient-to-r from-wine-800 via-purple-800 to-wine-700",
  },
];

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, newRes, bestRes] = await Promise.all([
          productService.list({ featured: "true", limit: "8" }),
          productService.list({ sort: "newest", limit: "8" }),
          productService.list({ sort: "popular", limit: "8" }),
        ]);
        setFeatured(featRes.data.products || featRes.data || []);
        setNewArrivals(newRes.data.products || newRes.data || []);
        setBestsellers(bestRes.data.products || bestRes.data || []);
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const slide = heroSlides[slideIndex];

  return (
    <div>
      <section className={`relative overflow-hidden ${slide.bg} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-44">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
              {slide.title}
            </h1>
            <p className="text-lg sm:text-xl text-ivory-200 mb-8">{slide.subtitle}</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold-400 text-wine-900 rounded-xl font-semibold hover:bg-gold-300 transition-all shadow-lg"
            >
              {slide.cta} <HiArrowRight />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === slideIndex ? "bg-gold-400 w-8" : "bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Curated just for you</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-wine-500 hover:text-wine-600 font-medium text-sm transition-colors">
            View All <HiArrowRight />
          </Link>
        </div>
        {loading ? <Loader /> : <ProductGrid products={featured} />}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/shop" className="inline-flex items-center gap-2 text-wine-500 font-medium text-sm">
            View All <HiArrowRight />
          </Link>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="bg-ivory-100 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">New Arrivals</h2>
                <p className="text-gray-500 mt-1">Fresh drops for your practice</p>
              </div>
              <Link to="/shop?sort=newest" className="hidden sm:flex items-center gap-2 text-wine-500 hover:text-wine-600 font-medium text-sm transition-colors">
                View All <HiArrowRight />
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Best Sellers</h2>
            <p className="text-gray-500 mt-1">Loved by our community</p>
          </div>
          <Link to="/shop?sort=popular" className="hidden sm:flex items-center gap-2 text-wine-500 hover:text-wine-600 font-medium text-sm transition-colors">
            View All <HiArrowRight />
          </Link>
        </div>
        {loading ? <Loader /> : <ProductGrid products={bestsellers} />}
      </section>

      <section className="bg-gradient-to-r from-wine-600 to-purple-600 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">Join the Mystic Community</h2>
          <p className="text-ivory-200 mb-8 max-w-lg mx-auto">Subscribe for exclusive offers, new arrivals, and mindful living tips.</p>
          <div className="flex max-w-md mx-auto gap-3">
            <input type="email" placeholder="Your email" className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-300" />
            <button className="px-6 py-3 bg-gold-400 text-wine-900 rounded-xl font-semibold hover:bg-gold-300 transition-all">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
