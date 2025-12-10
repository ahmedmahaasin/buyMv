import React from 'react';

const NewsLetter = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col rounded-lg items-center text-center py-16 px-4 bg-gradient-to-r from-yellow-100 via-red-50 to-orange-50">
      <p className="text-3xl sm:text-4xl font-bold text-gray-900">Subscribe & Stay Updated</p>
      <p className="text-gray-500 mt-4 max-w-2xl">
        Join our community today and stay updated. Don’t miss out—subscribe now to unlock the latest updates, special offers, and more!
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-3/4 lg:w-1/2 mt-8 flex flex-col sm:flex-row rounded-xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
      >
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 outline-none bg-transparent text-gray-900 placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-6 py-3 font-semibold hover:scale-105 transition-transform duration-300 sm:px-10 sm:py-4"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
