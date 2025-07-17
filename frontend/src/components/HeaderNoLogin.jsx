import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import '../styles/Header.css';

const HeaderNoLogin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <header className="header-container">
      <Link to="/" className="header-logo">
        <FaShoppingCart />
        <span>Trolley</span>
      </Link>
      <form className="search-bar" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Mau cari apa?" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit"><FaSearch /> Cari</button>
      </form>
      <div className="header-actions">
        <Link to="/auth">
          <button className="login-button">Login</button>
        </Link>
      </div>
    </header>
  );
};

export default HeaderNoLogin;