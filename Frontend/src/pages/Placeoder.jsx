import React, { useContext, useState, useMemo } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopConstext } from '../context/ShopContext';
import { toast } from "react-toastify";
import axios from 'axios';

const PlaceOrder = () => {
  const { navigate, delivery_methods, backendUrl, token, cartItems, setCartItems, getCartAmount, products, currency } = useContext(ShopConstext);

  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showBmlPopup, setShowBmlPopup] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    deliveryAddress: '',
    boatName: '',
    boatLocation: '',
    boatContact: '',
    packageName: '',
    packageContact: '',
    islandCode: '',
    atollName: '',
    islandName: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Calculate subtotal from cart
  const subtotal = getCartAmount();

  // Dynamic delivery fee calculation
  const deliveryFee = useMemo(() => {
    if (!deliveryMethod || subtotal === 0) return 0;

    const method = delivery_methods.find((m) => m.method_name === deliveryMethod);
    if (!method) return 0;

    let fee = Number(method.Delivery_charge) || 0;

    if (method.apply_extra_charge_minimum && subtotal < (Number(method.minimum_order_amount) || 0)) {
      fee += Number(method.extra_charge_amount_minimum) || 0;
    }

    if (
      method.apply_extra_charge_maximum &&
      method.maximum_order_limit > 0 &&
      subtotal > Number(method.maximum_order_limit)
    ) {
      fee += Number(method.extra_charge_amount_maximum) || 0;
    }

    return fee;
  }, [subtotal, deliveryMethod, delivery_methods]);

  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = async () => {
  // 1. Validate required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'street', 'zipCode', 'country'];
  for (let field of requiredFields) {
    if (!formData[field]) {
      toast.error('Please fill all required delivery fields');
      return;
    }
  }

  if (!deliveryMethod) {
    toast.error('Please select a delivery method');
    return;
  }

  const deliveryMethodFields =
    deliveryMethod === 'Home Delivery'
      ? ['deliveryAddress']
      : ['boatName', 'boatLocation', 'boatContact', 'packageName', 'packageContact', 'islandCode', 'atollName', 'islandName'];

  for (let field of deliveryMethodFields) {
    if (!formData[field]) {
      toast.error('Please fill all required delivery method fields');
      return;
    }
  }

  if (!paymentMethod) {
    toast.error('Please select a payment method');
    return;
  }

  if (paymentMethod === 'bml') {
    setShowBmlPopup(true);
    return;
  }

  try {
    // Prepare items array
    const orderItems = [];
    for (const itemId in cartItems) {
      const sizesObj = cartItems[itemId];
      for (const size in sizesObj) {
        const quantity = sizesObj[size];
        if (quantity > 0) {
          const productInfo = products.find(p => p._id === itemId);
          if (productInfo) {
            orderItems.push({ productId: itemId, quantity, size });
          }
        }
      }
    }

    if (!orderItems.length) {
      toast.error("Cart is empty");
      return;
    }

    // Calculate subtotal
    const subtotal = getCartAmount();

    // Calculate delivery fee dynamically
    let deliveryFee = 0;
    const method = delivery_methods.find((m) => m.method_name === deliveryMethod);
    if (method) {
      deliveryFee = Number(method.Delivery_charge) || 0;
      if (method.apply_extra_charge_minimum && subtotal < Number(method.minimum_order_amount)) {
        deliveryFee += Number(method.extra_charge_amount_minimum) || 0;
      }
      if (method.apply_extra_charge_maximum && subtotal > Number(method.maximum_order_limit)) {
        deliveryFee += Number(method.extra_charge_amount_maximum) || 0;
      }
    }

    const totalAmount = subtotal + deliveryFee;

    console.log("Subtotal:", subtotal, "Delivery Fee:", deliveryFee, "Total:", totalAmount); // debug

    // Prepare order data
    const orderData = {
      items: orderItems,
      amount: Number(totalAmount.toFixed(2)), // includes delivery fee
      address: { ...formData, deliveryMethod },
      paymentMethod: paymentMethod === 'cod' ? 'COD' : 'BML',
      payment: paymentMethod === 'cod' ? false : true
    };

    const res = await axios.post(`${backendUrl}/api/oder/place`, orderData, {
      headers: { token },
    });

    if (res.data.success) {
      setCartItems({});
      toast.success('Order placed successfully!');
      navigate('/orders');
    } else {
      toast.error(res.data.message || 'Failed to place order');
    }
  } catch (error) {
    console.error("PlaceOrder Error:", error);
    toast.error('Failed to create order');
  }
};

  return (
    <div className="flex flex-col lg:flex-row gap-10 px-6 lg:px-20 py-10 bg-gray-50 min-h-screen">
    

      {/* Delivery Information */}
      <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg p-6">
        <Title text1="Delivery" text2="Information" />
        <form className="mt-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['firstName', 'lastName'].map((field, idx) => (
              <div className="relative" key={idx}>
                <input
                  type="text"
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder=" "
                />
                <label
                  htmlFor={field}
                  className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  {field === 'firstName' ? 'First Name' : 'Last Name'} <span className="text-red-500">*</span>
                </label>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Street */}
          <div className="relative">
            <input
              type="text"
              id="street"
              value={formData.street}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="street"
              className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Street <span className="text-red-500">*</span>
            </label>
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['city', 'state'].map((field, idx) => (
              <div className="relative" key={idx}>
                <input
                  type="text"
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder=" "
                />
                <label
                  htmlFor={field}
                  className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}
          </div>

          {/* Zip Code and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['zipCode', 'country'].map((field, idx) => (
              <div className="relative" key={idx}>
                <input
                  type={field === 'zipCode' ? 'number' : 'text'}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder=" "
                />
                <label
                  htmlFor={field}
                  className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  {field === 'zipCode' ? 'Zip Code' : 'Country'} <span className="text-red-500">*</span>
                </label>
              </div>
            ))}
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="number"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder=" "
            />
            <label
              htmlFor="phone"
              className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Phone Number
            </label>
          </div>
        </form>

        {/* Delivery Method */}
        <div className="mt-10">
          <div className="flex">
            <Title text1="Delivery" text2="Method" />
            <p className="text-red-600">*</p>
          </div>
          <div className="grid sm:flex gap-4 mt-4">
            {delivery_methods.filter(d => d.display).map((d, idx) => (
              <div
                key={idx}
                onClick={() => setDeliveryMethod(d.method_name)}
                className={`flex items-center gap-3 border rounded-lg w-full p-4 cursor-pointer transition-all duration-200 ${deliveryMethod === d.method_name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                  }`}
              >
                <img src={d.image} alt={d.method_name} className="h-8 w-8 object-contain" />
                <p className="text-gray-700 font-medium">{d.method_name}</p>
              </div>
            ))}
          </div>

          {/* Conditional Forms */}
          <div className="mt-6">
            {/* Home Delivery */}
            {deliveryMethod === 'Home Delivery' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Home Delivery Details</h3>
                <div className="relative">
                  <textarea
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows="3"
                    className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder=" "
                  />
                  <label
                    htmlFor="deliveryAddress"
                    className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    Delivery Address (Nearest shop, building, etc.) <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>
            )}

            {/* Boat Delivery */}
            {deliveryMethod === 'Boat Delivery' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">🛥 Boat Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['boatName', 'boatLocation'].map(f => (
                    <div className="relative" key={f}>
                      <input
                        type="text"
                        id={f}
                        value={formData[f]}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder=" "
                      />
                      <label
                        htmlFor={f}
                        className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                      >
                        {f === 'boatName' ? 'Boat Name' : 'Boat Location'} <span className="text-red-500">*</span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    id="boatContact"
                    value={formData.boatContact}
                    onChange={handleChange}
                    className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder=" "
                  />
                  <label
                    htmlFor="boatContact"
                    className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    Boat Contact Number <span className="text-red-500">*</span>
                  </label>
                </div>

                <h3 className="text-lg font-semibold text-gray-700">📦 Package Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['packageName', 'packageContact'].map(f => (
                    <div className="relative" key={f}>
                      <input
                        type={f === 'packageContact' ? 'number' : 'text'}
                        id={f}
                        value={formData[f]}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder=" "
                      />
                      <label
                        htmlFor={f}
                        className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                      >
                        {f === 'packageName' ? 'Package Name' : 'Contact Number'} <span className="text-red-500">*</span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['islandCode', 'atollName', 'islandName'].map(f => (
                    <div className="relative" key={f}>
                      <input
                        type="text"
                        id={f}
                        value={formData[f]}
                        onChange={handleChange}
                        className="peer block w-full rounded-md border border-gray-300 bg-transparent px-4 pt-5 pb-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder=" "
                      />
                      <label
                        htmlFor={f}
                        className="absolute left-4 top-1.5 text-gray-400 transition-all text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-blue-500"
                      >
                        {f === 'islandCode' ? 'Island Code' : f === 'atollName' ? 'Atoll Name' : 'Island Name'} <span className="text-red-500">*</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <CartTotal methodName={deliveryMethod} />
        </div>
        <Title text1="Payment" text2="Method" />
        <div className="flex flex-col gap-3 mt-6">
          {['bml', 'cod'].map((method, idx) => (
            <div
              key={idx}
              onClick={() => setPaymentMethod(method)}
              className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              <p className={`w-6 h-6 rounded-full border ${paymentMethod === method ? 'bg-blue-500' : ''}`} />
              <img
                src={method === 'bml' ? assets.razorpay_logo : method === 'cod' ? assets.cod : ''}
                alt={method}
                className="h-6"
              />
              <p className="text-gray-700 font-medium">
                {method === 'cod' ? 'Cash on Delivery' : method === 'bml' ? "Bank Of Maldives" : method.charAt(0).toUpperCase() + method.slice(1)}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white mt-8 py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
        >
          Place Order
        </button>
      </div>

      {showBmlPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-[90%] max-w-md text-center shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Transaction Failed
            </h2>
            <p className="text-gray-700 mb-6">
              BML is currently under maintenance. <br />
              Please try again later.
            </p>
            <button
              onClick={() => setShowBmlPopup(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PlaceOrder;
