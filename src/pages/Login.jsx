import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Keep your styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token); // store token
      navigate('/admin/dashboard'); // redirect
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="page-container">
      <div className="white-card">
        <div className="card-content">
          {/* Left side - Image */}
          <div className="image-section">
            <img src="/adminpic.jpg" alt="Login Visual" />
          </div>

          {/* Right side - Login form */}
          <div className="form-section">
            <h2>Admin Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
