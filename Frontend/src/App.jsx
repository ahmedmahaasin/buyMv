import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Placeoder from "./pages/Placeoder";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Oders from "./pages/Oders";
import ShopAnim from "./pages/ShopAnim";
import AllBrands from "./pages/AllBrands";
import AllCategories from "./pages/AllCategories";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearcgBar from "./components/SearcgBar";
import IconBar from "./components/IconBar";
import ScrollToTop from "./components/ScrollToTop";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyAccount from "./pages/MyAccount";


// --- Layout Wrapper ---
const PageLayout = () => {
  return (
    <>
      {/* Search bar + scroll handler */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] max-w-screen-2xl mx-auto pt-12">
        <SearcgBar />
        <ScrollToTop />

        {/* Render page content here */}
        <Outlet />
      </div>
    </>
  );
};


const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Toasts */}
      <ToastContainer position="bottom-right" autoClose={2000} />

      {/* Main Content */}
      <main className="flex-grow">

        <Routes>
          {/* Home – separate because it needs no layout wrapper */}
          <Route path="/" element={<Home />} />

          {/* All other pages go through PageLayout */}
          <Route element={<PageLayout />}>

            <Route path="shop" element={<ShopAnim />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="product/:productId" element={<Product />} />
            <Route path="MyAccount" element={<MyAccount />} />
            
            {/* FIXED ROUTE NAME */}
            <Route path="placeorder" element={<Placeoder />} />

            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="orders" element={<Oders />} />
            <Route path="brands" element={<AllBrands />} />

            {/* FIXED TYPO */}
            <Route path="categories" element={<AllCategories />} />

          </Route>
        </Routes>

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating IconBar */}
      <IconBar />
    </div>
  );
};

export default App;
