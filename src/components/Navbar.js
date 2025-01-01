import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left-container">
                  <h1 className='project-name'>
                      <Link to="/">ObscurifyIT</Link>
                   </h1>
                    <ul className="navbar-left">
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/help">Help</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/history">History</Link></li> {/* Added History link */}
                    </ul>
                  </div>
                <div className="navbar-right">
                     <Link to="/login" className="btn btn-sign-in">Sign In</Link>
                     <Link to="/signup" className="btn btn-sign-up">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;