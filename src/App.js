import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Import the components
import Navbar from './components/Navbar';
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
        <Navbar brightness={brightness} handleBrightnessChange={handleBrightnessChange} />
        <main>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
