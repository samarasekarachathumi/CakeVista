import React from 'react'

function Seller() {
  return (
    <div className="flex">
    
    {/* Main Content */}
    <div className="flex-1">
      <div className="flex items-center justify-between px-6 py-4 bg-[#E6A4B4]">
        {/* Logo */}
        <Link to="/" className="text-3xl font-semibold font-[cursive]">
          Cake Vista
        </Link>
        <Link to="/profile">
          <img src={assets.profile} className="w-6 cursor-pointer" alt="Profile" />
        </Link>
      </div>
    </div>
  </div>
  )
}

export default Seller