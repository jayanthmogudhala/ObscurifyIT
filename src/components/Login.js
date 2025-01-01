import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // For the popup message

  const validateEmail = (email) => {
    // Basic email validation regex
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem("authToken", response.data.token);

      // Show success message
      setMessage("Login successful! Redirecting...");

      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = "/"; // Replace '/' with your desired home route
      }, 2000);
    } catch (error) {
      setMessage(
        "Login failed: " + (error.response?.data?.message || "An error occurred.")
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Login Here !!</h2>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <div className="popup-message">{message}</div>}
      </div>
    </div>
  );
};

export default Login;