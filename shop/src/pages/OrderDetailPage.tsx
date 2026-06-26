import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../services/order.service";
import Breadcrumb from "../components/common/Breadcrumb";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { HiArrowLeft, HiCheckCircle, HiClock, HiTruck, HiCube } from "react-icons/hi";

interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId?: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  totalAmount: number;
  status: string;
  couponCode?: string;
  createdAt: string;
  statusHistory?: { status: string; timestamp: string; note?: string }[];
}

const statusIcons: Record<string, any> = {
  pending: HiClock,
  confirmed: HiCheckCircle,
  processing: HiCube,
  shipped: HiTruck,
  delivered: HiCheckCircle,
  cancelled: HiClock,
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-500",
  confirmed: "text-blue-500",
  processing: "text-purple-500",
  shipped: "text-indigo-500",
  delivered: "text-green-500",
  cancelled: "text-red-500",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    orderService
      .getById(id)
      .then((res) => setOrder(res.data.order || res.data))
      .catch((err) => setError(err.response?.data?.message || "Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12"><Loader /></div>;
  if (error || !order) return <div className="max-w-4xl mx-auto px-4 py-12"><ErrorMessage message={error || "Order not found"} /></div>;

  const StatusIcon = statusIcons[order.status] || HiClock;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[
        { label: "My Orders", to: "/orders" },
        { label: `Order #${order.orderId || order._id.slice(-8).toUpperCase()}` },
      ]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Order #{order.orderId || order._id.slice(-8).toUpperCase()}
        </h1>
        <Link to="/orders" className="flex items-center gap-1 text-sm text-wine-500 hover:text-wine-600 font-medium">
          <HiArrowLeft /> Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-ivory-100 overflow-hidden flex-shrink-0">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Status Timeline</h2>
            {order.statusHistory && order.statusHistory.length > 0 ? (
              <div className="space-y-4">
                {order.statusHistory.map((h, i) => {
                  const Icon = statusIcons[h.status] || HiClock;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className={`mt-0.5 ${statusColors[h.status] || "text-gray-400"}`}>
                        <Icon className="text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 capitalize">{h.status}</p>
                        <p className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString()}</p>
                        {h.note && <p className="text-xs text-gray-400 mt-1">{h.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={statusColors[order.status] || "text-gray-400"}>
                  <StatusIcon className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 capitalize">{order.status}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800">${(order.subtotal || 0).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>-${(order.discount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-gray-800">{order.shipping === 0 ? "FREE" : `$${(order.shipping || 0).toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium text-gray-800">${(order.tax || 0).toFixed(2)}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-wine-600">${(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h2>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No address information</p>
            )}
            <hr className="my-4 border-gray-100" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-gray-800 capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Payment Status</span>
              <span className={`font-medium capitalize ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-500"}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
