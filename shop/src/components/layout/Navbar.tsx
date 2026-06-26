import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineLogout } from "react-icons/hi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-wine-500 to-purple-500 bg-clip-text text-transparent">
              MYSTIC YOGA
            </span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.3em] text-gold-500 font-medium">Shop</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-wine-500 transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-wine-500 transition-colors">
              <HiOutlineHeart className="text-xl" />
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-wine-500 transition-colors">
              <HiOutlineShoppingBag className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-wine-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-wine-500 transition-colors"
                >
                  <HiOutlineUser className="text-xl" />
                  <span className="hidden lg:inline text-sm font-medium">{user.name?.split(" ")[0]}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-ivory-100 transition-colors">My Profile</Link>
                    <Link to="/orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-ivory-100 transition-colors">My Orders</Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-600 hover:bg-ivory-100 transition-colors">Wishlist</Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { logout(); setProfileOpen(false); navigate("/"); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <HiOutlineLogout /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-wine-500 transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium bg-wine-500 text-white rounded-lg hover:bg-wine-600 transition-colors">Register</Link>
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600">
              {mobileOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-wine-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 border-t border-gray-100 flex gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:border-wine-300 transition-colors">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2 text-sm font-medium bg-wine-500 text-white rounded-lg hover:bg-wine-600 transition-colors">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
