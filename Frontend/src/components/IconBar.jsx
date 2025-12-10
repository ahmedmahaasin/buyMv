import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShopConstext } from '../context/ShopContext';
import HomeIcon from '../Icons/HomeIcon';
import ShopIcon from '../Icons/ShopIcon';
import CartIcon from '../Icons/CartIcon';
import AccountsIcon from '../Icons/AccountsIcon';

const IconBar = () => {
  const { getCartCount } = useContext(ShopConstext);
  const location = useLocation();
  const navigate = useNavigate();
  const issActive = location.pathname;

  const accent = '#F54927';
  const defaultColor = "#000000";

  const icons = [
    {
      to: '/',
      label: 'Home',
      svg: <div className='w-[20px]'><HomeIcon mainColor={issActive === "/" ? accent : defaultColor} /></div>
    },
    {
      to: '/shop',
      label: 'Shop',
      svg: <div className='w-[20px]'><ShopIcon mainColor={issActive === "/shop" ? accent : defaultColor} /></div>
    },
    {
      to: '/cart',
      label: 'Cart',
      svg: (
        <div className='w-[20px] relative'>
          <CartIcon mainColor={issActive === "/cart" ? accent : defaultColor} />
          {getCartCount() > 0 && (
            <span
              className={`absolute -top-1 -right-1 min-w-[14px] h-[14px] text-[10px] flex items-center justify-center text-white rounded-full font-semibold shadow-sm ${issActive === "/cart" ? "bg-[var(--defaultColor)]" : "bg-[var(--accent)]"}`}
              style={{ "--accent": accent, "--defaultColor": defaultColor }}
            >
              {getCartCount()}
            </span>
          )}
        </div>
      )
    },
    {
      to: '/account', // keep account custom click
      label: 'Account',
      svg: <div className='w-[20px]'><AccountsIcon mainColor={issActive === "/MyAccount" ? accent : defaultColor} /></div>,
      onClick: () => {
        const token = localStorage.getItem("token");
        if (token) {
          navigate("/MyAccount");
        } else {
          navigate("/login");
        }
      }
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md sm:hidden z-50">
      {/* Glass & Refraction Effect */}
      <div className="relative flex justify-around items-center h-16 px-4
                      bg-white/10 backdrop-blur-lg border border-white/20
                      rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden animate-liquid">

        {/* Refraction Overlay */}
        <div className="absolute inset-0 rounded-3xl
                        bg-gradient-to-b from-white/30 via-white/10 to-transparent
                        backdrop-blur-[6px]
                        pointer-events-none"></div>

        {/* Icons */}
        {icons.map((icon, idx) =>
          icon.onClick ? (
            // Account button (custom click)
            <div
              key={idx}
              onClick={icon.onClick}
              className={`relative flex flex-col items-center text-gray-600 transition-all duration-300 z-10 cursor-pointer`}
            >
              {icon.svg}
              <span
                className={`text-xs font-medium ${
                  issActive === "/MyAccount" ? 'text-[color:var(--AcColor)]' : 'text-[color:var(--defaultColor)]'
                }`}
                style={{ '--AcColor': accent, '--defaultColor': defaultColor }}
              >
                {icon.label}
              </span>
            </div>
          ) : (
            // Normal NavLinks
            <NavLink
              key={idx}
              to={icon.to}
              className={({ isActive }) => `relative flex flex-col items-center text-gray-600 transition-all duration-300 z-10 ${isActive ? 'scale-110' : 'hover:scale-105'}`}
            >
              {icon.svg}
              <span
                className={`text-xs font-medium ${
                  issActive === icon.to ? 'text-[color:var(--AcColor)]' : 'text-[color:var(--defaultColor)]'
                }`}
                style={{ '--AcColor': accent, '--defaultColor': defaultColor }}
              >
                {icon.label}
              </span>
            </NavLink>
          )
        )}
      </div>

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
            rgba(255,255,255,0.1),
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.15),
            rgba(255,255,255,0.05)
          );
          background-size: 400% 400%;
          animation: liquid 10s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default IconBar;
