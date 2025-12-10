import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "./Title";
import { Link } from "react-router-dom";

// AnimatedSection — animate every time it comes into view
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
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

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const RelatedProducts = ({ category, subCategory }) => {
  const { products, currency } = useContext(ShopConstext);
  const [Related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filtered.slice(0, 6));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24 px-4 sm:px-8 lg:px-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <Title text1="RELATED" text2="PRODUCTS" />
        <Link
          to={`/shop?category=${encodeURIComponent(
            category
          )}&subCategory=${encodeURIComponent(subCategory)}`}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
        >
          View All
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {Related.map((item, index) => (
          <AnimatedSection key={item._id} delay={index * 100}>
            <Link
              to={`/product/${item._id}`}
              className="group relative w-full max-w-xs h-[24rem] bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-lg overflow-hidden transform transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
            >
              {/* Image Section */}
              <div className="flex-1 w-full relative overflow-hidden rounded-t-3xl">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-5 py-2 bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl shadow hover:scale-105 transition transform">
                    View Details
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 flex flex-col gap-1">
                <h3 className="text-gray-900 font-semibold text-lg line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-blue-600 font-bold text-md">
                  {currency}
                  {item.price}
                </p>
                <span
                  className={`text-sm font-medium ${
                    item.status?.toLowerCase() === "out of stock"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {item.status?.toLowerCase() === "out of stock"
                    ? "Out of Stock"
                    : "Available"}
                </span>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
