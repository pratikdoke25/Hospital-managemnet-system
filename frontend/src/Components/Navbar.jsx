import React from 'react';
import { Link } from 'react-router-dom';  // You can use Link for routing if you're using React Router
import './style.css'
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">MyWebsite</Link>
        <ul className="navbar-links">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/about" className="navbar-link">About</Link></li>
          <li><Link to="/services" className="navbar-link">Services</Link></li>
          <li><Link to="/contact" className="navbar-link">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
