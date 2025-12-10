import React from "react";

const SocialMedia = () => {
  const handlefbClick = () => {
    window.location.href = "https://www.facebook.com/";
  };
  const handleInstaClick = () => {
    window.location.href = "https://www.instagram.com/";
  };
  const handletTelegramClick = () => {
    window.location.href = "https://web.telegram.org/a/";
  };
  const handlexClick = () => {
    window.location.href = "https://x.com/__x?mx=2";
  };
  const handleYouTubeClick = () => {
    window.location.href = "https://www.youtube.com/";
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-2 mt-3">Visit Our social Media Pages:</p>

      <div className="flex items-center gap-5 mt-0">

        {/* FACEBOOK */}
        <svg
          onClick={handlefbClick}
          fill="currentColor"
          height="29px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="hover:fill-gray-500 transition-colors duration-300 cursor-pointer"
        >
          <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
        </svg>

        {/* INSTAGRAM */}
        <svg
          onClick={handleInstaClick}
          fill="currentColor"
          height="35px"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          className="hover:fill-gray-500 transition-colors duration-300 cursor-pointer"
        >
          <path d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z" />
          <path d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z" />
        </svg>

        {/* TELEGRAM */}
        <svg
          onClick={handletTelegramClick}
          height="25px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="telegram"
          className="fill-current text-black hover:text-gray-500 transition-colors duration-300 cursor-pointer"
        >
          <path d="m12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12c0-6.627-5.373-12-12-12zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
        </svg>

        {/* X / TWITTER */}
        <svg
          onClick={handlexClick}
          height="25px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="fill-current text-black hover:text-gray-500 transition-colors duration-300 cursor-pointer"
        >
          <path d="m18.9,1.153h3.682l-8.042,9.189,9.46,12.506h-7.405l-5.804-7.583-6.634,7.583H.469l8.6-9.831L0,1.153h7.593l5.241,6.931,6.065-6.931Zm-1.293,19.494h2.039L6.482,3.239h-2.19l13.314,17.408Z" />
        </svg>

        {/* YOUTUBE */}
        <svg
          onClick={handleYouTubeClick}
          fill="#000000"
          height="37px"
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current text-black hover:text-gray-500 transition-colors duration-300 cursor-pointer"
        >
          <path d="M941.3 296.1a112.3 112.3 0 0 0-79.2-79.3C792.2 198 512 198 512 198s-280.2 0-350.1 18.7A112.12 112.12 0 0 0 82.7 296C64 366 64 512 64 512s0 146 18.7 215.9c10.3 38.6 40.7 69 79.2 79.3C231.8 826 512 826 512 826s280.2 0 350.1-18.8c38.6-10.3 68.9-40.7 79.2-79.3C960 658 960 512 960 512s0-146-18.7-215.9zM423 646V378l232 133-232 135z" />
        </svg>

      </div>
    </div>
  );
};

export default SocialMedia;
