import React from 'react';
import './style.css'
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2024 MyWebsite. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="/privacy-policy" className="footer-link">Privacy Policy</a></li>
          <li><a href="/terms" className="footer-link">Terms of Service</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
