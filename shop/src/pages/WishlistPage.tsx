import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wishlistService } from "../services/wishlist.service";
import ProductGrid from "../components/product/ProductGrid";
import Breadcrumb from "../components/common/Breadcrumb";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { HiOutlineHeart } from "react-icons/hi";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await wishlistService.get();
      setProducts(res.data.products || res.data.wishlist?.products || res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const wishlistIds = products.map((p: any) => p._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[{ label: "My Wishlist" }]} />
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-8">My Wishlist</h1>

      {error ? (
        <ErrorMessage message={error} onRetry={fetchWishlist} />
      ) : loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<HiOutlineHeart />}
          title="Your wishlist is empty"
          message="Save your favorite products for later."
          action={{ label: "Browse Products", onClick: () => navigate("/shop") }}
        />
      ) : (
        <ProductGrid
          products={products}
          wishlistIds={wishlistIds}
          onWishlistToggle={fetchWishlist}
        />
      )}
    </div>
  );
}
