import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp/SignUp";
import Login from "./Login/Login";
import Rent from "./Rent/Rent";
import MyOrderPage from "./Order/Order";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/Rent" element={<Rent />} />
        <Route path="/my-order" element={<MyOrderPage />} />
       </Routes>
    </Router>
  );
};

export default App;
