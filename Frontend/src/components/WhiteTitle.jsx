import React, { useEffect, useState } from 'react';

const WhiteTitle = ({ textA, textB }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // animate immediately when mounted
  }, []);

  return (
    <div className="overflow-hidden relative">
      <div className="inline-flex items-center gap-3 mb-3 relative">
        {/* Text sliding & scaling in */}
        <p
          className={`text-gray-900 text-3xl sm:text-4xl font-bold transform transition-all duration-800 ease-out ${
            animate
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-6 opacity-0 scale-95'
          }`}
        >
          {textA}
          <span className="text-gray-500 font-medium ml-2">{textB}</span>
        </p>

        {/* Animated underline with gradient */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full scale-x-0 origin-left transition-transform duration-1000 ease-out"
             style={{ transform: animate ? 'scaleX(1)' : 'scaleX(0)' }}
        ></div>
      </div>
    </div>
  );
};

export default WhiteTitle;
