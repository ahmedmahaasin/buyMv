import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import OrderModal from "../../components/OrderModal";
import { assets } from "../../assets/assets"; // <-- import parcel icon

const AllOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/oder/list`, {}, { headers: { token } });
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        console.error("Failed to fetch orders:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "out for delivery":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">All Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer transform transition hover:scale-105 hover:shadow-2xl flex items-start gap-4"
              onClick={() => setSelectedOrder(order)}
            >
              {/* Parcel Icon */}
              <img src={assets.parcel_icon} alt="Parcel" className="w-10 h-10 object-contain mt-1" />

              {/* Order Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-700 text-sm">Order ID: {order._id}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  Payment: <span className="font-medium">{order.payment ? "Paid" : "Pending"}</span>
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Amount: <span className="font-medium">${order.amount}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Date: <span className="font-medium">{new Date(order.date).toLocaleString()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          token={token}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={fetchAllOrders}
        />
      )}
    </div>
  );
};

export default AllOrders;
