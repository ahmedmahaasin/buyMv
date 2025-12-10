import React, { useEffect, useRef, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import SocialMedia from '../components/SocialMedia';
import NewsLetter from '../components/NewsLetter';

// 🔄 AnimatedSection — animates every time it comes into view
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay); // staggered delay
        } else {
          setIsVisible(false); // reset when leaving viewport
        }
      },
      { threshold: 0.1 } // triggers when 10% visible
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
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

const Contact = () => {
  return (
    <div className="bg-gray-50 text-gray-800 mt-12">
      {/* Title Section */}
      <AnimatedSection className="text-center text-2xl p-5" delay={0}>
        <Title text1={'CONTACT'} text2={'US'} />
      </AnimatedSection>

      {/* Contact Details Section */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 px-6  lg:px-20 items-center">
        {/* Image */}
        <AnimatedSection delay={100}>
          <img
            src={assets.contact_img}
            className="w-full max-w-[480px] rounded-2xl shadow-md"
            alt="Contact Us"
          />
        </AnimatedSection>

        {/* Text + Social Media */}
        <AnimatedSection
          className="flex flex-col justify-center items-start gap-6 backdrop-blur-md bg-white/40 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500"
          delay={200}
        >
          <p className="font-semibold text-xl text-gray-600">OUR STORE</p>
          <p className="text-gray-500">
            Xtreemvia, Alikilagefaanu Magu, <br /> GA. Maamendhoo
          </p>
          <p className="text-gray-500">
            Tel: +(960) 784 4453 <br /> Email: buymv@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-600">Careers at Buy.mv</p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-3 rounded-lg text-sm hover:text-white hover:bg-black transition-all duration-500">
            Explore Jobs
          </button>
          <SocialMedia />
        </AnimatedSection>
      </div>

      {/* Newsletter */}
      <AnimatedSection delay={400}>
        <NewsLetter />
      </AnimatedSection>
    </div>
  );
};

export default Contact;

