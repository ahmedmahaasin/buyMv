import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaClock,
  FaDollarSign,
  FaShip,
  FaHome,
} from "react-icons/fa";
import { backendUrl } from "../App";

const Dashboard = ({ token }) => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch total products
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/total`, {
          headers: { token },
        });
        if (res.data.success) setTotalProducts(res.data.total);
      } catch (err) {
        console.error("Error fetching total products:", err);
      }
    };
    fetchTotalProducts();
  }, [token]);

  // Fetch all orders with user data populated from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.post(`${backendUrl}/api/oder/list`, {}, { headers: { token } });
        if (res.data.success) {
          const ordersWithUser = res.data.orders.map((order) => ({
            ...order,
            customerName: order.userId?.name || "Unknown",
          }));
          setOrders(ordersWithUser);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Summary calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status.toLowerCase() === "pending").length;
  const revenue = orders.reduce((acc, o) => acc + (o.payment ? o.amount : 0), 0);

  const statusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const cards = [
    { icon: <FaBoxOpen size={20} />, label: "Total Products", value: totalProducts, color: "blue" },
    { icon: <FaShoppingCart size={20} />, label: "Total Orders", value: totalOrders, color: "green" },
    { icon: <FaClock size={20} />, label: "Pending Orders", value: pendingOrders, color: "yellow" },
    { icon: <FaDollarSign size={20} />, label: "Revenue", value: `$${revenue}`, color: "red" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 w-full max-w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">DASHBOARD</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white shadow rounded-xl p-4 flex items-center gap-4 hover:shadow-lg w-full">
            <div className={`bg-${card.color}-100 text-${card.color}-700 p-3 rounded-full flex-shrink-0`}>
              {card.icon}
            </div>
            <div className="truncate">
              <p className="text-gray-500 text-sm truncate">{card.label}</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1 truncate">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table - Modern Design */}
<div className="w-full overflow-x-auto">
  <table className="w-full min-w-[600px] md:min-w-full divide-y divide-gray-200 text-sm md:text-base rounded-lg shadow-lg overflow-hidden">
    <thead className="bg-gray-100">
      <tr>
        {["Order ID", "Status", "Amount"].map((col, idx) => (
          <th
            key={idx}
            className="px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {orders.slice(-5).map((order) => (
        <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
          <td className="px-6 py-4 font-mono text-gray-800 truncate">{order._id}</td>
          <td className="px-6 py-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.status.toLowerCase() === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status.toLowerCase() === "confirmed"
                  ? "bg-blue-100 text-blue-800"
                  : order.status.toLowerCase() === "completed"
                  ? "bg-green-100 text-green-800"
                  : order.status.toLowerCase() === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : ""
              }`}
            >
              {order.status}
            </span>
          </td>
          <td className="px-6 py-4 font-medium text-gray-800">mvr{order.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Dashboard;
