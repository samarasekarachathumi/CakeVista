import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaChartBar, FaBoxOpen, FaShoppingCart, FaUserFriends, FaTag, FaMoneyBillWave, FaSignOutAlt, FaCogs } from "react-icons/fa";

function SidebarSeller() {
  return (
    <div className="h-screen w-64 bg-[#fefefe] text-black p-5 shadow-md">
      <h2 className="text-xl font-bold mb-5">Seller Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/seller/analytics" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaChartBar />
            Analytics
          </Link>
        </li>
        <li>
          <Link to="/seller/products" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaBoxOpen />
            Products
          </Link>
        </li>
        <li>
          <Link to="/seller/customization" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaCogs />
            Customization
          </Link>
        </li>
        <li>
          <Link to="/seller/orders" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaShoppingCart />
            Orders
          </Link>
        </li>
        <li>
          <Link to="/seller/customers" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaUserFriends />
            Customers
          </Link>
        </li>
        
        <li>
          <Link to="/seller/payments" className="flex items-center gap-3 p-2 hover:bg-[#E6A4B4] rounded">
            <FaMoneyBillWave />
            Advertisement
          </Link>
        </li>
        
        <li>
        <button className="flex items-center gap-3 p-2 w-full text-left hover:bg-red-600 text-black rounded">
            <FaSignOutAlt />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarSeller;