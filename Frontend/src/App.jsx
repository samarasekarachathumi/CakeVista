import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import Home from "./Home";
import Admin from "./Pages/Admin";
import Seller from "./Pages/Seller";


function App() {
  return (
    <React.Fragment>
    <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/admin" element={<Admin/>}/>
       <Route path="/seller" element={<Seller/>}/>
    </Routes>
  </React.Fragment>
  );
}

export default App;
