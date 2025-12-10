import React, { useContext, useEffect, useState } from "react";
import { ShopConstext } from "../context/ShopContext";
import Title from "../components/title";
import NewsLetter from "../components/NewsLetter";


const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = React.useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
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

const AllBrands = () => {
  const { Brands, navigate } = useContext(ShopConstext);
  const [allBrands, setAllBrands] = useState([]);

  useEffect(() => {
    if (Brands && Brands.length > 0) {
      setAllBrands(Brands); // Show all brands
    }
  }, [Brands]);

  return (
    <div className="my-20 px-4 sm:px-8 lg:px-12">
      {/* Title */}
      <div className="text-center mb-14">
        <Title text1="ALL" text2="BRANDS" />
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600">
          Browse all brands available on Buy MV.
        </p>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {allBrands.map((brand, index) => (
          <AnimatedSection
            key={brand.id}
            delay={index * 0.1}
            className="group flex justify-center"
          >
            <div className="justify-center text-center">
              <button
                onClick={() =>
                  navigate(`/shop?brand=${encodeURIComponent(brand.id)}`)
                }
              >
                <div className="relative w-32 h-32 border rounded-2xl shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 bg-white">
                  <img
                    src={brand.Brand_image}
                    alt={brand.Brand_name}
                    className="object-contain w-full h-full p-4 group-hover:p-2 transition-all"
                  />
                </div>
              </button>
              <p className="pt-3 font-bold">{brand.Brand_name}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <div className=" mt-28"> 
        <AnimatedSection>
     <NewsLetter />
    </AnimatedSection>
    </div>
    </div>
  );
};

export default AllBrands;
