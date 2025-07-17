import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUserCircle, FaTachometerAlt, FaUserEdit, FaCommentDots } from 'react-icons/fa';
import '../styles/Header.css';
import { getCart } from '../utils/cart';

const HeaderLogin = ({ unreadChatCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
        window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
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
        <Link to="/inbox" className="chat-icon-container">
            <FaCommentDots className="header-icon" />
            {unreadChatCount > 0 && <span className="cart-badge">{unreadChatCount}</span>}
        </Link>
        <Link to="/cart" className="cart-icon-container">
          <FaShoppingCart className="header-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        <div 
          className="profile-container"
          onMouseEnter={() => setPopupVisible(true)}
          onMouseLeave={() => setPopupVisible(false)}
        >
          <FaUserCircle className="header-icon" />
          {isPopupVisible && (
            <div className="profile-popup">
              <Link to="/dashboard" className="popup-item"><FaTachometerAlt /> Dashboard</Link>
              <Link to="/dashboard/profile" className="popup-item"><FaUserEdit /> Profil</Link>
              <div className="popup-item logout" onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderLogin;