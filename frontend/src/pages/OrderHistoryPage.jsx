import React, { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import ReviewModal from '../components/ReviewModal';
import '../styles/OrderHistory.css';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [productToReview, setProductToReview] = useState(null);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        setLoading(true);
        try {
            const response = await api.get('/orders/history', config);
            setOrders(response.data);
        } catch (error) {
            console.error("Gagal mengambil riwayat pesanan", error);
            toast.error("Gagal memuat riwayat pesanan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = (orderId, status) => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const promise = api.patch(`/orders/${orderId}/status`, { status }, config);
        
        toast.promise(promise, {
            loading: 'Memperbarui status...',
            success: `Pesanan #${orderId} telah ditandai sebagai ${status}!`,
            error: 'Gagal memperbarui status.',
        });

        promise.then(() => fetchOrders());
    };

    const handleOpenReviewModal = (product, orderId) => {
        setProductToReview({ ...product, order_id: orderId });
        setShowReviewModal(true);
    };

    const handleSubmitReview = (reviewData) => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const promise = api.post('/reviews', reviewData, config);
        
        toast.promise(promise, {
            loading: 'Mengirim ulasan...',
            success: 'Ulasan berhasil dikirim!',
            error: (err) => err.response?.data?.message || 'Gagal mengirim ulasan.',
        });
        promise.then(() => setShowReviewModal(false));
    };
    
    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'Semua') return true;
        return order.status.toLowerCase() === activeFilter.toLowerCase();
    });

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getStatusClass = (status) => {
        return `status-${status.toLowerCase()}`;
    };

    if (loading) return <p style={{textAlign: 'center', padding: '50px'}}>Memuat riwayat pesanan...</p>;

    return (
        <div className="order-history-container">
            <ReviewModal 
                show={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                product={productToReview}
                orderId={productToReview?.order_id}
                onSubmit={handleSubmitReview}
            />
            <h1>Riwayat Pesanan</h1>
            
            <div className="order-filter-bar">
                {['Semua', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(status => (
                    <button 
                        key={status}
                        className={`filter-button ${activeFilter === status ? 'active' : ''}`}
                        onClick={() => setActiveFilter(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="order-list">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-summary" onClick={() => toggleExpand(order.id)}>
                            <div><strong>Order ID</strong><p>#{order.id}</p></div>
                            <div><strong>Tanggal</strong><p>{new Date(order.created_at).toLocaleDateString('id-ID')}</p></div>
                            <div><strong>Total</strong><p>Rp {order.total_amount.toLocaleString('id-ID')}</p></div>
                            <div><strong>Status</strong><p><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></p></div>
                            <div>{expandedOrderId === order.id ? 'Tutup' : 'Lihat Detail'}</div>
                        </div>

                        {expandedOrderId === order.id && (
                            <div className="order-details">
                                {order.items?.map(item => (
                                    <div key={item.product_id} className="order-item">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/${item.product_image?.replace(/\\/g, '/')}`} alt={item.product_name} />
                                        <div className="order-item-info">
                                            <p><strong>{item.product_name}</strong></p>
                                            <p>{item.quantity} x Rp {item.price_per_item.toLocaleString('id-ID')}</p>
                                        </div>
                                        {order.status.toLowerCase() === 'completed' && (
                                            <button className="review-btn" onClick={() => handleOpenReviewModal(item, order.id)}>Beri Ulasan</button>
                                        )}
                                    </div>
                                ))}
                                <div className="order-details-actions">
                                    {order.status.toLowerCase() === 'processing' && <button className="action-button cancel-btn" onClick={() => handleStatusUpdate(order.id, 'Cancelled')}>Batalkan Pesanan</button>}
                                    {order.status.toLowerCase() === 'shipped' && <button className="action-button confirm-btn" onClick={() => handleStatusUpdate(order.id, 'Completed')}>Konfirmasi Pesanan Diterima</button>}
                                </div>
                            </div>
                        )}
                    </div>
                )) : <p>Tidak ada pesanan dengan status "{activeFilter}".</p>}
            </div>
        </div>
    );
};

export default OrderHistoryPage;