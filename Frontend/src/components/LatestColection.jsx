import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopConstext } from '../context/ShopContext';
import Title from './title';
import { Link } from 'react-router-dom';

const LatestColection = () => {
  const { products } = useContext(ShopConstext);
  const [LatestProducts, setLatestProducts] = useState([]);
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerSection, setCardsPerSection] = useState(4);

  // Adjust cards per section based on screen width
  const handleResize = () => {
    if (window.innerWidth < 640) setCardsPerSection(1);
    else if (window.innerWidth < 1024) setCardsPerSection(2);
    else setCardsPerSection(4);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10)); // First 10 products
    }
  }, [products]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const slideWidth =
        sliderRef.current.firstChild.offsetWidth * cardsPerSection +
        24 * cardsPerSection;
      sliderRef.current.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const slideWidth =
        sliderRef.current.firstChild.offsetWidth * cardsPerSection +
        24 * cardsPerSection;
      sliderRef.current.scrollBy({ left: slideWidth, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const slideWidth =
      sliderRef.current.firstChild.offsetWidth * cardsPerSection +
      24 * cardsPerSection;
    const index = Math.round(scrollLeft / slideWidth);
    setActiveIndex(index);
  };

  const goToSection = (index) => {
    if (!sliderRef.current) return;
    const slideWidth =
      sliderRef.current.firstChild.offsetWidth * cardsPerSection +
      24 * cardsPerSection;
    sliderRef.current.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
  };

  const totalSections = Math.ceil(LatestProducts.length / cardsPerSection);

  return (
    <div className="my-16 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center py-8">
        <Title text1={'LATEST'} text2={'PRODUCTS'} />
        <p className="w-full sm:w-3/4 mx-auto text-sm sm:text-base md:text-lg text-gray-600">
          Discover Buy Mv's latest products, featuring fresh, trendy designs with a modern edge.
        </p>
      </div>

      {/* Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 py-4 scroll-smooth"
          onScroll={handleScroll}
        >
          {LatestProducts.map((item) => (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="snap-start flex-shrink-0 w-60 sm:w-64 md:w-64 lg:w-64"
            >
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-95 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-white/5 rounded-3xl pointer-events-none"></div>

                <div className="w-full h-56 rounded-2xl overflow-hidden relative">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                    <button className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-white/25 transition transform">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-3 px-3 pb-4">
                  <h3 className="text-gray-900 font-semibold text-lg truncate">{item.name}</h3>
                  <p className="text-blue-600 font-bold text-md">mvr{item.price}</p>
                  
                    <span
            className={`text-xs font-semibold ${
               item.qty  <= 0 ?
                "text-red-500"
                : "text-green-500"
            }`}
          >
            { item.qty   <= 0 ? "Out of Stock" : "Available"}
          </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/30 backdrop-blur-md rounded-full p-3 shadow hover:bg-white/50 hover:scale-110 transition z-10 ml-[-30px] sm:ml-[-50px]"
        >
          ◀
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/30 backdrop-blur-md rounded-full p-3 shadow hover:bg-white/50 hover:scale-110 transition z-10 mr-[-30px] sm:mr-[-50px]"
        >
          ▶
        </button>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalSections }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSection(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === activeIndex ? 'bg-red-500 scale-110' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* View All Button */}
        <div className="flex justify-center mt-12">
               <Link
                 to="/Shop"
                 className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
               >
                 View More
               </Link>
             </div>


    </div>
  );
};

export default LatestColection;
