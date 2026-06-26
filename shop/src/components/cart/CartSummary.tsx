import { useState } from "react";
import { couponService } from "../../services/coupon.service";
import toast from "react-hot-toast";

interface Props {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  onCouponApply: (code: string) => void;
  couponCode?: string;
  couponDiscount?: number;
}

export default function CartSummary({ subtotal, discount, shipping, tax, total, onCouponApply, couponCode, couponDiscount }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await couponService.verify(code.trim());
      onCouponApply(code.trim());
      toast.success("Coupon applied!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-serif font-bold text-gray-800 mb-5">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
        </div>
        {couponDiscount ? (
          <div className="flex justify-between text-green-600">
            <span>Coupon ({couponCode})</span>
            <span>-${couponDiscount.toFixed(2)}</span>
          </div>
        ) : discount > 0 ? (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        ) : null}
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span className="font-medium text-gray-800">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Tax</span>
          <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between text-lg">
          <span className="font-bold text-gray-800">Total</span>
          <span className="font-bold text-wine-600">${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300"
          />
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-4 py-2.5 bg-wine-500 text-white rounded-xl text-sm font-medium hover:bg-wine-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
