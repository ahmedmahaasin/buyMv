import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

import Dashboard from "./pages/Dashboard";

import AddBrand from "./pages/Products/AddBrands";
import AddProducts from "./pages/Products/AddProducts";
import AddCategories from "./pages/Products/AddCategories";
import AddSubCategories from "./pages/Products/AddSubCategories";
import AllBrands from "./pages/Products/AllBrands";
import AllCategories from "./pages/Products/AllCategories";
import AllSubCategories from "./pages/Products/AllSubCategories";
import AllProducts from "./pages/Products/AllProducts";

import AllOrders from "./pages/Orders/AllOrders";
import CompletedOrders from "./pages/Orders/CompletedOrders";
import ConfirmedOrders from "./pages/Orders/ConfiremedOrders";
import PendingOrders from "./pages/Orders/PendingOrders";

import DeliveryMethods from "./pages/WebsiteSettings/DeliveryMethods";
import Slider from "./pages/WebsiteSettings/Slider";

import WebsiteInformation from "./pages/WebsiteSettings/WebsiteInformation";

import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const frontendUrl = import.meta.env.VITE_FRONTEND_URL;


const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <ToastContainer />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          {/* Sidebar: overlay on mobile, static on desktop */}
          <SideBar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            setToken={setToken}
          />

          {/* Main Area */}
          <div
            className={`flex flex-col flex-1 min-h-screen transition-all duration-300
                        ${isSidebarOpen ? "overflow-hidden" : "overflow-auto"}
                        md:ml-64`}
          >
            {/* Navbar */}
            <div className="sticky top-0 z-40">
              <NavBar toggleSidebar={toggleSidebar} />
            </div>

            {/* Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 w-full mt-12">
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />

                {/* Product Routes */}
                <Route path="/add-brand" element={<AddBrand token={token}  />} />
                <Route path="/add-product" element={<AddProducts token={token} />} />
                <Route path="/add-category" element={<AddCategories token={token}/>} />
                <Route path="/add-sub-category" element={<AddSubCategories token={token}/>} />
                <Route path="/brands" element={<AllBrands token={token} />} />
                <Route path="/categories" element={<AllCategories token={token} />} />
                <Route path="/sub-categories" element={<AllSubCategories token={token}/>} />
                <Route path="/products" element={<AllProducts token={token}/>} />

                {/* Orders */}
                <Route path="/orders" element={<AllOrders token={token}/>} />
                <Route path="/orders/pending" element={<PendingOrders token={token}/>} />
                <Route path="/orders/confirmed" element={<ConfirmedOrders token={token}/>} />
                <Route path="/orders/completed" element={<CompletedOrders token={token}/>} />

                {/* Website Settings */}
                <Route path="/info" element={<WebsiteInformation token={token}/>} />
                <Route path="/slider" element={<Slider token={token} />} />
                <Route path="/delivery" element={<DeliveryMethods token={token}/>} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
