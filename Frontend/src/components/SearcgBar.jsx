import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopConstext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import SearchIcone from "../Icons/SearchIcone";
import ClossIcon from "../Icons/ClossIcon";

const AnimatedSection = ({ children, className = '', direction = 'up', delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(false); // animate every time
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => currentRef && observer.unobserve(currentRef);
  }, [delay]);

  let translateClass = 'translate-y-4';
  if (direction === 'left') translateClass = '-translate-x-4';
  else if (direction === 'right') translateClass = 'translate-x-4';
  else if (direction === 'down') translateClass = '-translate-y-4';

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translateClass}`
      }`}
    >
      {children}
    </div>
  );
};

const SearcgBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopConstext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(location.pathname.includes("shop"));
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <AnimatedSection direction="down" delay={100} className="sticky top-[73px] z-20 flex w-full items-center justify-center px-2 py-2">
      <div className="flex w-3/4 sm:w-1/2 items-center justify-center relative">

        {/* Search Bar */}
        <div className="relative flex items-center w-full
                        bg-white/10 backdrop-blur-lg border border-white/20
                        rounded-3xl px-4 py-3 shadow-lg transition-all duration-300
                        hover:scale-95 hover:shadow-2xl overflow-hidden animate-liquid mr-3">

          {/* Glass Refraction Overlay */}
          <div className="absolute inset-0 rounded-3xl
                          bg-gradient-to-b from-white/30 via-white/10 to-transparent
                          backdrop-blur-[6px] pointer-events-none"></div>

          {/* Diagonal subtle reflection */}
          <div className="absolute inset-0 rounded-3xl
                          bg-gradient-to-r from-white/5 via-white/0 to-white/5
                          opacity-20 pointer-events-none"></div>

          {/* Search Icon */}
          <div className="w-5 mr-3 flex-shrink-0 relative z-10">
            <SearchIcone mainColor={"#111"} />
          </div>

          {/* Input */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-black placeholder-gray-800
                       outline-none text-sm font-medium relative z-10"
            type="text"
            placeholder="Search products..."
          />
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowSearch(false)}
          className="ml-3 p-3 rounded-full hover:text-red-500 bg-white/10 backdrop-blur-lg
                     border border-white/20 shadow-lg hover:scale-110 hover:opacity-90
                     transition-transform duration-200"
        >
          <ClossIcon className="w-4 text-black" />
        </button>

      </div>

      {/* Liquid Animation */}
      <style>{`
        @keyframes liquid {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-liquid {
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.1),
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.15),
            rgba(255,255,255,0.05)
          );
          background-size: 400% 400%;
          animation: liquid 10s ease infinite;
        }
      `}</style>
    </AnimatedSection>
  );
};

export default SearcgBar;
