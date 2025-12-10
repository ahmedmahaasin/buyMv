import React, { useContext, useEffect, useState } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "../components/Title";
import NewsLetter from "../components/NewsLetter";

// Animated Section for scroll animations
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

const AllCategories = () => {
  const { categories, Subcategories, navigate } = useContext(ShopConstext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cats = (categories || []).map((c) => ({ ...c, type: "category" }));
    const subs = (Subcategories || []).map((s) => ({ ...s, type: "subcategory" }));
    setItems([...cats, ...subs]);
  }, [categories, Subcategories]);

  return (
    <div className="my-20 px-4 sm:px-8 lg:px-12">
      {/* Title */}
      <div className="text-center mb-14">
        <Title text1="ALL" text2="CATEGORIES" />
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600">
          Browse through all available categories and subcategories for a seamless shopping experience.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 justify-items-center">
        {items.map((item, index) => (
          <AnimatedSection key={item.id} delay={index * 0.1} className="group flex justify-center">
            <div className="flex flex-col items-center text-center">
              <button
                onClick={() => {
                  if (item.type === "category") {
                    navigate(`/shop?category=${encodeURIComponent(item.cat_name)}`);
                  } else {
                    navigate(`/shop?subCategory=${encodeURIComponent(item.cat_name)}`);
                  }
                }}
              >
                <div className="relative w-32 h-32 border rounded-2xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 bg-white">
                  <img
                    src={item.cat_image}
                    alt={item.cat_name}
                    className="object-contain w-full h-full p-4 group-hover:p-2 transition-all"
                  />
                </div>
              </button>
              <p className="pt-3 font-bold">{item.cat_name}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="mt-28">
        <AnimatedSection>
          <NewsLetter />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default AllCategories;
