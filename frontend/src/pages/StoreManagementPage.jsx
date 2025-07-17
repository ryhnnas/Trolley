import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FaShoppingCart, FaCommentDots, FaDollarSign, FaBoxOpen } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import AddProductModal from '../components/AddProductModal';
import '../styles/StorePage.css';

const BecomeSellerPage = ({ onOpenStoreClick }) => {
    const navigate = useNavigate();
    return (
        <div className="become-seller-container">
            <FaShoppingCart className="logo" />
            <h2>Tingkatkan Potensi Anda, Buka Toko di Trolley!</h2>
            <p>Jangkau ribuan pelanggan baru dan kelola produk Anda dengan mudah di platform kami.</p>
            <div className="action-buttons">
                <button className="cancel-btn" onClick={() => navigate('/')}>Nanti Saja</button>
                <button className="open-store-btn" onClick={onOpenStoreClick}>Buka Toko Sekarang</button>
            </div>
        </div>
    );
};

const StatCard = ({ icon, value, label, variant = 'primary', notificationCount }) => (
    <div className={`stat-card ${variant}`}>
        {notificationCount > 0 && <div className="stat-notification-badge">{notificationCount}</div>}
        
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <div className="value">{value}</div>
            <div className="label">{label}</div>
        </div>
    </div>
);

const SellerDashboardPage = () => {
    const [stats, setStats] = useState({ totalSales: 0, productsSold: 0, newOrders: 0 });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [storeInfo, setStoreInfo] = useState(null);
    const [unreadChats, setUnreadChats] = useState(0);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchSellerData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [summaryRes, ordersRes, productsRes, storeRes] = await Promise.all([
                api.get('/users/dashboard-summary', config),
                api.get('/orders/store', config),
                api.get('/products/my-store', config),
                api.get('/stores/my-store/details', config)
            ]);

            setStats({
                totalSales: summaryRes.data.totalSales || 0,
                productsSold: summaryRes.data.productsSold || 0,
                newOrders: summaryRes.data.pendingOrders || 0
            });
            setUnreadChats(summaryRes.data.unreadChats);
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
            setStoreInfo(storeRes.data);
        } catch (error) {
            console.error("Gagal mengambil data seller:", error);
            toast.error("Gagal memuat data toko.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellerData();
    }, []);

    const handleOpenAddModal = () => {
        setProductToEdit(null);
        setShowProductModal(true);
    };

    const handleOpenEditModal = (product) => {
        setProductToEdit(product);
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Anda yakin ingin menghapus produk ini?")) {
            const promise = api.delete(`/products/${productId}`, config);
            toast.promise(promise, {
                loading: 'Menghapus produk...',
                success: 'Produk berhasil dihapus!',
                error: (err) => err.response?.data?.message || 'Gagal menghapus produk.',
            });
            promise.then(() => fetchSellerData());
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const promise = api.patch(`/orders/${orderId}/status`, { status: newStatus }, config);

        toast.promise(promise, {
            loading: 'Mengubah status...',
            success: 'Status berhasil diubah!',
            error: 'Gagal mengubah status.',
        });

        promise.then(() => {
            fetchSellerData();
        });
    };

    if (loading) return <p>Memuat dashboard toko...</p>;

    return (
        <div className="seller-dashboard">
            <AddProductModal 
                show={showProductModal} 
                onClose={() => setShowProductModal(false)}
                onProductAdded={fetchSellerData}
                initialData={productToEdit}
            />

            {storeInfo && (
                <div className="store-info-header">
                    <h1>{storeInfo.name}</h1>
                    <p>{storeInfo.description}</p>
                </div>
            )}

            <h1>Dashboard Toko Anda</h1>
            <div className="stats-grid">
                <StatCard 
                    key="sales"
                    icon={<FaDollarSign />} 
                    value={`Rp ${stats.totalSales.toLocaleString('id-ID')}`} 
                    label="Total Penjualan" 
                    variant="primary" 
                />
                <StatCard 
                    key="sold"
                    icon={<FaBoxOpen />} 
                    value={stats.productsSold} 
                    label="Produk Terjual" 
                    variant="warning" 
                />
                <StatCard 
                    key="orders"
                    icon={<FaShoppingCart />} 
                    value={stats.newOrders} 
                    label="Pesanan Baru" 
                    variant="danger" 
                />
                <Link to="/dashboard/inbox" className="stat-card-link" key="inbox-link">
                    <StatCard 
                        icon={<FaCommentDots />} 
                        value="Lihat" 
                        label="Inbox Pesan" 
                        variant="info"
                        notificationCount={unreadChats}
                    />
                </Link>
            </div>
            <div className="order-management-section">
                <div className="section-header">
                    <h2>Pesanan Masuk</h2>
                </div>
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Produk</th>
                            <th>Total</th>
                            <th>Status Saat Ini</th>
                            <th>Ubah Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((order, index) => (
                            <tr key={`${order.order_id}-${index}`}>
                                <td>#{order.order_id}</td>
                                <td>{order.product_name} (x{order.quantity})</td>
                                <td>Rp {parseInt(order.price_per_item).toLocaleString('id-ID')}</td>
                                <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                                <td>
                                    <select 
                                        className="status-select" 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada pesanan masuk.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="product-management-section" style={{marginTop: '40px'}}>
                <div className="section-header">
                    <h2>Produk Anda</h2>
                    <button className="add-btn" onClick={handleOpenAddModal}>Tambah Produk Baru</button>
                </div>
                
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-info-cell">
                                        <img 
                                            src={`${import.meta.env.VITE_BACKEND_URL}/${product.image_url?.replace(/\\/g, '/')}`} 
                                            alt={product.name} 
                                            className="product-table-img"
                                        />
                                        <span>{product.name}</span>
                                    </div>
                                </td>
                                <td>Rp {parseInt(product.price).toLocaleString('id-ID')}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`status-badge ${product.stock > 0 ? 'status-active' : 'status-inactive'}`}>
                                        {product.stock > 0 ? 'Aktif' : 'Habis'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="edit-btn" onClick={() => handleOpenEditModal(product)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>Anda belum menambahkan produk.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StoreSetupModal = ({ show, onClose, onSave }) => {
    const [formData, setFormData] = useState({ storeName: '', storeDescription: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!show) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Informasi Toko Anda</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Toko</label>
                        <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Deskripsi Singkat Toko</label>
                        <textarea name="storeDescription" rows="4" style={{width: '100%'}} value={formData.storeDescription} onChange={handleChange}></textarea>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Batal</button>
                        <button type="submit" className="add-btn">Buka Toko</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StoreManagementPage = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        api.get('/users/profile', config)
            .then(res => setUser(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [token]);

    const handleSaveStore = async (storeData) => {
        const promise = api.post('/users/upgrade-to-seller', storeData, config);
        
        toast.promise(promise, {
            loading: 'Membuat toko Anda...',
            success: 'Toko berhasil dibuat!',
            error: 'Gagal membuat toko.',
        });

        promise.then(response => {
            localStorage.setItem('token', response.data.token);
            setShowModal(false);
            setUser(prevUser => ({ ...prevUser, role: 'seller' }));
        });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <StoreSetupModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSaveStore} />
            {user && user.role === 'seller' 
                ? <SellerDashboardPage /> 
                : <BecomeSellerPage onOpenStoreClick={() => setShowModal(true)} />
            }
        </>
    );
};

export default StoreManagementPage;