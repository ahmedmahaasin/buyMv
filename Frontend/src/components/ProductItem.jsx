import React, { useContext } from "react";
import { ShopConstext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, status }) => {
  const { currency } = useContext(ShopConstext);

  return (
    <Link
      to={`/product/${id}`}
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
    >
      <div
        className="flex flex-col bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-95 relative group w-full max-h-[4in] h-full"
      >
        {/* Product Image */}
        <div className="flex-grow w-full rounded-2xl overflow-hidden relative">
          <img
            src={image[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Hover Button */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
            <button className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-white/25 transition transform">
              View Details
            </button>
          </div>
        </div>

        {/* Product Info fixed at bottom */}
        <div className="flex flex-col gap-1 mt-4 px-3 pb-4">
          <h3 className="text-gray-900 font-semibold text-lg line-clamp-2">
            {name}
          </h3>
          <p className="text-red-600 font-bold text-md">
            {currency}
            {price}
          </p>
          <span
            className={`text-xs font-semibold ${
               status  <= 0 ?
                "text-red-500"
                : "text-green-500"
            }`}
          >
            { status  <= 0 ? "Out of Stock" : "Available"}
          </span>
         
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
