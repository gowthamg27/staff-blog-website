


import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate("/login");
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Clicking takes the admin to login */}
          <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <div className="text-2xl font-bold text-blue-700">
              <span className="text-blue-900">Dr.</span>O.V.<span className="text-blue-500">Sadhasivam</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="font-medium text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/gallery" className="font-medium text-gray-700 hover:text-blue-600">Gallery</Link>
            <Link to="/events" className="font-medium text-gray-700 hover:text-blue-600">College Events</Link>
            <Link to="/social" className="font-medium text-gray-700 hover:text-blue-600">Social Activities</Link>
            <Link to="/videos" className="font-medium text-gray-700 hover:text-blue-600">Videography</Link>
            <Link to="/research" className="font-medium text-gray-700 hover:text-blue-600">Research</Link>
          </nav>

          {/* Logout Button (Only for Admin) */}
          {user && (
            <button onClick={logout} className="hidden md:block text-red-600 font-medium">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;













