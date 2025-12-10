import React, { useContext, useState, useEffect } from 'react';
import { ShopConstext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency, products, delivery_methods } = useContext(ShopConstext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const res = await axios.post(
        `${backendUrl}/api/oder/userorder`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        let allOrdersItem = [];

        res.data.orders.forEach((order) => {
          const itemList = order.items || order.order || order.cartData || [];

          if (Array.isArray(itemList)) {
            // Find delivery method info
            const deliveryMethodName = order.address?.deliveryMethod;
            const deliveryMethodObj = delivery_methods.find(d => d.method_name === deliveryMethodName);
            let deliveryCharge = 0;

            if (deliveryMethodObj) {
              deliveryCharge = Number(deliveryMethodObj.Delivery_charge || 0);
              const subtotal = itemList.reduce((sum, i) => {
                const productInfo = products.find(p => p._id === i.productId);
                return sum + (productInfo?.price || i.price) * (i.quantity || 1);
              }, 0);

              if (deliveryMethodObj.apply_extra_charge_minimum && subtotal < (Number(deliveryMethodObj.minimum_order_amount) || 0)) {
                deliveryCharge += Number(deliveryMethodObj.extra_charge_amount_minimum) || 0;
              }
              if (deliveryMethodObj.apply_extra_charge_maximum && subtotal > (Number(deliveryMethodObj.maximum_order_limit) || 0)) {
                deliveryCharge += Number(deliveryMethodObj.extra_charge_amount_maximum) || 0;
              }
            }

            itemList.forEach((item) => {
              const productInfo = products.find(p => p._id === item.productId);
              const price = Number(productInfo?.price || item.price || 0);
              const quantity = item.quantity || 1;
              const totalPrice = price * quantity + deliveryCharge;

              allOrdersItem.push({
                ...item,
                orderId: order._id,
                name: productInfo?.name || item.name,
                price, // unit price
                totalPrice, // price + delivery
                image: productInfo?.image || item.image || '/placeholder.png',
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                deliveryMethod: deliveryMethodName || 'N/A',
                date: order.date,
              });
            });
          }
        });

        // Sort latest to oldest
        allOrdersItem.sort((a, b) => new Date(b.date) - new Date(a.date));

        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, products]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'out for delivery': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="pt-16 px-4 md:px-8">
      <div className="mb-6 text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {orderData.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 flex items-start gap-3 p-3 hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <img
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name || 'Product'}
                className="w-16 h-16 object-cover rounded-md"
              />

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start text-sm text-gray-500">
                  <span>Order ID: {item.orderId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-800 text-sm mt-1">{item.name}</h3>
                <p className="text-gray-600 text-xs">
                  Unit: {currency}{item.price.toFixed(2)} | Qty: {item.quantity || 1} | Size: {item.size || 'M'}
                </p>
                <p className="text-gray-600 text-xs">Delivery: {item.deliveryMethod}</p>
                <p className="text-gray-800 font-bold text-xs mt-1">Total: {currency}{item.totalPrice.toFixed(2)}</p>
                <p className="text-gray-600 text-xs">Payment: {item.paymentMethod || 'N/A'}</p>

                <div className="flex justify-between items-center mt-1 text-gray-400 text-xs">
                  <span>{item.date ? new Date(item.date).toLocaleString() : 'N/A'}</span>
                  <button
                    onClick={loadOrderData}
                    className="px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-xs"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
