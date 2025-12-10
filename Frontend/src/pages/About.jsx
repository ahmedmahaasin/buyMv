import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import NewsLetter from '../components/NewsLetter';
import WhiteTitle from '../components/WhiteTitle';
import TopBrands from '../components/TopBrands';

// 🔄 AnimatedSection — animates every time it comes into view
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay); // stagger delay
        } else {
          setIsVisible(false); // reset when out of view
        }
      },
      {
        threshold: 0.1, // animate when 10% visible
      }
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

// About Page
const About = () => {
  const cards = [
    {
      title: 'Quality Assurance',
      desc: 'We prioritize quality using premium materials and advanced printing techniques, ensuring vibrant colors, durable prints, and perfect fit.',
      iconColor: 'bg-blue-400',
    },
    {
      title: 'Convenience',
      desc: 'Our platform makes custom jersey design and ordering easy and convenient with intuitive tools and seamless delivery.',
      iconColor: 'bg-green-400',
    },
    {
      title: 'Exceptional Customer Service',
      desc: 'Our dedicated team provides personalized support, from design assistance to addressing concerns, ensuring a smooth and satisfying experience.',
      iconColor: 'bg-pink-400',
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <AnimatedSection className="relative text-center py-20 pt-36 bg-cover bg-center" delay={0}>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <WhiteTitle textA={'ABOUT'} textB={'US'} className="text-5xl font-bold text-gray-900" />
          <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-700">
            Buy.mv is a creative platform specializing in custom jersey printing and design services.
          </p>
        </div>
      </AnimatedSection>

      {/* Image and Text Section */}
      <div className="my-16 px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        <AnimatedSection
          className="flex-1 backdrop-blur-md bg-white/40 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-500"
          delay={100}
        >
          <p className="mb-4">
            Buy.mv is dedicated to creating personalized jerseys with unique designs tailored to your preferences. Whether for sports teams, events, or personal use, Buy.mv offers high-quality printing and innovative design options to bring your vision to life.
          </p>
          <b className="text-xl mb-2 block">Our Mission</b>
          <p>
            Our mission at Buy.mv is to deliver exceptional custom jersey designs that celebrate individuality, foster team spirit, and exceed customer expectations with creativity, quality, and dedication.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <img
            src={assets.about_img}
            alt="About Us"
            className="w-full max-w-[450px] rounded-3xl shadow-lg"
          />
        </AnimatedSection>
      </div>

      {/* Why Choose Us Section */}
      <AnimatedSection className="text-center py-12 px-6 lg:px-20" delay={300}>
        <WhiteTitle textA={'WHY'} textB={'CHOOSE US'} className="text-4xl text-gray-900" />
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6 lg:px-20 mb-20">
        {cards.map((item, index) => (
          <AnimatedSection
            key={index}
            className="flex flex-col items-center backdrop-blur-md bg-white/40 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500"
            delay={400 + index * 150} // stagger cards
          >
            <div className={`${item.iconColor} text-white p-5 rounded-full mb-6`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12"
              >
                <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm1 14h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <b className="text-xl mb-4">{item.title}</b>
            <p className="text-gray-700 text-center">{item.desc}</p>
          </AnimatedSection>
        ))}
      </div>

      {/*Top Brands Section */}

      <AnimatedSection delay={700}>
        <TopBrands titleA={"center"}/>
      </AnimatedSection>

      {/* Newsletter Section */}
      <AnimatedSection delay={700}>
        <NewsLetter />
      </AnimatedSection>
    </div>
  );
};

export default About;
