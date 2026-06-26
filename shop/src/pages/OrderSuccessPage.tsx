import { Link, useSearchParams } from "react-router-dom";
import { HiCheckCircle, HiArrowRight } from "react-icons/hi";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl text-green-500 mb-6 flex justify-center">
        <HiCheckCircle />
      </div>
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">Order Placed!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
      <p className="text-gray-500 mb-8">Your order has been placed successfully.</p>
      {orderId && (
        <div className="bg-ivory-100 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="text-sm font-mono font-medium text-gray-800 break-all">{orderId}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to={`/orders/${orderId}`} className="px-6 py-3 bg-wine-500 text-white rounded-xl font-medium hover:bg-wine-600 transition-colors">
          View Order Details
        </Link>
        <Link to="/shop" className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-wine-300 transition-colors inline-flex items-center justify-center gap-2">
          Continue Shopping <HiArrowRight />
        </Link>
      </div>
    </div>
  );
}
