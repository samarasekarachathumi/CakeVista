import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaUserCheck, FaUserTimes, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-[#fefefe] text-black p-5">
      <h2 className="text-xl font-bold mb-5">Admin Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/admin/sellers" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaUsers />
            Sellers
          </Link>
        </li>
        <li>
          <Link to="/admin/requested-sellers" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaUserCheck />
            Requested Sellers
          </Link>
        </li>
        <li>
          <Link to="/admin/deactivated-sellers" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaUserTimes />
            Deactivated Sellers
          </Link>
        </li>
        <li>
          <button className="flex items-center gap-3 p-2 w-full text-left hover:bg-red-600 rounded">
            <FaSignOutAlt />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
