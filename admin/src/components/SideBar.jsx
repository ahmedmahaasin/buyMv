import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { assets } from "../assets/assets";

const SideBar = ({ isOpen, toggleSidebar, setToken }) => {
  const [openSection, setOpenSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Auto open section if any item is active
    ["Products", "Sales", "Website Settings"].forEach((section) => {
      const items = getSectionItems(section);
      if (items.some((item) => item.to === location.pathname)) {
        setOpenSection(section);
      }
    });
  }, [location.pathname]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const productsItems = [
    { to: "/add-product", label: "Add New Product", icon: assets.add_icon },
    { to: "/add-brand", label: "Add New Brand", icon: assets.add_icon },
    { to: "/add-category", label: "Add New Category", icon: assets.add_icon },
    { to: "/add-sub-category", label: "Add New Sub Category", icon: assets.add_icon },
    { to: "/products", label: "All Products", icon: assets.order_icon },
    { to: "/brands", label: "All Brands", icon: assets.order_icon },
    { to: "/categories", label: "All Categories", icon: assets.order_icon },
    { to: "/sub-categories", label: "All Sub Categories", icon: assets.order_icon },
  ];

  const salesItems = [
    { to: "/orders", label: "All Orders", icon: assets.order_icon },
    { to: "/orders/pending", label: "Pending Orders", icon: assets.order_icon },
    { to: "/orders/confirmed", label: "Confirmed Orders", icon: assets.order_icon },
    { to: "/orders/completed", label: "Completed Orders", icon: assets.order_icon },
  ];

  const settingsItems = [
    { to: "/slider", label: "Slider", icon: assets.order_icon },
     
    
    { to: "/delivery", label: "Delivery Methods", icon: assets.order_icon },
  ];

  const getSectionItems = (title) => {
    if (title === "Products") return productsItems;
    if (title === "Sales") return salesItems;
    if (title === "Website Settings") return settingsItems;
    return [];
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 mb-4 rounded-lg transition-colors duration-200 font-semibold ${
      isActive ? "bg-gray-700 text-white" : "text-gray-200 hover:bg-gray-700"
    }`;

  const getSectionItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-gray-700 text-white" : "text-gray-200 hover:bg-gray-700"
    }`;

  const isSectionActive = (items) => items.some((item) => item.to === location.pathname);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-64 h-screen bg-gray-900 text-gray-100 shadow-xl transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}
    >
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
          <FaTimes size={20} />
        </button>
      </div>

      {/* Logo */}
      <div className="flex-shrink-0 p-4 bg-gray-900 flex flex-col items-center">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-2">
          <img src={assets.logo} alt="Logo" className="w-10 h-10" />
        </div>
        <span className="text-lg font-bold text-white mb-2">
          BUY<span className="text-blue-500">MV</span>
        </span>
        <div className="w-full border-t border-gray-800 mt-2"></div>
      </div>

      {/* Scrollable menu */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <NavLink to="/" end className={getNavLinkClass}>
          <div className="w-1 h-5 bg-blue-500 rounded-sm"></div>
          <span>DASHBOARD</span>
        </NavLink>

        {["Products", "Sales", "Website Settings"].map((section) => (
          <div className="mb-4" key={section}>
            <div
              className={`flex justify-between items-center px-4 py-2 uppercase text-sm font-bold rounded-md cursor-pointer transition-colors duration-200 ${
                isSectionActive(getSectionItems(section))
                  ? "text-white bg-gray-700"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => toggleSection(section)}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-sm"></div>
                <span>{section}</span>
              </div>
              {openSection === section ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {(openSection === section || isSectionActive(getSectionItems(section))) && (
              <div className="flex flex-col mt-2 pl-6 gap-1">
                {getSectionItems(section).map((item) => (
                  <NavLink key={item.to} to={item.to} end className={getSectionItemClass}>
                    <img src={item.icon} alt="" className="w-4 h-4 filter invert opacity-80" />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logout button */}
      <div className="flex-shrink-0 p-4 bg-gray-900">
        <div className="w-full border-t border-gray-800 mb-3"></div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setToken(""); // must be passed as prop
          }}
          className="w-full py-3 bg-gray-700 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
