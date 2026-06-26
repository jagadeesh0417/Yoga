"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { shopApi } from "@/lib/shop-api";
import ProductCard, { ProductCardSkeleton, type ShopProduct } from "@/components/shop/ProductCard";
import MagneticButton from "@/components/animations/MagneticButton";

export default function WishlistPage() {
  const [items, setItems] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopApi.getWishlist().then((res) => {
      setItems((res.items || []).map((i: ShopProduct) => ({ ...i, inWishlist: true })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleToggleWishlist = async (product: ShopProduct) => {
    try {
      await shopApi.toggleWishlist(product.id);
      setItems((prev) => prev.filter((p) => p.id !== product.id));
    } catch { /* ignore */ }
  };

  const handleAddToCart = async (product: ShopProduct) => {
    try {
      await shopApi.addToCart(product.id, 1);
    } catch { /* ignore */ }
  };

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple">My Wishlist</h1>
            <p className="text-sm text-wine/50 mt-1">{items.length} items saved</p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-wine/50 hover:text-wine transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-wine/30" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-wine mb-2">Your Wishlist is Empty</h2>
            <p className="text-wine/60 mb-8 max-w-md mx-auto">Save your favorite products by tapping the heart icon and come back to them anytime.</p>
            <MagneticButton>
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg">
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </Link>
            </MagneticButton>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
