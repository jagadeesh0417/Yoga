import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/common/EmptyState";
import Breadcrumb from "../components/common/Breadcrumb";
import Loader from "../components/common/Loader";
import { HiOutlineShoppingBag, HiArrowLeft } from "react-icons/hi";

export default function CartPage() {
  const { items, isLoading, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleCouponApply = (code: string) => {
    setCouponCode(code);
    setCouponDiscount(subtotal * 0.1);
  };

  const discount = couponDiscount || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><Loader /></div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={<HiOutlineShoppingBag />}
          title="Your cart is empty"
          message="Looks like you haven't added any products yet."
          action={{ label: "Continue Shopping", onClick: () => navigate("/shop") }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[{ label: "Cart" }]} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Clear Cart</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
            {items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-wine-500 hover:text-wine-600 font-medium mt-6 transition-colors">
            <HiArrowLeft /> Continue Shopping
          </Link>
        </div>
        <div>
          <CartSummary
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            tax={tax}
            total={total}
            onCouponApply={handleCouponApply}
            couponCode={couponCode}
            couponDiscount={couponDiscount}
          />
          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-4 py-3.5 bg-wine-500 text-white rounded-xl font-semibold hover:bg-wine-600 transition-all shadow-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
