"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Star, ChevronRight, Check, Truck, Shield, RotateCcw, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { shopApi } from "@/lib/shop-api";
import ProductCard from "@/components/shop/ProductCard";
import type { ShopProduct } from "@/components/shop/ProductCard";
import MagneticButton from "@/components/animations/MagneticButton";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [related, setRelated] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;
    shopApi.getProduct(slug).then((res) => {
      setProduct(res.product || null);
      setRelated(res.related || []);
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [slug]);

  const handleBuyNow = () => {
    if (!product) return;
    router.push(`/checkout?product=${product.id}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-4 w-64 bg-wine/10 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-wine/5 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 w-24 bg-wine/10 rounded" />
              <div className="h-8 w-3/4 bg-wine/10 rounded" />
              <div className="h-6 w-32 bg-wine/10 rounded" />
              <div className="h-20 w-full bg-wine/5 rounded" />
              <div className="h-12 w-full bg-wine/10 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-light flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-wine/30" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-wine mb-3">Product Not Found</h1>
          <p className="text-wine/60 mb-8">The product you are looking for does not exist or has been removed.</p>
          <MagneticButton>
            <Link href="/shop" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg">
              Back to Shop
            </Link>
          </MagneticButton>
        </div>
      </main>
    );
  }

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const discount = product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const images = product.images.length > 0 ? product.images : ["/images/shop/placeholder.jpg"];

  return (
    <main className="min-h-screen">
      <div className="bg-white/50 border-b border-wine/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-wine/50">
            <Link href="/" className="hover:text-wine transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-wine transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-wine/80 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-rose-light to-lavender-light border border-wine/5 group">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-wine text-white text-sm font-bold shadow-lg">-{discount}%</div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-gold text-wine text-sm font-bold shadow-lg">NEW</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn("relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0", selectedImage === i ? "border-wine shadow-md" : "border-transparent opacity-60 hover:opacity-100")}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <p className="text-xs text-wine/50 uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-wine mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-wine/10")} />
                ))}
              </div>
              <span className="text-sm text-wine/50">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-4xl font-bold text-gradient-wine-purple">
                {product.currency} {product.price}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-lg text-wine/40 line-through">{product.currency} {product.compareAtPrice}</span>
              )}
            </div>

            <div className="mb-6">
              {inStock ? (
                <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium", lowStock ? "bg-gold/10 text-gold" : "bg-green-50 text-green-600")}>
                  <Check className="w-3 h-3" />
                  {lowStock ? `Only ${product.stock} left in stock` : "In Stock"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose text-wine/60 text-xs font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-wine/70 leading-relaxed mb-8">{product.description}</p>

            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-lg font-bold text-wine mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-wine/70">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-lg font-bold text-wine mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="bg-white/50 backdrop-blur-sm rounded-xl border border-wine/5 p-3">
                      <p className="text-[10px] text-wine/40 uppercase tracking-wider mb-0.5">{spec.label}</p>
                      <p className="text-sm font-medium text-wine">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-wine/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!inStock}
                  className="w-10 h-10 flex items-center justify-center text-wine hover:bg-wine/5 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-wine">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={!inStock || quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-wine hover:bg-wine/5 disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-wine to-purple text-white font-medium text-sm shadow-lg shadow-wine/20 hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Shipping", sub: "on orders over $50" },
                { icon: Shield, label: "Secure Checkout", sub: "SSL encrypted" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
              ].map((item, i) => (
                <div key={i} className="bg-white/50 backdrop-blur-sm rounded-xl border border-wine/5 p-3 text-center">
                  <item.icon className="w-4 h-4 text-gold mx-auto mb-1" />
                  <p className="text-xs font-medium text-wine">{item.label}</p>
                  <p className="text-[10px] text-wine/40">{item.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-gradient-to-r from-rose-light/30 to-lavender-light/30 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gradient-wine-purple mb-8">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
