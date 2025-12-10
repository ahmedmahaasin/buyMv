import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ShopConstext } from "../context/ShopContext";

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { backendUrl, token, currency, products, setToken } = useContext(ShopConstext);

  // Fetch user info
  const fetchUser = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/single`, {}, { headers: { token } });
      if (res.data.success) {
        setUser(res.data.user);
        setEmail(res.data.user.email);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user info");
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      if (!token) return;
      const res = await axios.post(`${backendUrl}/api/oder/userorder`, {}, { headers: { token } });
      if (res.data.success) {
        const allOrders = [];
        res.data.orders.forEach((order) => {
          const items = order.items || order.cartData || [];
          items.forEach((item) => {
            const productInfo = products.find((p) => p._id === item.productId);
            allOrders.push({
              ...item,
              orderId: order._id,
              name: productInfo?.name || item.name,
              price: Number(productInfo?.price || item.price || 0),
              amount: order.amount || 0,
              quantity: item.quantity || 1,
              image: productInfo?.image || item.image || "/placeholder.png",
              date: order.createdAt || order.date || null,
              size: item.size || "M",
            });
          });
        });
        allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(allOrders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchOrders();
    }
  }, [token, products]);

  const totalSpend = orders.reduce((acc, order) => acc + (order.amount || order.price * order.quantity), 0);

  const handleUpdateUser = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/update`,
        { userId: user._id, email, password },
        { headers: { token } }
      );
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("User updated successfully");
        setShowUpdateModal(false);
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pt-20 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">My Account</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p><span className="font-medium">Name:</span> {user?.name || 'N/A'}</p>
          <p><span className="font-medium">Email:</span> {user?.email || 'N/A'}</p>
          <p><span className="font-medium">Total Spend:</span> {currency} {totalSpend.toFixed(2)}</p>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setShowUpdateModal(true)}
        >
          Update Info
        </button>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order, idx) => {
              const formattedDate = order.date && !isNaN(new Date(order.date).getTime())
                ? new Date(order.date).toLocaleString()
                : "N/A";

              // Handle both string and array images
              let imageUrl = "/placeholder.png";
              if (Array.isArray(order.image) && order.image.length > 0) {
                imageUrl = order.image[0].startsWith("http") ? order.image[0] : `${backendUrl}/${order.image[0]}`;
              } else if (typeof order.image === "string") {
                imageUrl = order.image.startsWith("http") ? order.image : `${backendUrl}/${order.image}`;
              }

              return (
                <div
                  key={idx}
                  className="bg-white shadow-md rounded-xl p-4 flex items-start gap-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={imageUrl}
                    alt={order.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start text-gray-500 text-sm">
                      <span>Order ID: {order.orderId}</span>
                      <span className="text-gray-700 text-xs">{formattedDate}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{order.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Qty: {order.quantity} | Size: {order.size}
                    </p>
                    <p className="text-gray-800 font-bold">
                      {currency}{(order.amount || order.price * order.quantity).toFixed(2)}
                    </p>
                    <button
                      className="mt-2 px-3 py-1 bg-black text-white rounded-full hover:bg-gray-800 text-xs self-start"
                      onClick={() => navigate("/orders")}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold">Update Information</h3>
            <div className="space-y-2">
              <div>
                <label className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Password</label>
                <input
                  type="password"
                  className="w-full border px-3 py-2 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleUpdateUser}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
