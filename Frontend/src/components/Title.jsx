import React from "react";

const Title = ({ text1, text2, align }) => {
  // For mobile: always center. For larger screens: use align prop.
  const containerAlignment =
    align === "center"
      ? "items-center"
      : "sm:items-start items-center"; // sm+ follows left, mobile always center
  const textAlignment =
    align === "center"
      ? "text-center"
      : "sm:text-left text-center"; // sm+ follows left, mobile always center
  const lineMargin =
    align === "center"
      ? "mx-auto"
      : "sm:ml-0 mx-auto"; // line is centered on mobile, left on larger screens if align left

  return (
    <div className={`flex flex-col ${containerAlignment} gap-3 mb-10 px-2`}>
      {/* Title */}
      <h2
        className={`${textAlignment} text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight relative leading-snug`}
      >
        <span className="text-gray-400">{text1} </span>
        <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent animate-pulse">
          {text2}
        </span>
      </h2>

      {/* Animated Line */}
      <div
        className={`relative w-16 sm:w-24 md:w-32 h-[2px] bg-gray-200 overflow-hidden rounded ${lineMargin}`}
      >
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-600 to-yellow-500 animate-slide"></div>
      </div>

      <style>
        {`
          @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-slide {
            animation: slide 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Title;
