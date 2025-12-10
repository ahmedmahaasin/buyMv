import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import OrderForm from "./order/OrderForm";
import DeliveryAddress from "./order/DeliveryAddress";
import InvoiceItems from "./order/InvoiceItems";
import OrderActions from "./order/OrderActions";

const OrderModal = ({ order, token, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment);
  const [updating, setUpdating] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    if (!token) return;
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token },
      });
      if (res.data.success) setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const getImageUrl = (product, item) =>
    product?.images?.[0] || product?.image || (Array.isArray(item.image) ? item.image[0] : item.image) || "/placeholder.png";

  const mappedItems = order.items.map((item) => {
    const product = products.find((p) => p._id === item.productId);
    return {
      ...item,
      name: product?.name || item.name || "Unnamed Product",
      price: product?.price || item.price || 0,
      image: getImageUrl(product, item),
    };
  });

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/oder/status`,
        { orderId: order._id, status: newStatus },
        { headers: { token } }
      );
      if (res.data.success) {
        setStatus(newStatus);
        onStatusUpdate();
      } else {
        alert(res.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  const updatePayment = async (isPaid) => {
    setUpdating(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/oder/payment`,
        { orderId: order._id, payment: isPaid },
        { headers: { token } }
      );
      if (res.data.success) {
        setPaymentStatus(isPaid);
        onStatusUpdate();
      } else {
        alert(res.data.message || "Failed to update payment");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating payment");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
          <button
            className="px-5 py-2  bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <OrderForm order={order} status={status} paymentStatus={paymentStatus} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DeliveryAddress address={order.address} />
          <div>
            <OrderActions
              status={status}
              paymentStatus={paymentStatus}
              onChangeStatus={updateStatus}
              onChangePayment={updatePayment}
              updating={updating}
            />
            <InvoiceItems items={mappedItems} loading={loadingProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
