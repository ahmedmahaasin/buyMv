import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopConstext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

// AnimatedSection — animates whenever it comes into view
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => currentRef && observer.unobserve(currentRef);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
};

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token, getUserCart } =
    useContext(ShopConstext);
  const [cartData, setCartData] = useState([]);

  // 🔹 Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // 🔹 Fetch cart from backend if token exists
  useEffect(() => {
    const fetchCart = async () => {
      if (token && getUserCart) {
        await getUserCart(token); // fetch latest cart from backend
      }
      buildCartData();
    };
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, products]);

  // 🔹 Build cartData whenever cartItems change
  useEffect(() => {
    buildCartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const buildCartData = () => {
    const tempData = [];
    for (const itemId in cartItems) {
      const productData = products.find((p) => p._id === itemId);
      if (!productData) continue;

      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          tempData.push({ _id: itemId, size, quantity });
        }
      }
    }
    setCartData(tempData);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-gray-50 rounded-lg shadow-md p-7">
      {/* Title */}
      <div className="text-center mb-8">
        <AnimatedSection>
          <Title text1="SHOPPING" text2="CART" />
        </AnimatedSection>
      </div>

      {/* Cart Items */}
      <div className="space-y-6">
        {cartData.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
        {cartData.map((item, index) => {
          const productData = products.find((p) => p._id === item._id);
          if (!productData) return null;

          return (
            <AnimatedSection key={`${item._id}-${item.size}`} delay={index * 100}>
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-md p-5 shadow hover:shadow-lg transition-transform transform hover:scale-101">
                
                {/* Product Info */}
                <div className="flex items-center gap-6 w-full sm:w-3/5">
                  <img
                    src={productData.image[0]}
                    alt={productData.name}
                    className="w-24 h-24 rounded-md border border-gray-300 object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{productData.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-600 font-medium">{currency}{productData.price}</span>
                      <span className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded-md">{item.size}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity and Remove */}
                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item._id, item.size, item.quantity - 1)
                        : null
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    <span className="text-xl font-semibold text-gray-700">-</span>
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      e.target.value === '' || e.target.value === '0'
                        ? null
                        : updateQuantity(item._id, item.size, Number(e.target.value))
                    }
                    className="w-16 py-1 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />

                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    <span className="text-xl font-semibold text-gray-700">+</span>
                  </button>

                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition"
                  >
                    <img src={assets.bin_icon} alt="Remove" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Total and Checkout */}
      {cartData.length > 0 && (
        <AnimatedSection delay={cartData.length * 100}>
          <div className="flex justify-end mt-10">
            <div className="w-full sm:w-96 bg-white rounded-lg shadow-md p-6">
              <CartTotal />
              <button
                onClick={() => navigate('/placeorder')}
                className="mt-6 w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 rounded-md text-lg font-medium shadow hover:from-gray-700 hover:to-gray-600 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};

export default Cart;
