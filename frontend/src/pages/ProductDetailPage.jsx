import React, { useState, useEffect,useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { FaStar,FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { addToCart } from '../utils/cart';
import '../styles/ProductDetailPage.css';

const ProductDetailPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('deskripsi');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${productId}`);
                setProduct(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setSelectedImage(response.data.images[0]);
                }
            } catch (error) {
                console.error("Gagal mengambil detail produk", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleBuyNow = () => {
        if (!token) {
            toast.error('Silakan login untuk melanjutkan ke checkout.');
            navigate('/auth');
            return;
        }

        const itemToBuy = {
            ...product,
            quantity: quantity,
            image_url: product.images && product.images.length > 0 ? product.images[0] : null
        };
        navigate('/checkout', { state: { items: [itemToBuy] } });
    };

    const reviewStats = useMemo(() => {
        if (!product?.reviews) return { counts: {}, total: 0 };
        
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        product.reviews.forEach(review => {
            counts[review.rating] = (counts[review.rating] || 0) + 1;
        });
        return { counts, total: product.reviews.length };
    }, [product]);
    
    const renderRatingInfo = () => {
        if (product.review_count > 0) {
            const avg = parseFloat(product.avg_rating).toFixed(1);
            return (
                <span>
                    ⭐ {avg} Star Rating ({product.review_count} Pengguna memberikan ulasan)
                </span>
            );
        }
        return <span>Belum ada ulasan</span>;
    };
    
    const handleAddToCart = () => {
        if (!token) {
            toast.error('Silakan login untuk menambahkan ke keranjang.');
            navigate('/auth');
            return;
        }

        const productToAdd = {
            ...product,
            image_url: product.images && product.images.length > 0 ? product.images[0] : null
        };
        addToCart(productToAdd, quantity);
    };

    if (loading) return <p className="page-message">Loading...</p>;
    if (!product) return <p className="page-message">Produk tidak ditemukan.</p>;

    const fullImageUrl = (path) => `${import.meta.env.VITE_BACKEND_URL}/${path?.replace(/\\/g, '/')}`;

    const handleInitiateChat = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Silakan login untuk memulai percakapan.");
            return navigate('/auth');
        }
        
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const promise = api.post('/chat/initiate', { productId }, config);

            toast.promise(promise, {
                loading: 'Mempersiapkan obrolan...',
                success: 'Ruang obrolan siap!',
                error: (err) => err.response?.data?.message || 'Gagal memulai obrolan.',
            });
            
            const response = await promise;
            navigate(`/chat/${response.data.id}`);

        } catch (error) {
            console.error("Gagal memulai chat", error);
        }
    };

    return (
        <div className="product-detail-container">
            <div className="breadcrumb"><Link to="/">Home</Link> &gt; Detail Produk</div>
            
            <div className="detail-main-layout">
                <div className="image-gallery">
                    <div className="main-image-container">
                        <img src={fullImageUrl(selectedImage)} alt="Product" className="main-image" />
                    </div>
                    <div className="thumbnail-container">
                        {product.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={fullImageUrl(img)} 
                                alt={`Thumbnail ${index + 1}`}
                                className={selectedImage === img ? 'thumbnail active' : 'thumbnail'}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="sold-by">Dijual oleh: <Link to={`/store/${product.store_id}`}><strong>{product.store_name}</strong></Link></p>
                    <div className="info-meta">
                        {renderRatingInfo()}
                        <span>Category: <strong>{product.category}</strong></span>
                    </div>
                    <p className="price">Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
                    
                    <div className="quantity-selector">
                        <label>Kuantitas</label>
                        <div>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="cart-btn" onClick={handleAddToCart}>Masukan Keranjang</button>
                        <button className="buy-btn" onClick={handleBuyNow}>Beli Sekarang</button>
                        <button className="chat-seller-btn" onClick={handleInitiateChat}>Tanya Penjual</button>
                    </div>
                </div>
            </div>

            <div className="product-tabs-section">
                <div className="tab-headers">
                    <button className={activeTab === 'deskripsi' ? 'active' : ''} onClick={() => setActiveTab('deskripsi')}>DESKRIPSI</button>
                    <button className={activeTab === 'ulasan' ? 'active' : ''} onClick={() => setActiveTab('ulasan')}>ULASAN ({reviewStats.total})</button>
                </div>
                <div className="tab-content">
                    {activeTab === 'deskripsi' && <p>{product.description}</p>}
                    {activeTab === 'ulasan' && (
                        <div>
                            {reviewStats.total > 0 ? (
                                <div className="reviews-grid">
                                    <div className="rating-summary">
                                        {[5, 4, 3, 2, 1].map(star => {
                                            const count = reviewStats.counts[star] || 0;
                                            const percentage = reviewStats.total > 0 ? (count / reviewStats.total) * 100 : 0;
                                            return (
                                                <div key={star} className="rating-summary-row">
                                                    <span>{star} <FaStar/></span>
                                                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${percentage}%` }}></div></div>
                                                    <span>{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="review-list">
                                        <h3>{reviewStats.total} Reviews</h3>
                                        {product.reviews.map(review => (
                                            <div key={review.id} className="review-item">
                                                <div className="review-item-header">
                                                    <FaUserCircle className="review-avatar" />
                                                    <div><strong>{review.user_name}</strong><div className="review-rating">{[...Array(review.rating)].map((_, i) => <FaStar key={i}/>)}</div></div>
                                                    <span className="review-date">{new Date(review.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                <p className="review-comment">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : <p>Belum ada ulasan untuk produk ini.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;