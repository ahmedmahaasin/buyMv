import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";

// ✅ Reusable AnimatedSection Component (animates every time)
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Animate when entering viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset when leaving viewport
          setIsVisible(false);
        }
      },
      { threshold: 0.2 } // triggers slightly before fully visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
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

// ✅ OurPolicy Section (with repeatable animation)
const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange Policy",
      desc: "15-day exchanges with receipt.",
    },
    {
      icon: assets.quality_icon,
      title: "7 Days Return Policy",
      desc: "We provide a free 7-day return policy.",
    },
    {
      icon: assets.support_img,
      title: "Best Customer Support",
      desc: "We’re here for you 24/7 — anytime, anywhere.",
    },
  ];

  return (
    <AnimatedSection className="py-20 px-4 sm:px-8 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <AnimatedSection className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          OUR{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
            POLICIES
          </span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
          Providing you the best service experience — from returns to support.
        </p>
      </AnimatedSection>

      {/* Policy Cards */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-around items-stretch gap-6 sm:gap-8">
        {policies.map((policy, index) => (
          <AnimatedSection
            key={index}
            delay={index * 0.1}
            className="flex flex-col items-center text-center bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 p-8"
          >
            <div className="w-16 h-16 flex items-center justify-center mb-4 bg-gradient-to-br from-yellow-100 to-red-100 rounded-full shadow-inner">
              <img src={policy.icon} alt={policy.title} className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {policy.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">{policy.desc}</p>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default OurPolicy;
