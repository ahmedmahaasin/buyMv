import React, { useState } from "react";
import { assets } from "../assets/assets";
import { FaBars } from "react-icons/fa";
import SideBar from "./SideBar";
import { frontendUrl } from "../App";

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 bg-white shadow-md z-0 h-16">
        {/* LEFT: Hamburger + Logo */}
        <div className="flex items-center gap-2">
          {/* Hamburger for mobile */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors md:hidden"
          >
            <FaBars size={20} />
          </button>

          {/* Logo */}
          <div className="flex md:hidden items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <img src={assets.logo} alt="Logo" className="w-7 h-7" />
            </div>
            <span className="ml-2 font-bold text-gray-800 text-lg">
              BUY<span className="text-blue-500">MV</span>
            </span>
          </div>
        </div>

        {/* CENTER: Optional title / breadcrumbs */}
        <div className="hidden md:flex items-center justify-center flex-1">
          {/* Optional title or breadcrumbs */}
        </div>

        {/* RIGHT: Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={frontendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-md"
          >
            <img
              src={assets.order_icon}
              alt="Frontend"
              className="w-5 h-5 filter invert"
            />
            <span className="font-medium">Frontend</span>
          </a>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-40 md:hidden flex transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Semi-transparent overlay */}
        <div
          className="fixed inset-0 bg-black opacity-30"
          onClick={toggleSidebar}
        ></div>

        {/* Sidebar */}
        <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <SideBar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>
    </>
  );
};

export default NavBar;
