import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopConstext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import SearchIcone from "../Icons/SearchIcone";
import CartIcon from "../Icons/CartIcon";
import MbMenuIcon from "../Icons/MbMenuIcon";
import AccountsIcon from "../Icons/AccountsIcon";
import UserCard from "./UserCard";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopConstext);
  const location = useLocation();
  const navigate = useNavigate();
  const accountRef = useRef();

  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredCart, setIsHoveredCart] = useState(false);
  const [isHoveredAcc, setIsHoveredAcc] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearchClick = () => {
    if (location.pathname !== "/shop") navigate("/shop");
    setShowSearch(true);
  };

  const accent = "#d11002";
  const hovertColor = "#fcbd00";
  const defaultColor = "#000000";

  return (
    <>
      <nav className="fixed w-full z-50">
        <div className="relative backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-lg rounded-b-2xl overflow-hidden animate-liquid">
          <div className="absolute inset-0 rounded-b-2xl bg-gradient-to-b from-white/50 via-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 rounded-b-2xl bg-gradient-to-r from-white/40 via-white/30 to-white/5 opacity-20 pointer-events-none"></div>

          <div className="max-w-7xl bg-gradient-to-r lg:bg-none from-white mx-auto flex items-center justify-between px-6 py-2 relative z-10">
            {/* Logo */}
            <div className="flex gap-3 justify-center items-center font-bold text-2xl">
              <Link to="/" className="flex items-center gap-2">
                <img src={assets.logo} alt="Logo" className="h-10 sm:h-12" />
              </Link>
              <h1 className="text-[var(--default)]" style={{ "--default": defaultColor }}>BUY</h1>
              <h1 className="text-[var(--default)]" style={{ "--default": accent }}>MV</h1>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden sm:flex gap-8 text-[var(--text)] font-medium" style={{ "--text": defaultColor }}>
              {["/", "/shop", "/contact", "/about"].map((path, idx) => (
                <NavLink
                  key={idx}
                  to={path}
                  className={({ isActive }) =>
                    `relative hover:text-[var(--h)] font-bold p-2 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:transition-all hover:after:w-full ${isActive ? "text-[var(--default)] px-3 after:w-full bg-white/30 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30" : ""
                    }`
                  }
                  style={{ "--default": accent, "--h": hovertColor }}
                >
                  {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
                </NavLink>
              ))}
            </ul>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <div className="flex bg-white/30 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30">
                {/* Search */}
                <button
                  onClick={handleSearchClick}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="p-2 rounded-full sm:hover:bg-white/20 transition"
                >
                  <div className="w-7 p-1">
                    <SearchIcone mainColor={isHovered ? accent : defaultColor} />
                  </div>
                </button>

                {/* Cart */}
                <Link to="/cart" className="relative transition">
                  <button
                    onMouseEnter={() => setIsHoveredCart(true)}
                    onMouseLeave={() => setIsHoveredCart(false)}
                    className="p-2 rounded-full hover:bg-white/20 transition hidden sm:block"
                  >
                    <div className="w-7 p-1">
                      <CartIcon mainColor={isHoveredCart ? accent : defaultColor} />
                    </div>
                  </button>
                  {getCartCount() > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 text-[10px] text-white bg-[#F54927] rounded-full hidden sm:flex items-center justify-center font-bold">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={accountRef}>
  <button
    onClick={() => {
      const token = localStorage.getItem("token");
      if (token) {
        // Toggle dropdown if logged in
        setAccountDropdown(prev => !prev);
      } else {
        // Redirect to login if not logged in
        navigate("/login");
      }
    }}
    className="p-2 rounded-full hover:bg-white/20 transition hidden sm:block"
  >
    <div className="w-7 p-1">
      <AccountsIcon mainColor={isHoveredAcc ? accent : defaultColor} />
    </div>
  </button>

  {/* UserCard Dropdown */}
  {localStorage.getItem("token") && (
    <UserCard
      anchorRef={accountRef}
      visible={accountDropdown}
      onClose={() => setAccountDropdown(false)}
    />
  )}
</div>


                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenu(true)}
                  className="sm:hidden p-2 rounded-full hover:bg-white/20 transition"
                >
                  <div className="w-7 p-1">
                    <MbMenuIcon mainColor={"black"} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {mobileMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[998]" onClick={() => setMobileMenu(false)}></div>
          <div className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white/10 backdrop-blur-xl border-l border-white/20 z-[999] shadow-2xl transform transition-transform duration-300 overflow-hidden rounded-l-3xl">
            <div className="flex items-center justify-between p-4 border-b border-white/30 relative z-10">
              <span className="font-bold text-xl text-white">Menu</span>
              <button onClick={() => setMobileMenu(false)} className="text-white text-2xl focus:outline-none">✕</button>
            </div>

            <div className="p-5 px-6">
              <p className="font-bold text-white mb-3">MAIN PAGES</p>
              <ul className="flex flex-col gap-3">
                {["Home", "Shop", "Contact", "About"].map((item, idx) => (
                  <NavLink
                    key={idx}
                    onClick={() => setMobileMenu(false)}
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className={({ isActive }) =>
                      `py-2 px-3 rounded-lg transition-all text-white hover:bg-white/20 hover:translate-x-1 ${isActive ? "bg-white/20 font-semibold shadow-md" : ""
                      }`
                    }
                  >
                    {item.toUpperCase()}
                  </NavLink>
                ))}
              </ul>
            </div>

            <div className="p-5 px-6 mt-6">
              <p className="font-bold text-white mb-3">OTHER PAGES</p>
              <NavLink
                to="/brands"
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `block py-2 px-11 rounded-lg transition-all text-white text-start font-medium hover:scale-105 ${isActive ? "bg-white/20 font-semibold shadow-md" : ""
                  }`
                }
              >
                ALL BRANDS
              </NavLink>
              <NavLink
                to="/Categoires"
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `block py-2 px-11 rounded-lg transition-all text-white text-start font-medium hover:scale-105 ${isActive ? "bg-white/20 font-semibold shadow-md" : ""
                  }`
                }
              >
                ALL CATEGORIES
              </NavLink>
            </div>
          </div>
        </>
      )}

      {/* Liquid Animation */}
      <style>{`
        @keyframes liquid {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-liquid {
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.15),
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.2),
            rgba(255,255,255,0.05)
          );
          background-size: 400% 400%;
          animation: liquid 10s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Navbar;
