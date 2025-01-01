import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });

      setMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setMessage('Login failed: ' + (error.response?.data?.message || 'An error occurred.'));
    }
  };

  return (
    <div className="auth-page">
        <video autoplay loop muted>
            {/* <source src='/v1.mp4' type="video/mp4"  /> */}
            Your browser does not support the video tag.
        </video>
      <div className="auth-form">
        <video autoplay loop muted>
            {/* <source src='/v1.mp4' type="video/mp4"  /> */}
            Your browser does not support the video tag.
         </video>
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