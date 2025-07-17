import React from 'react';
import { FaEnvelope, FaInstagram, FaFacebookF } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <ul>
            <li>About Us</li>
            <li>Programs</li>
            <li>Events</li>
            <li>Blog</li>
            <li>Join Our Team</li>
          </ul>
        </div>
        <div className="footer-section footer-updates">
          <h3>Get Updates</h3>
          <p>Register your account to receive updates and special offers.</p>
          <form>
            <input type="email" placeholder="*Email" required />
            <input type="text" placeholder="*First Name" required />
            <br/>
            <button type="submit">SUBMIT</button>
          </form>
        </div>
        <div className="footer-section footer-contact">
          <h3>Send Us A Message →</h3>
          <p>+62 902-193-256</p>
          <p>
            Bandung, Jl. Telekomunikasi No. 1, Bandung Terusan Buahbatu,
            Bojongsoang, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa
            Barat 40257
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>©2025 archived by ryhnnas. All right reserved.</span>
        <div className="social-icons">
          <a href="#"><FaEnvelope /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaFacebookF /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;