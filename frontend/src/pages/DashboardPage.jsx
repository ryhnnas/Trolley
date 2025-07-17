import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaClipboardList, FaHeart, FaUserEdit } from 'react-icons/fa';
import '../styles/Dashboard.css'; 

const StatCard = ({ icon, value, label, variant = 'primary' }) => (
    <div className={`stat-card ${variant}`}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <div className="value">{value}</div>
            <div className="label">{label}</div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const summaryRes = await api.get('/users/dashboard-summary', config);
                const profileRes = await api.get('/users/profile', config);

                setSummary(summaryRes.data);
                setUserName(profileRes.data.name);

            } catch (error) {
                console.error("Gagal mengambil data dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <p>Memuat dashboard...</p>;

    const wishlistCount = JSON.parse(localStorage.getItem('wishlist'))?.length || 0;

    return (
        <div className="user-dashboard">
            <h1>Halo, {userName} 👋</h1>
            <p className="dashboard-subtitle">Selamat datang! Berikut ringkasan aktivitas akun Anda.</p>

            <div className="stats-grid">
                <StatCard icon={<FaClipboardList />} value={summary.totalOrders} label="Total Pesanan" variant="primary" />
                <StatCard icon={<FaBoxOpen />} value={summary.pendingOrders} label="Pesanan Diproses/Kirim" variant="warning" />
                <StatCard icon={<FaHeart />} value={wishlistCount} label="Item di Wishlist" variant="danger" />
                <Link to="/dashboard/profile" className="stat-card-link">
                    <StatCard icon={<FaUserEdit />} value="Edit" label="Profil Anda" variant="info" />
                </Link>
            </div>

            <div className="recent-orders-section">
                <h2>Pesanan Terbaru Anda</h2>
                {summary.recentOrders.length > 0 ? (
                    <table className="simple-order-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Tanggal</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                    <td>Rp {order.total_amount.toLocaleString('id-ID')}</td>
                                    <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Anda belum memiliki pesanan.</p>
                )}
                <Link to="/dashboard/orders" className="view-all-link">Lihat Semua Pesanan &rarr;</Link>
            </div>
        </div>
    );
};

export default DashboardPage;