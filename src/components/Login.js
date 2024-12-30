// import React, { useState } from 'react';
// import axios from 'axios';
// import './Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/login', { email, password });
//       alert(response.data.message);
//     } catch (error) {
//       alert('Login failed: ' + error.response.data.message);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-form">
//         <h2>Login Here !!</h2>
//         <form onSubmit={handleLogin}>
//         <label >Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // For the popup message

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });

      // Show success message
      setMessage('Login successful! Redirecting...');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = '/'; // Replace '/' with your desired home route
      }, 2000);
    } catch (error) {
      setMessage('Login failed: ' + (error.response?.data?.message || 'An error occurred.'));
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

