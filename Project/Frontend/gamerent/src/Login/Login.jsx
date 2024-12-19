import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // Import the unique CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [fetchedPassword, setFetchedPassword] = useState("");
  const navigate = useNavigate();

  // Function to send username to the logs endpoint
  const postUsernameToLogs = async () => {
    const apiURL = `http://127.0.0.1:8000/gearup/logs/`;
    try {
      await axios.post(apiURL, { customer: username });
      console.log("Username logged successfully");
    } catch (error) {
      console.error("Error logging username:", error);
      toast.error("Failed to log username.", {
        position: "top-right",
      });
    }
  };

  const handleNextOrLogin = async () => {
    if (!isUsernameValid) {
      // Step 1: Validate username
      const apiURL = `http://127.0.0.1:8000/gearup/customers/${username}/`;
      try {
        const response = await axios.get(apiURL);
        setFetchedPassword(response.data.password);
        setIsUsernameValid(true);
        toast.success("Username is valid. Please enter your password.", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Invalid username. Please try again.", {
          position: "top-right",
        });
        setIsUsernameValid(false);
      }
    } else {
      // Step 2: Perform login
      if (password === fetchedPassword) {
        toast.success("Login successful!", {
          position: "top-right",
        });

        // Post username to logs after successful login
        await postUsernameToLogs();

        setTimeout(() => navigate("/Rent"), 2000);
      } else {
        toast.error("Incorrect password. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  return (
    <div className="unique-login-wrapper">
      <div className="unique-login-box">
        <div className="unique-upper-login">
          <h1 className="unique-login-title">Login</h1>
        </div>
        <div className="unique-form-group">
          <input
            type="text"
            id="username"
            placeholder="USERNAME HERE!"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="unique-form-group">
          <input
            type="password"
            id="password"
            placeholder="PASSWORD PLEASE!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!isUsernameValid}
          />
        </div>
        <div className="unique-button-group">
          <button
            className="unique-login-next-button"
            onClick={handleNextOrLogin}
            disabled={!username.trim()}
          >
            {isUsernameValid ? "Login" : "Next"}
          </button>
          <button
            className="unique-signup-button"
            onClick={handleSignUpRedirect}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
