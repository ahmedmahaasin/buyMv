import React, { useRef, useState, useEffect } from 'react';
import Hero from '../components/Hero';
import LatestColection from '../components/LatestColection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsLetter from '../components/NewsLetter';
import TopBrands from '../components/TopBrands';
import TopCategories from '../components/TopCategories';

// 🔄 AnimatedSection — animates when it comes into view, supports optional bounce
const AnimatedSection = ({ children, className = '', bounce = false }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!bounce) observer.unobserve(entry.target); // stop observing if no bounce
        } else if (bounce) {
          setIsVisible(false); // reset visibility so bounce triggers again
        }
      },
      {
        threshold: window.innerWidth <= 640 ? 0.05 : 0.1,
        rootMargin:
          window.innerWidth <= 640 ? '0px 0px -5%' : '-10% 0px -10% 0px',
      }
    );

    const current = ref.current;
    if (current) observer.observe(current);

    return () => current && observer.unobserve(current);
  }, [bounce]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${isVisible && bounce ? 'animate-bounce-custom' : ''}`}
    >
      {children}
    </div>
  );
};

// 🏠 Home Page
const Home = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* 🟣 Hero Section — Fullscreen */}
      <Hero />

      {/* 🟢 Main Content Sections */}
      <div className="flex flex-col gap-20 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto py-16">
        {/* Latest Collection — bounce every time */}
        <AnimatedSection bounce={true}>
          <LatestColection />
        </AnimatedSection>

         {/* Top categories */}
        <AnimatedSection>
          <TopCategories/>
        </AnimatedSection>

        {/* Best Seller */}
        <AnimatedSection>
          <BestSeller />
        </AnimatedSection>

        {/* Our Policy */}
        <AnimatedSection>
          <OurPolicy />
        </AnimatedSection>
         {/* Top Brands */}
        <AnimatedSection>
          <TopBrands />
        </AnimatedSection>

        {/* Newsletter */}
        <AnimatedSection bounce={true}>
          <NewsLetter />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Home;
