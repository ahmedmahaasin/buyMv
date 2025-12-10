import React, { useRef, useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { ShopConstext } from "../context/ShopContext";

// Animated fade + slide section
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => currentRef && observer.unobserve(currentRef);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {children}
    </div>
  );
};

const Hero = () => {
  const { hero_section } = useContext(ShopConstext);
  const navigate = useNavigate();
  const playerRef = useRef(null);

  // hero_section is now assumed to be a single object
  const heroData = hero_section || {};

  const videoLink = heroData.bg_video_Link || "https://www.youtube.com/embed/bXhtfvZjt4c";
  const TextOne = heroData.Text1 || "Our Best Sellers";
  const TextTwo = heroData.Text2 || "Explore Modern Collections";
  const TextThree = heroData.Text3 || "Discover our premium collection with a blend of style, comfort, and creativity.";
  const btn_Name = heroData.btn_Name || "Shop Now";
  const btn_url = heroData.btn_Link || "/shop";
  const image = heroData.image || assets.hero_img;

  const handleShopNow = () => navigate(btn_url);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto play/pause logic for video
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (playerRef.current) {
          const player = playerRef.current.getInternalPlayer?.();
          if (entry.isIntersecting) {
            player?.playVideo?.() || player?.play?.();
          } else {
            player?.pauseVideo?.() || player?.pause?.();
          }
        }
      },
      { threshold: 0.3 }
    );

    if (playerRef.current) observer.observe(playerRef.current.wrapper);
    return () => {
      if (playerRef.current) observer.unobserve(playerRef.current.wrapper);
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden xl:block">
        <ReactPlayer
          ref={playerRef}
          url={videoLink}
          playing
          muted
          loop
          controls={false}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: {
                rel: 0,
                modestbranding: 1,
                vq: "hd1080",
                iv_load_policy: 3,
                showinfo: 0,
                playsinline: 1,
              },
            },
          }}
          className="absolute top-0 left-0 w-full h-full object-cover scale-125"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content Section */}
      <div className="relative z-20 w-full max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-center h-full px-6 sm:px-12 lg:px-24 gap-10 sm:gap-20">
        {/* Left Text */}
        <div className="sm:w-1/2 flex flex-col justify-center items-center sm:items-end text-center sm:text-right space-y-6 sm:space-y-8">
          <AnimatedSection delay={100}>
            <span className="uppercase tracking-wide text-white text-sm md:text-base">
              {TextOne}
            </span>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-snug mt-2">
              {TextTwo}
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <p className="text-white text-sm md:text-base max-w-md mt-2">
              {TextThree}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={700}>
            <button
              onClick={handleShopNow}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition"
            >
              {btn_Name}
            </button>
          </AnimatedSection>
        </div>

      
{/* Right Image */}
{heroData.image ? (
  <div className="sm:w-1/2 flex justify-center items-center mt-10 sm:mt-0 ">
    <AnimatedSection delay={200}>
      <div className="relative transform transition-all duration-700 hover:scale-105 hover:-rotate-3 shadow-2xl rounded-3xl overflow-hidden max-h-[450px] sm:max-h-[550px] w-full">
        <img
          src={Array.isArray(heroData.image) ? heroData.image[0] : heroData.image}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent rounded-3xl"></div>
      </div>
    </AnimatedSection>
  </div>
) : null}



      </div>
    </div>
  );
};

export default Hero;
