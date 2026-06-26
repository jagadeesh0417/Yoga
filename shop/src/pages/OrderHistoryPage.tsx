import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services/order.service";
import Breadcrumb from "../components/common/Breadcrumb";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { HiOutlineShoppingBag } from "react-icons/hi";

interface Order {
  _id: string;
  orderId?: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

const statusColors: Record<string, string> = {
  pending: "text-yellow-500 bg-yellow-50",
  confirmed: "text-blue-500 bg-blue-50",
  processing: "text-purple-500 bg-purple-50",
  shipped: "text-indigo-500 bg-indigo-50",
  delivered: "text-green-500 bg-green-50",
  cancelled: "text-red-500 bg-red-50",
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await orderService.getMyOrders();
      setOrders(res.data.orders || res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[{ label: "My Orders" }]} />
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-8">My Orders</h1>

      {error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<HiOutlineShoppingBag />}
          title="No orders yet"
          message="Start shopping to see your orders here."
          action={{ label: "Start Shopping", onClick: () => window.location.href = "/shop" }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-mono text-gray-500">#{order.orderId || order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.items?.length || 0} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-wine-600">${order.totalAmount?.toFixed(2)}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[order.status] || "text-gray-500 bg-gray-50"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
