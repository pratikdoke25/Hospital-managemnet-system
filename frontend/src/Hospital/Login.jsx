import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields.', { position: 'top-center' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/Admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success('Login successful!', { position: 'top-center' });
        // Redirect to hospital details page, passing hospital ID in URL
        navigate(`/Hospital/Details/${data.hospital._id}`, { state: { hospital: data.hospital } });
      } else {
        toast.error(data.error || 'Login failed. Please try again.', { position: 'top-center' });
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.', { position: 'top-center' });
      console.log(err);
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-heading">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle-btn"
          >
            {showPassword ? '👁️' : '🙈'}
          </button>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p>
        Create an account
        <Link to="/register" className="register-link">Register</Link>
      </p>

      <ToastContainer />
    </div>
  );
}

export default Login;
