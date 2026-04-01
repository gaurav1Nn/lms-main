import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { userData, logout } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logo} alt="Quantpact Logo" className="w-8 lg:w-10" />
        <span className="text-2xl lg:text-3xl font-extrabold text-gray-800 tracking-tight">Quantpact</span>
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {userData?.name || "Admin"}</p>
        <img src={userData?.imageUrl || assets.profile_img} alt="profile_img" className="max-w-8 rounded-full" />
        <button onClick={logout} className="text-red-500 ml-4 cursor-pointer">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
