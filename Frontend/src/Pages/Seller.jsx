import React from 'react';
import { Link } from 'react-router-dom';
import SidebarSeller from '../Components/SidebarSeller';
// import ProductManagement from './ProductManagement'; // Import the ProductManagement component
import AdminDashboard from './AdminDashboard';
import { assets } from '../assets/assets';


function Seller() {
  return (
    <div className="flex">
      <SidebarSeller /> 
      <div className="flex-1">
        <div className="flex items-center justify-between px-6 py-4 bg-[#E6A4B4]">
          <Link to="/" className="text-3xl font-semibold font-[cursive]">
            Cake Vista
          </Link>
          <Link to="/profile">
            <img src={assets.profile} className="w-6 cursor-pointer" alt="Profile" />
          </Link>
        </div>
        <AdminDashboard/> {/* Render the ProductManagement component here */}
      </div>
    </div>
  );
}

export default Seller;
