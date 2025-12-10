import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "./title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

// 🔄 Reusable AnimatedSection — replays animation each time visible
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1, // triggers when 10% visible
        rootMargin: "0px 0px -90px 0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
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

const BestSeller = () => {
  const { products, webInfor } = useContext(ShopConstext);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products
        .filter((item) => item.bestseller === true)
        .slice(0, 8);
      setBestSellers(filtered);
    }
  }, [products]);

  return (
    <AnimatedSection className="my-20 px-4 sm:px-8 lg:px-12">
      {/* Section Header */}
      <div className="text-center mb-14">
        <Title text1="BEST" text2="SELLERS" />
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600">
          Discover Buy MV's top-selling products — stylish, modern, and customer favorites you’ll love.
        </p>
      </div>

      {/* Product Grid */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-10 items-center sm:items-stretch">
        {bestSellers.map((item, index) => (
          <AnimatedSection key={item._id} delay={index * 0.1}>
            <ProductItem
              id={item._id}
              image={item.image}
              status={item.qty}
              name={item.name}
              price={item.price}
            />
          </AnimatedSection>
        ))}
      </div>

      {/* View More Button */}
      <AnimatedSection className="flex justify-center mt-12">
        <Link
          to="/shop?bestseller=true"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300" style={{
            
          }}
        >
          View More
        </Link>
      </AnimatedSection>
    </AnimatedSection>
  );
};

export default BestSeller;
