import React, { useRef, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import SocialMedia from './SocialMedia';
import { Link } from 'react-router-dom';

// 🔄 AnimatedSection — replays when visible again
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger when it enters viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset when out of view (so it can animate again later)
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
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
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="  bg-gradient-to-tr from-yellow-100 via-red-100 to-orange-100 mt-32 px-4 sm:px-16 py-12 z-0  ">
      <div className="flex flex-col lg:grid lg:grid-cols-[3fr_1fr_1fr] gap-10 sm:gap-14 mb-10">

        {/* Branding */}
        <AnimatedSection delay={0}>
          <div className="relative flex flex-col gap-4 items-center sm:items-start 
                          bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-lg overflow-hidden animate-liquid">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-white/0 to-white/5 opacity-20 pointer-events-none"></div>
            <img className="w-32 mb-3 relative z-10" src={assets.logo} alt="Buy MV Logo" />
            <p className="text-gray-800 text-center sm:text-left relative z-10 md:w-2/3">
              Buy MV is your one-stop online store for clothing, tech gadgets, food, and more—offering a wide range of quality products delivered right to your doorstep.
            </p>
            <div className="relative z-10">
              <SocialMedia />
            </div>
          </div>
        </AnimatedSection>

        {/* Company Links */}
        <AnimatedSection delay={0.2}>
          <div className="relative flex flex-col w-full sm:h-full gap-4 items-center sm:items-start 
                          bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-lg overflow-hidden animate-liquid">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-white/0 to-white/5 opacity-20 pointer-events-none"></div>
            <p className="text-xl font-semibold mb-3 relative z-10">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-800 text-center sm:text-left relative z-10">
              <li className="hover:text-red-600 cursor-pointer transition">Home</li>
              <li className="hover:text-red-600 cursor-pointer transition">About Us</li>
              <li className="hover:text-red-600 cursor-pointer transition">Delivery</li>
              <li className="hover:text-red-600 cursor-pointer transition">Privacy Policy</li>
            </ul>
          </div>
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection delay={0.4}>
          <div className="relative flex flex-col gap-4 w-full sm:h-full items-center sm:items-start 
                          bg-white/15 backdrop-blur-lg rounded-2xl p-7 shadow-lg overflow-hidden animate-liquid">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-white/0 to-white/5 opacity-20 pointer-events-none"></div>
            <p className="text-xl font-semibold mb-3 relative z-10">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-800 text-center sm:text-left relative z-10">
              <li>+960 7844453 / +960 9595736</li>
              <li>BuyMv@gmail.com</li>
            </ul>

            <div className="flex justify-center mt-12 relative z-10">
              <Link
                to="/contact"
                className="relative px-8 py-3 rounded-xl font-semibold text-white shadow-lg overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20" />
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600 to-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Contact Us</span>
              </Link>
            </div>
          </div>
        </AnimatedSection>

      </div>

      <hr className="border-gray-300/50 relative z-10" />
      <p className="py-5 text-sm text-center text-gray-500 relative z-10">
        &copy; 2024 Buy MV. All Rights Reserved.
      </p>

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
            rgba(255,255,255,0.15),
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.2),
            rgba(255,255,255,0.05)
          );
          background-size: 400% 400%;
          animation: liquid 10s ease infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
