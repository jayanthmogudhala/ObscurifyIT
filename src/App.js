import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// Import the components
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Help from './components/Help';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [brightness, setBrightness] = useState(100);

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  return (
    <Router>
      <div className="App" style={{ filter: `brightness(${brightness}%)` }}>
        {/* Navbar Section */}
        <header>
          <div className="navbar">
            <ul className="left-nav">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/help">Help</Link></li>
            </ul>
            <div className="right-nav">
              <label htmlFor="brightness">Brightness: </label>
              <input
                type="range"
                id="brightness"
                min="0"
                max="200"
                value={brightness}
                onChange={handleBrightnessChange}
              />
              <Link to="/login">
                <button id="sign-in">Sign In</button>
              </Link>
              <Link to="/signup">
                <button id="sign-up">Sign Up</button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Section */}
        <main>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} /> {/* Default route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
