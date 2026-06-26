import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { orderService } from "../services/order.service";
import Breadcrumb from "../components/common/Breadcrumb";
import { HiOutlineShieldCheck } from "react-icons/hi";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const discount = couponDiscount || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  useEffect(() => {
    if (items.length === 0 && !placing) navigate("/cart");
  }, [items, navigate, placing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.state || !form.zipCode) {
      toast.error("Please fill in all shipping details");
      return;
    }
    setPlacing(true);
    try {
      const orderData = {
        shippingAddress: form,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod,
        couponCode: couponCode || undefined,
      };

      if (paymentMethod === "cod") {
        const res = await orderService.create(orderData);
        const order = res.data.order || res.data;
        clearCart();
        navigate(`/order-success?orderId=${order._id}`);
      } else {
        const res = await orderService.create(orderData);
        const order = res.data.order || res.data;
        const key = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_xxx";

        const options = {
          key,
          amount: order.razorpayOrder?.amount || Math.round(total * 100),
          currency: "INR",
          name: "MYSTIC YOGA",
          description: "Yoga Products",
          order_id: order.razorpayOrder?.id || order.razorpayOrderId,
          handler: async function (response: any) {
            try {
              await orderService.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              clearCart();
              navigate(`/order-success?orderId=${order._id}`);
            } catch {
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: form.fullName,
            email: "",
            contact: form.phone,
          },
          theme: { color: "#8B1E3F" },
          modal: {
            ondismiss: () => setPlacing(false),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          toast.error("Payment failed. Please try again.");
          setPlacing(false);
        });
        rzp.open();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
      setPlacing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select name="country" value={form.country} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300">
                  <option value="US">United States</option>
                  <option value="IN">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 text-sm">
                  <div className="w-12 h-12 rounded-lg bg-ivory-100 overflow-hidden flex-shrink-0">
                    <img src={item.image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="flex-1 text-gray-700">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-wine-300 transition-colors has-[:checked]:border-wine-500 has-[:checked]:bg-wine-50">
                <input type="radio" name="payment" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} className="accent-wine-500" />
                <div>
                  <span className="text-sm font-medium text-gray-800">Credit/Debit Card (Razorpay)</span>
                  <p className="text-xs text-gray-500">Pay securely via Razorpay</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-wine-300 transition-colors has-[:checked]:border-wine-500 has-[:checked]:bg-wine-50">
                <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-wine-500" />
                <div>
                  <span className="text-sm font-medium text-gray-800">Cash on Delivery</span>
                  <p className="text-xs text-gray-500">Pay when you receive</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
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
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <div className="flex gap-2">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code" className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-300" />
                <button onClick={() => { if (couponCode) { setCouponDiscount(subtotal * 0.1); toast.success("Coupon applied!"); } }} className="px-4 py-2.5 bg-wine-500 text-white rounded-xl text-sm font-medium hover:bg-wine-600 transition-colors">Apply</button>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full mt-6 py-3.5 bg-wine-500 text-white rounded-xl font-semibold hover:bg-wine-600 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {placing ? "Processing..." : <><HiOutlineShieldCheck /> Place Order</>}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">Your information is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
