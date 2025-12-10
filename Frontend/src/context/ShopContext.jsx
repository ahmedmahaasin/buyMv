import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopConstext = createContext();

const ShopConstextProvider = (props) => {
  const currency = "mvr";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  // ------------------- STATE -------------------
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [Subcategories, setSubcategories] = useState([]);
  const [Brands, setBrands] = useState([]);
  const [hero_section, setHero_section] = useState([]);
  const [delivery_methods, setDelivery_methods] = useState([]);
  const [WebsiteData_section, setWebsiteData_section] = useState({});
  const [token, setToken] = useState("");

  console.log("Backend URL:", backendUrl);

  // ------------------- CART FUNCTIONS -------------------

  // Add item to cart
  const addToCart = async (itemId, size) => {
    const itemInfo = products.find((p) => p._id === itemId);
    if (!itemInfo) return toast.error("Product not found");

    const hasSizes = itemInfo.sizes && itemInfo.sizes.length > 0;
    if (hasSizes && !size) return toast.error("Select Product Size");

    const sizeKey = hasSizes ? size : "Default";

    if (!token) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const updated = { ...cartItems };
    if (!updated[itemId]) updated[itemId] = {};
    if (!updated[itemId][sizeKey]) updated[itemId][sizeKey] = 0;
    updated[itemId][sizeKey] += 1;

    setCartItems(updated);

    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { token } }
      );
      await getUserCart(token); // refresh cart from DB
    } catch (error) {
      console.log("Add to Cart Error:", error);
      toast.error("Failed to sync cart: " + error.message);
    }
  };

  // Get total items in cart
  const getCartCount = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) return 0;
    return Object.values(cartItems).reduce(
      (total, sizesObj) =>
        total +
        Object.values(sizesObj || {}).reduce((sum, qty) => sum + (qty > 0 ? qty : 0), 0),
      0
    );
  };

  // Get total cart amount
  const getCartAmount = () => {
    if (!cartItems || Object.keys(cartItems).length === 0) return 0;
    return Object.entries(cartItems).reduce((total, [itemId, sizesObj]) => {
      const product = products.find((p) => p._id === itemId);
      if (!product) return total;
      const sizeTotal = Object.values(sizesObj || {}).reduce(
        (sum, qty) => sum + (qty > 0 ? qty * product.price : 0),
        0
      );
      return total + sizeTotal;
    }, 0);
  };

  // Fetch cart from backend
  const getUserCart = async (userToken) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      );
      if (res.data.success) setCartItems(res.data.cartData || {});
    } catch (error) {
      console.log("Get Cart Error:", error);
      toast.error("Failed to fetch cart: " + error.message);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, size, quantity) => {
    const updated = { ...cartItems };
    if (updated[itemId] && updated[itemId][size] !== undefined) {
      updated[itemId][size] = quantity;
      setCartItems(updated);
    }

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );
        toast.success("Cart updated");
      } catch (error) {
        console.log(error);
        toast.error("Failed to sync cart");
      }
    }
  };

  // ------------------- LOGIN / LOGOUT -------------------
  const login = async (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken); // triggers useEffect → fetch cart
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(""); // triggers useEffect → clear cart
    navigate("/login");
  };

  // ------------------- TOKEN WATCHER -------------------
  useEffect(() => {
    if (token) {
      // user logged in → fetch cart
      getUserCart(token);
    } else {
      // user logged out → clear cart
      setCartItems({});
    }
  }, [token]);

  // Auto-login on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // ------------------- DATA FETCHING -------------------
  const getProductData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  const getBrandData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/brand/list`);
      if (res.data.success) setBrands(res.data.brands || []);
    } catch (error) {
      console.log(error);
      setBrands([]);
    }
  };

  const getCatData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/category/list`);
      if (res.data.success) setCategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubCatData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/subcategory/list`);
      if (res.data.success) setSubcategories(res.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getHeroData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/hero/single/693092bf8f0c079a66f9d03b`);
      if (res.data.success) setHero_section(res.data.hero || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getWebData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/web/single/6931dc9d87c37bcf75efc18a`);
      if (res.data.success) setWebsiteData_section(res.data.data || {});
    } catch (error) {
      console.log(error);
    }
  };

  const getDeliveryData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/delivery/list`);
      if (res.data.success) setDelivery_methods(res.data.methods || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductData();
    getBrandData();
    getCatData();
    getSubCatData();
    getHeroData();
    getWebData();
    getDeliveryData();
  }, []);

  // ------------------- CONTEXT VALUE -------------------
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    categories,
    Subcategories,
    Brands,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    hero_section,
    delivery_methods,
    backendUrl,
    WebsiteData_section,
    setToken,
    token,
    login,
    logout,
    getUserCart,
    setCartItems,

  };

  return <ShopConstext.Provider value={value}>{props.children}</ShopConstext.Provider>;
};

export default ShopConstextProvider;
