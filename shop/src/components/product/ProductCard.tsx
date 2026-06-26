import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { wishlistService } from "../../services/wishlist.service";
import StarRating from "../common/StarRating";
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag } from "react-icons/hi";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  comparePrice?: number;
  averageRating: number;
  isNewArrival?: boolean;
  stock?: number;
}

interface Props {
  product: Product;
  inWishlist?: boolean;
  onWishlistToggle?: () => void;
}

export default function ProductCard({ product, inWishlist = false, onWishlistToggle }: Props) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    setWishlistLoading(true);
    try {
      await wishlistService.toggle(product._id);
      if (onWishlistToggle) onWishlistToggle();
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product._id);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="relative aspect-square overflow-hidden bg-ivory-100">
          {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
          {(product.isNewArrival || product.comparePrice) && (
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNewArrival && (
                <span className="px-2.5 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">New</span>
              )}
              {product.comparePrice && (
                <span className="px-2.5 py-1 bg-wine-500 text-white text-xs font-medium rounded-full">-{discount}%</span>
              )}
            </div>
          )}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          >
            {inWishlist ? (
              <HiHeart className="text-lg text-wine-500" />
            ) : (
              <HiOutlineHeart className="text-lg text-gray-600" />
            )}
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-wine-500 transition-colors">
            {product.name}
          </h3>
          <StarRating rating={product.averageRating || 0} size="sm" />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-wine-600">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-ivory-100 text-wine-600 rounded-xl hover:bg-wine-500 hover:text-white transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineShoppingBag />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="aspect-square bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
        <div className="h-5 bg-gray-100 animate-pulse rounded w-1/3" />
        <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
