import React, { useRef, useState, useEffect } from 'react';
import Shop from './Shop';

// 🔄 AnimatedSection — animates children smoothly
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => currentRef && observer.unobserve(currentRef);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
};

const ShopAnim = () => {
  return (
    <div className='mt-10'> 
        <AnimatedSection>
      <Shop />
    </AnimatedSection></div>
   
  );
};

export default ShopAnim;
