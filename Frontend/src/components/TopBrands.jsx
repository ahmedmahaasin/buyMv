import React, { useContext, useEffect, useState } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "./Title";
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

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => currentRef && observer.unobserve(currentRef);
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

const TopBrands = ({ titleA = "center" }) => {
  const { Brands, navigate } = useContext(ShopConstext);
  const [topBrands, setTopBrands] = useState([]);

  useEffect(() => {
    if (Brands?.length > 0) {
      const filtered = Brands.filter((brand) => brand.show_home === true);
      setTopBrands(filtered);
    }
  }, [Brands]);

  return (
    <AnimatedSection className="my-20 px-4 sm:px-8 lg:px-12">
      {/* Title Section */}
      <div className="text-center mb-14">
        <Title text1="TOP" text2="BRANDS" align={titleA} />
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600">
          Explore the most trusted brands shopping with Buy MV.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 justify-items-center">
        {topBrands.map((brand, index) => (
          <AnimatedSection
            key={brand._id} // use unique MongoDB _id
            delay={index * 0.1}
            className="flex flex-col items-center"
          >
            <button
              onClick={() =>
                navigate(`/shop?brand=${encodeURIComponent(brand._id)}`)
              }
            >
              <div className="relative w-32 h-32 border rounded-2xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 bg-white">
                <img
                  src={brand.Brand_image}
                  alt={brand.Brand_name}
                  className="object-contain w-full h-full p-4 hover:p-2 transition-all"
                />
              </div>
            </button>
            <p className="pt-3 font-bold text-center">{brand.Brand_name}</p>
          </AnimatedSection>
        ))}
      </div>

      {/* View All Brands Button */}
      <AnimatedSection className="flex justify-center mt-12">
        <Link
          to="/brands"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
        >
          View All Brands
        </Link>
      </AnimatedSection>
    </AnimatedSection>
  );
};

export default TopBrands;
