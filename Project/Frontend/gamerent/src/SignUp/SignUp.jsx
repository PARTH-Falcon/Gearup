import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SignUp.css";
import logo from "../Pictures/GEAR UP.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiURL = "http://127.0.0.1:8000/gearup/customers/";

    try {
      const response = await axios.post(apiURL, formData);
      console.log("Response:", response.data);
      alert("Sign up successful!");

      // Navigate to the /login page on success
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="unique-signup-container">
      <div className="unique-signup-box">
        <div className="unique-upper-login">
          <img className="unique-logo" src={logo} alt="Logo" />
          <h1 className="unique-signup-title">Sign Up</h1>
        </div>
        <form className="unique-signup-form" onSubmit={handleSubmit}>
          <div className="unique-form-group">
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="unique-form-group">
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="unique-form-group">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="unique-signup-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
