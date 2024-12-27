import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ brightness, handleBrightnessChange }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <ul className="navbar-left">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/help">Help</Link></li>
        </ul>
        <div className="navbar-right">
          <div className="brightness-control">
            <label htmlFor="brightness">Brightness:</label>
            <input
              type="range"
              id="brightness"
              min="0"
              max="200"
              value={brightness}
              onChange={handleBrightnessChange}
            />
          </div>
          <Link to="/login">
            <button className="btn btn-sign-in">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-sign-up">Sign Up</button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
