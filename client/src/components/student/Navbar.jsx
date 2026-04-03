

import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, isAuthenticated, userData, logout } =
    useContext(AppContext);

  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const { data } = await axios.get(backendUrl + "/api/educator/update-role");
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 transition-all duration-300 ${
        isCourseListPage
          ? "bg-white border-b border-gray-200"
          : scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200"
            : "bg-emerald-50/70 border-b border-gray-200"
      }`}
    >
      {/* Logo */}
      <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
        <img src={assets.logo} alt="Quantpact Logo" className="w-8 lg:w-10" />
        <span className="text-2xl lg:text-3xl font-extrabold text-gray-800 tracking-tight">
          Quantpact
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-5 text-sm text-gray-600">
        <a href="/#courses" className="hover:text-emerald-600 font-semibold transition-colors">
          Courses
        </a>
        <a href="/#why-us" className="hover:text-emerald-600 font-semibold transition-colors">
          Why Us
        </a>
        <span className="text-gray-300">|</span>
        {isAuthenticated ? (
          <>
            <button onClick={becomeEducator} className="hover:text-gray-800 transition-colors">
              {isEducator ? "Admin Dashboard" : "Become Admin"}
            </button>
            <span className="text-gray-300">|</span>
            <Link to="/dashboard" className="hover:text-gray-800 transition-colors">
              My Learning
            </Link>
            <span className="text-gray-300">|</span>
            <button onClick={logout} className="text-red-500 hover:text-red-600 transition-colors">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-800 transition-colors">Login</Link>
            <span className="text-gray-300">|</span>
            <Link to="/register" className="hover:text-gray-800 transition-colors">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex flex-col items-end gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <a href="/#courses" className="hover:text-emerald-600 transition-colors">Courses</a>
          <a href="/#why-us" className="hover:text-emerald-600 transition-colors">Why Us</a>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {isAuthenticated ? (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Admin" : "Become Admin"}
              </button>
              <span className="text-gray-300">|</span>
              <Link to="/dashboard">My Learning</Link>
              <span className="text-gray-300">|</span>
              <button onClick={logout} className="text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <span className="text-gray-300">|</span>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;