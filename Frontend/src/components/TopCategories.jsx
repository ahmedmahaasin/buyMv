import React, { useContext, useEffect, useState } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "./Title"; // Using your existing animated Title component
import { Link } from "react-router-dom";

// Animated Section Component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = React.useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -90px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`${className} transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const TopCategories = () => {
  const { categories, Subcategories, navigate } = useContext(ShopConstext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Combine categories and subcategories that should show on home
    const cats = (categories?.filter((cat) => cat.show_home) || []).map((c) => ({
      ...c,
      type: "category",
      key: c._id || c.cat_name, // unique key
    }));

    const subs = (Subcategories?.filter((sub) => sub.show_home) || []).map((s) => ({
      ...s,
      type: "subcategory",
      key: s._id || s.cat_name, // unique key
    }));

    setItems([...cats, ...subs]);
  }, [categories, Subcategories]);

  return (
    <AnimatedSection className="my-20 px-4 sm:px-8 lg:px-12">
      {/* Animated Centered Title */}
      <Title text1="TOP" text2="CATEGORIES" align="center" />

      <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 mb-10 text-center">
        Explore the most popular categories and subcategories available for shopping with Buy MV.
      </p>

      {/* Combined Grid */}
      <div className="flex flex-wrap justify-center gap-10">
        {items.map((item, index) => (
          <AnimatedSection key={item.key} delay={index * 0.1}>
            <div className="flex flex-col items-center cursor-pointer">
              <button
                onClick={() => {
                  if (item.type === "category") {
                    navigate(`/shop?category=${encodeURIComponent(item.cat_name)}`);
                  } else {
                    navigate(`/shop?subCategory=${encodeURIComponent(item.cat_name)}`);
                  }
                }}
              >
                <div className="w-32 h-32 border rounded-2xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 bg-white">
                  <img
                    src={item.cat_image}
                    alt={item.cat_name}
                    className="object-contain w-full h-full p-4 hover:p-2 transition-all"
                  />
                </div>
              </button>
              <p className="pt-3 font-bold text-center">{item.cat_name}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* View More Button */}
      <AnimatedSection className="flex justify-center mt-12">
        <Link
          to="/Categoires"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
        >
          View All Categories
        </Link>
      </AnimatedSection>
    </AnimatedSection>
  );
};

export default TopCategories;
