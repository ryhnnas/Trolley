import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaHistory, FaMapMarkerAlt, FaHeart, FaStore, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Dashboard.css';
import { jwtDecode } from 'jwt-decode';

const DashboardSidebar = () => {
    const token = localStorage.getItem('token');
    const userRole = token ? jwtDecode(token).role : 'buyer';

    return (
        <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" end>
                    <FaTachometerAlt /> Dashboard
                </NavLink>
                <NavLink to="/dashboard/orders">
                    <FaHistory /> Riwayat Pesanan
                </NavLink>
                <NavLink to="/dashboard/addresses">
                    <FaMapMarkerAlt /> Kartu & Alamat
                </NavLink>
                <NavLink to="/dashboard/wishlist">
                    <FaHeart /> Wishlist
                </NavLink>
                <NavLink to="/dashboard/store">
                    {userRole === 'seller' ? <><FaStore /> Lihat Toko</> : <><FaStore /> Buka Toko</>}
                </NavLink>
                <NavLink to="/dashboard/settings">
                    <FaCog /> Pengaturan
                </NavLink>
            </nav>
        </aside>
    );
};


const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;