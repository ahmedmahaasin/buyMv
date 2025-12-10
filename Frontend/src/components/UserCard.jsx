import React, { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopConstext } from "../context/ShopContext";

const UserCard = ({ visible, anchorRef, onClose }) => {
  const { setToken } = useContext(ShopConstext);
  const navigate = useNavigate();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (visible && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 10,
        left: rect.right - 200, // adjust for width
      });
    }
  }, [anchorRef, visible]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    onClose();
    navigate("/login");
  };

  if (!visible) return null;

  return createPortal(
    <div
      className="relative z-[9999]"
      style={{ position: "fixed", top: position.top, left: position.left }}
    >
      {/* Small arrow pointing to button */}
      <div className="absolute top-[-8px] right-4 w-3 h-3 bg-white rotate-45 shadow-md border-l border-t border-gray-200"></div>

      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-48 overflow-hidden">
        <div className="p-3 border-b border-gray-100">
          <p className="text-gray-700 font-semibold">Account</p>
        </div>
        <Link
          to="/MyAccount"
          onClick={onClose}
          className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          My Profile
        </Link>
        <NavLink
          to="/orders"
          onClick={onClose}
          className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          My Orders
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          Logout
        </button>
      </div>
    </div>,
    document.body
  );
};

export default UserCard;
