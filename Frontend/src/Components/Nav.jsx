import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets"; // Ensure assets contain search, cart, and bell icons.

function Nav() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#E6A4B4] ">
      {/* Logo */}
      <Link to="/" className="text-3xl font-semibold font-[cursive]">
        Cake Vista
      </Link>

      {/* Search Bar */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Find Shops Around You"
          className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg focus:outline-none"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2">
          <img src={assets.search} alt="Search" className="w-5" />
        </button>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6">
        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img src={assets.cart} className="w-7" alt="Cart" />
        </Link>

        {/* Notification Icon */}
        <Link to="/profile">
          <img src={assets.profile} className="w-6 cursor-pointer" alt="Notifications" />
        </Link>
      </div>
    </div>
  );
}

export default Nav;
