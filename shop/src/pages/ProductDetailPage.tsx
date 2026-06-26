import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/product.service";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { wishlistService } from "../services/wishlist.service";
import Breadcrumb from "../components/common/Breadcrumb";
import StarRating from "../components/common/StarRating";
import QuantitySelector from "../components/common/QuantitySelector";
import ProductZoom from "../components/product/ProductZoom";
import ReviewCard from "../components/product/ReviewCard";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiCheck } from "react-icons/hi";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  comparePrice?: number;
  description: string;
  benefits?: string[];
  specifications?: { label: string; value: string }[];
  averageRating: number;
  numReviews: number;
  stock: number;
  isNewArrival?: boolean;
  category?: { name: string; slug: string };
  reviews?: any[];
  relatedProducts?: any[];
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    productService
      .getBySlug(slug)
      .then((res) => {
        const p = res.data.product || res.data;
        setProduct(p);
        if (p.images?.length) setSelectedImage(0);
      })
      .catch((err) => setError(err.response?.data?.message || "Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleWishlist = async () => {
    if (!user) { toast.error("Please login to use wishlist"); return; }
    if (!product) return;
    try {
      await wishlistService.toggle(product._id);
      setInWishlist(!inWishlist);
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch { toast.error("Failed"); }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product._id, quantity);
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12"><Loader /></div>;
  if (error || !product) return <div className="max-w-7xl mx-auto px-4 py-12"><ErrorMessage message={error || "Product not found"} /></div>;

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const stockStatus = product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock";
  const stockColor = product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-orange-500" : "text-red-500";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[
        { label: "Shop", to: "/shop" },
        ...(product.category ? [{ label: product.category.name, to: `/shop?categories=${product.category.slug}` }] : []),
        { label: product.name },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div>
          <ProductZoom src={product.images?.[selectedImage] || "/placeholder.svg"} alt={product.name} />
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? "border-wine-500" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.averageRating || 0} size="md" showValue />
            <span className="text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl lg:text-3xl font-bold text-wine-600">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
            {discount > 0 && <span className="px-2.5 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">-{discount}% OFF</span>}
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className={`text-sm font-medium ${stockColor}`}>{stockStatus}</span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-gray-500">(Only {product.stock} left)</span>
            )}
          </div>
          {product.isNewArrival && (
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full mb-4">New Arrival</span>
          )}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="font-serif font-bold text-gray-800 mb-3">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <HiCheck className="text-green-500 mt-0.5 flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-6">
              <h3 className="font-serif font-bold text-gray-800 mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.specifications.map((s, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-gray-500">{s.label}:</span>{" "}
                    <span className="font-medium text-gray-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <QuantitySelector value={quantity} min={1} max={product.stock} onChange={setQuantity} />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-wine-500 text-white rounded-xl font-medium hover:bg-wine-600 disabled:opacity-50 transition-all shadow-sm"
            >
              <HiOutlineShoppingBag className="text-lg" /> Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-xl border transition-all ${inWishlist ? "border-wine-200 bg-wine-50 text-wine-500" : "border-gray-200 text-gray-400 hover:text-wine-500 hover:border-wine-300"}`}
            >
              {inWishlist ? <HiHeart className="text-xl" /> : <HiOutlineHeart className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </section>
      )}

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Related Products</h2>
          <ProductGrid products={product.relatedProducts} />
        </section>
      )}
    </div>
  );
}
