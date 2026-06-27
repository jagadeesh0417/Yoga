"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  benefits?: string[];
  specifications?: { label: string; value: string }[];
  isNew: boolean;
  createdAt: string;
  inWishlist?: boolean;
}

interface ProductCardProps {
  product: ShopProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const discount = product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Link href={`/shop/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-wine/5 shadow-wine transition-all duration-500 group-hover:shadow-xl group-hover:border-gold/20">
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-rose-light to-lavender-light">
            {discount > 0 && (
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-wine text-white text-xs font-bold shadow-lg">
                -{discount}%
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-gold text-wine text-xs font-bold shadow-lg">
                NEW
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <span className="text-white font-semibold text-sm tracking-wider uppercase bg-wine/80 px-4 py-2 rounded-full">Out of Stock</span>
              </div>
            )}
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-wine/10 flex items-center justify-center mb-2">
                    <ShoppingBag className="w-7 h-7 text-wine/40" />
                  </div>
                  <p className="text-wine/30 text-xs">{product.category}</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="p-4">
            <p className="text-xs text-wine/50 uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-serif text-lg font-bold text-wine leading-tight mb-1.5 line-clamp-2 group-hover:text-purple transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-3.5 h-3.5", i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-wine/10")} />
                ))}
              </div>
              <span className="text-xs text-wine/40">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl font-bold text-gradient-wine-purple">
                  {product.currency} {product.price}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-xs text-wine/40 line-through">
                    {product.currency} {product.compareAtPrice}
                  </span>
                )}
              </div>
              {inStock && (
                <span className={cn("text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full", lowStock ? "text-gold bg-gold/10" : "text-green-600 bg-green-50")}>
                  {lowStock ? "Low Stock" : "In Stock"}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {inStock && (
        <div className="absolute bottom-4 right-4 z-20">
          <Link
            href={`/shop/checkout?productId=${product.id}&quantity=1`}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-wine to-purple text-white shadow-lg shadow-wine/30 flex items-center justify-center hover:shadow-xl hover:brightness-110 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/60 border border-wine/5 animate-pulse">
      <div className="aspect-square bg-wine/5" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-wine/10 rounded" />
        <div className="h-5 w-full bg-wine/10 rounded" />
        <div className="h-3 w-24 bg-wine/10 rounded" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-20 bg-wine/10 rounded" />
          <div className="h-4 w-16 bg-wine/10 rounded" />
        </div>
      </div>
    </div>
  );
}
