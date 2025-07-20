import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Admin from "./Pages/Admin";
import Seller from "./Pages/Seller";
import ProductManagement from "./Pages/ProductManagement";
import New from "./Pages/New";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup";
import UserManagement from "./Pages/CustomerManagement";
import AdminDashboard from "./Pages/AdminDashboard";
import Discount from "./Pages/Discount";
import Customization from "./Pages/Customization";
import CustomerManagement from "./Pages/CustomerManagement";

function App() {
  return (
    <React.Fragment>
    <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/admin" element={<Admin/>}/>
       <Route path="/seller" element={<Seller/>}/>
       <Route path="/seller/products" element={<ProductManagement />} />
       <Route path="/seller/customers" element={<CustomerManagement />} />
       <Route path="/seller/analytics" element={<AdminDashboard />} />
       <Route path="/seller/customization" element={<Customization />} />
       <Route path="/seller/discounts" element={<Discount/>} />
       <Route path="/" element={<New />} />
       <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
    </Routes> 
  </React.Fragment>
  );
}

export default App;
