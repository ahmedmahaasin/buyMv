import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopConstext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import SocialMedia from "../components/SocialMedia";
import RelatedProducts from "../components/RelatedProducts";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

// AnimatedSection component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = React.useRef();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(false); // replay animation
        }
      },
      { threshold: 0.1 }
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
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart,Brands } = useContext(ShopConstext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
      }
    });
  }, [productId, products]);

const handleBuyNow = () => {
  const hasSizes = productData.sizes && productData.sizes.length > 0;

  // ✅ Only require size if the product has sizes
  if (hasSizes && !size) {
    toast.error("Select Product Size");
    return;
  }

  // 🔹 Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    toast.info("Please login to continue");
    return;
  }

  // 🔹 Add to cart and navigate to cart page
  addToCart(productData._id, hasSizes ? size : "Default");
  navigate("/cart");
};
  return productData ? (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen py-12 px-6 sm:px-12 pt-28">
      <AnimatedSection delay={0}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* ------- Image Gallery ------- */}
          <AnimatedSection delay={100}>
            <div>
              <div className="bg-white/40 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={image}
                  alt="Product"
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {productData.image.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    alt={`Thumbnail ${index}`}
                    onClick={() => setImage(item)}
                    className={`h-16 w-16 rounded-lg cursor-pointer border-2 transition-all ${
                      item === image
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ------- Product Details ------- */}
          <AnimatedSection delay={200}>
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {productData.name}
              </h1>

              {/* Reviews */}
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <img key={i} src={assets.star_icon} alt="star" className="w-4" />
                ))}
                <img src={assets.star_dull_icon} alt="star" className="w-4" />
                <p className="ml-2 text-gray-500 text-sm">(122 reviews)</p>
              </div>

              {/* Price */}
              <p className="text-2xl font-extrabold text-blue-600">
                {currency}{productData.price}
              </p>

              {/* Stock Status */}
              <span
                className={`inline-block px-4 py-1 text-sm font-medium rounded-full backdrop-blur-md shadow ${
                  productData.qty <= 0 
                    ? "hidden"
                    : "bg-green-500/80 text-white"
                }`}
              >
                {productData.qty <= 0 ? "" : "AVAILABLE"}
              </span>

              <p className="text-gray-700 leading-relaxed">{productData.description}</p>

              {/* Size Selector */}
              {productData.sizes.length <= 0?"":
                <div>
                <h3 className="text-lg font-semibold text-gray-800">Choose a variant</h3>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {productData.sizes.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSize(item)}
                      className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
                        item === size
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>}

              {/* ------- Brand Info ------- */}
<p className="text-lg font-semibold text-gray-800">Brand</p>
{Brands && productData.brand && (
  <div className="flex items-center gap-3 mt-4">
    {Brands.filter(b => b.id === productData.brand).map((brand) => (
      <button
        key={brand.id}
        onClick={() =>
          navigate(`/shop?brand=${encodeURIComponent(brand.id)}`)
        }
        className="flex items-center gap-2 bg-white/40 backdrop-blur-lg px-3 py-2 rounded-xl shadow hover:scale-105 transition-transform duration-200"
      >
        <img
          src={brand.Brand_image[0]}
          alt={brand.Brand_name}
          className="h-8 object-contain"
        />
        <span className="text-gray-700 font-medium">{brand.Brand_name}</span>
      </button>
    ))}
  </div>
)}

              {/* Actions */}
              {productData.qty <= 0 ? 
              <div className="flex flex-col sm:flex-row gap-4 w-1/2"> 
              <button
                  
                  className="flex-1 border-gray-500 border-2  text-gray-500 py-3 rounded-xl shadow hover:bg-gray-800 transition"
                >
                  Out of Stock
                </button></div> :
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addToCart(productData._id, size)}
                  className="flex-1 bg-black text-white py-3 rounded-xl shadow hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl shadow hover:bg-blue-600 transition"
                >
                  Buy Now
                </button>
              </div>}

              {/* Policies */}
              <ul className="pt-3 text-sm text-gray-600 space-y-2 border-t">
                <li>✔ 100% Original Products</li>
                <li>✔ Cash on Delivery Available</li>
                <li>✔ Easy Return Policy within 7 days</li>
              </ul>

              <SocialMedia />
            </div>
          </AnimatedSection>
        </div>
      </AnimatedSection>

      {/* ------- Product Video ------- */}
      {productData.video && (
        <AnimatedSection delay={300}>
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="font-bold text-gray-800 text-xl mb-4">Product Video</h3>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-blue-500">
              {productData.videoFr === "Drive" ? (
                <div className="relative pb-[56.25%]">
                  <iframe
                    src={productData.video}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin"
                  ></iframe>
                </div>
              ) : (
                <div className="relative pb-[56.25%]">
                  <ReactPlayer
                    url={productData.video}
                    controls
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0 rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ------- Description & Reviews ------- */}
      <AnimatedSection delay={400}>
        <div className="max-w-5xl mx-auto mt-20">
          <div className="flex border-b text-sm">
            <button className="px-6 py-3 font-semibold border-b-2 border-blue-500 text-blue-600">
              Description
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              Reviews (122)
            </button>
          </div>
          <div className="p-6 text-gray-600 leading-relaxed">
            {productData.long_description}
          </div>
        </div>
      </AnimatedSection>

      {/* ------- Related Products ------- */}
      <AnimatedSection delay={500}>
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </AnimatedSection>
    </div>
  ) : (
    <div className="min-h-screen flex justify-center items-center">
      <p>Loading...</p>
    </div>
  );
};

export default Product;
