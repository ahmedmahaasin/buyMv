import React, { useContext, useEffect, useState } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "../components/title";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const Shop = () => {
  // --- Accent Color Variables ---
  const ACCENT = "#db0000"; // Primary accent
  const ACCENT_SECONDARY = "#fabc02"; // Secondary accent for gradients

  const { products, search, showSearch, categories, Subcategories, Brands } =
    useContext(ShopConstext);

  const [showFilter, setShowFilter] = useState(false);
  const [Collection, setCollection] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [Category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [Brand, setBrand] = useState([]);
  const [bestSellerFilter, setBestSellerFilter] = useState(false);
  const [sortType, setSortType] = useState("relevant");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSubCategory = searchParams.get("subCategory");
  const urlBestSeller = searchParams.get("bestseller");
  const urlBrand = searchParams.get("brand");

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parse URL params
  useEffect(() => {
    if (urlCategory) setCategory([urlCategory]);
    if (urlSubCategory) setSubCategory([urlSubCategory]);
    if (urlBrand) setBrand([urlBrand]);
    if (urlBestSeller === "true") setBestSellerFilter(true);
  }, [urlCategory, urlSubCategory, urlBrand, urlBestSeller]);

  // Toggle functions
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleBrand = (e) => {
    const value = e.target.value;
    setBrand((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleBestSeller = () => {
    const newValue = !bestSellerFilter;
    setBestSellerFilter(newValue);

    const searchParams = new URLSearchParams(window.location.search);
    if (newValue) searchParams.set("bestseller", "true");
    else searchParams.delete("bestseller");

    navigate({ pathname: "/shop", search: searchParams.toString() });
  };

  // Filter & sort products
  useEffect(() => {
    let filtered = [...products];

    if (showSearch && search)
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );

    if (Category.length > 0)
      filtered = filtered.filter((item) => Category.includes(item.category));

    if (SubCategory.length > 0)
      filtered = filtered.filter((item) => SubCategory.includes(item.subCategory));

    if (Brand.length > 0)
      filtered = filtered.filter((item) => Brand.includes(item.brand));

    if (bestSellerFilter) filtered = filtered.filter((item) => item.bestseller);

    // Stock priority
    filtered.sort((a, b) => (a.qty < 1 ? 1 : 0) - (b.qty < 1 ? 1 : 0));

    // Price sorting
    if (sortType === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sortType === "high-low") filtered.sort((a, b) => b.price - a.price);

    setCollection(filtered);
    setDisplayedProducts(filtered.slice(0, 20));
  }, [
    Category,
    SubCategory,
    Brand,
    bestSellerFilter,
    search,
    showSearch,
    products,
    sortType,
  ]);

  const loadMoreProducts = () => {
    if (displayedProducts.length >= Collection.length) return;
    setLoading(true);
    setTimeout(() => {
      setDisplayedProducts((prev) => [
        ...prev,
        ...Collection.slice(prev.length, prev.length + 20),
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading
      ) {
        loadMoreProducts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedProducts, loading, Collection]);

  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col sm:flex-row gap-6 px-4">
        {/* Desktop Sidebar */}
        <aside className="sm:w-64 w-full mt-10 hidden sm:block sm:sticky sm:top-20">
          <div
            className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-5 border border-white/30"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={category.cat_name}
                      onChange={toggleCategory}
                      checked={Category.includes(category.cat_name)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-sm text-gray-700">{category.cat_name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
              <div className="flex flex-col gap-3">
                {Subcategories.map((subCategory) => (
                  <label
                    key={subCategory.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={subCategory.cat_name}
                      onChange={toggleSubCategory}
                      checked={SubCategory.includes(subCategory.cat_name)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-sm text-gray-700">{subCategory.cat_name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Brands</p>
              <div className="flex flex-col gap-3">
                {Brands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={brand.id}
                      onChange={toggleBrand}
                      checked={Brand.includes(brand.id)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-sm text-gray-700">{brand.Brand_name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Best Seller */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Other Filters</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bestSellerFilter}
                  onChange={toggleBestSeller}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: ACCENT }}
                />
                <span className="text-sm text-gray-700">Best Seller</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <main className="flex-1 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <Title text1="ALL" text2="PRODUCTS" />
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowFilter(true)}
                className="sm:hidden px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition"
              >
                Filter
              </button>

              <select
                onChange={(e) => setSortType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: ACCENT }}
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
              {displayedProducts.map((item, index) => (
                <Link
                  key={index}
                  to={`/product/${item._id}`}
                  className="relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-full h-48 overflow-hidden rounded-2xl relative">
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {!item.qty <= 0 && (
                      <button
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm text-white font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition duration-300 text-lg"
                      >
                        View Details
                      </button>
                    )}
                    {item.qty <= 0 && (
                      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-2xl text-white font-bold text-xl">
                        OUT OF STOCK
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="text-gray-900 font-semibold text-base line-clamp-2">
                      {item.name}
                    </h3>
                    <p style={{ color: ACCENT }} className="font-bold">
                      mvr{item.price}
                    </p>
                    <span
                      className="text-xs font-semibold absolute text-center left-3 bottom-32 w-full rounded-l-full p-1 pr-3 pl-3"
                      style={{
                        backgroundColor: item.qty <= 0 ? "#ef4444" : "#10b981",
                        color: "#fff",
                      }}
                    >
                      {item.qty <= 0 ? "OUT OF STOCK" : "Available"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {loading && (
              <div className="flex justify-center my-4">
                <div className="relative w-10 h-10">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-dashed border-t-transparent animate-spin"
                    style={{ borderColor: ACCENT }}
                  ></div>
                  <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm"></div>
                  <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-400 opacity-30 blur-xl"></div>
                </div>
              </div>
            )}
          </div>

          {isMobile && displayedProducts.length < Collection.length && !loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreProducts}
                className="px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:scale-105 transition-transform duration-300"
                style={{
                  background: `linear-gradient(to right, ${ACCENT}, ${ACCENT_SECONDARY})`,
                }}
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Fullscreen */}
      {showFilter && (
        <div className="fixed inset-0 z-[1000] bg-white/60 backdrop-blur-xl flex flex-col min-h-screen overflow-y-auto sm:hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white/70 z-10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
            <button
              onClick={() => setShowFilter(false)}
              className="text-3xl font-bold text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-5 flex flex-col gap-6 min-h-screen">
            <button
              onClick={() => {
                setCategory([]);
                setSubCategory([]);
                setBrand([]);
                setBestSellerFilter(false);
                navigate("/shop");
              }}
              className="w-full py-2 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
              style={{
                background: `linear-gradient(to right, ${ACCENT}, ${ACCENT_SECONDARY})`,
              }}
            >
              Clear All
            </button>

            {/* Mobile Filter Fullscreen */}
{showFilter && (
  <div className="fixed inset-0 z-[1000] bg-white/60 backdrop-blur-xl flex flex-col min-h-screen overflow-y-auto sm:hidden">
    {/* Header */}
    <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white/70 z-10 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
      <button
        onClick={() => setShowFilter(false)}
        className="text-3xl font-bold text-gray-600 hover:text-gray-800"
      >
        ✕
      </button>
    </div>

    <div className="flex-1 p-5 flex flex-col gap-6 min-h-screen">
      {/* Clear All */}
      <button
        onClick={() => {
          setCategory([]);
          setSubCategory([]);
          setBrand([]);
          setBestSellerFilter(false);
          navigate("/shop");
        }}
        className="w-full py-2 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        style={{
          background: `linear-gradient(to right, ${ACCENT}, ${ACCENT_SECONDARY})`,
        }}
      >
        Clear All
      </button>

      {/* Categories */}
      <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Categories</p>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/30 transition"
            >
              <input
                type="checkbox"
                value={category.cat_name}
                onChange={toggleCategory}
                checked={Category.includes(category.cat_name)}
                className="w-5 h-5 rounded-md"
                style={{ accentColor: ACCENT }}
              />
              <span className="text-gray-800 font-medium">{category.cat_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Type</p>
        <div className="flex flex-col gap-2">
          {Subcategories.map((subCategory) => (
            <label
              key={subCategory.id}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/30 transition"
            >
              <input
                type="checkbox"
                value={subCategory.cat_name}
                onChange={toggleSubCategory}
                checked={SubCategory.includes(subCategory.cat_name)}
                className="w-5 h-5 rounded-md"
                style={{ accentColor: ACCENT }}
              />
              <span className="text-gray-800 font-medium">{subCategory.cat_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Brands</p>
        <div className="flex flex-col gap-2">
          {Brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/30 transition"
            >
              <input
                type="checkbox"
                value={brand.id}
                onChange={toggleBrand}
                checked={Brand.includes(brand.id)}
                className="w-5 h-5 rounded-md"
                style={{ accentColor: ACCENT }}
              />
              <span className="text-gray-800 font-medium">{brand.Brand_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Best Seller */}
      <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/30 transition">
          <input
            type="checkbox"
            checked={bestSellerFilter}
            onChange={toggleBestSeller}
            className="w-5 h-5 rounded-md"
            style={{ accentColor: ACCENT }}
          />
          <span className="text-gray-800 font-medium">Best Seller</span>
        </label>
      </div>
    </div>
  </div>
)}

          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
