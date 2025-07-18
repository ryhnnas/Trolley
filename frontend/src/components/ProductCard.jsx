import React, { useState, useEffect } from 'react';
import { FaStar, FaRegHeart, FaHeart, FaCartPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../styles/Homepage.css';
import { addToCart } from '../utils/cart';
import { Link,useNavigate } from 'react-router-dom';

const getWishlist = () => {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
};

const addToWishlist = (productId) => {
    const wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        toast.success('Ditambahkan ke Wishlist!');
    }
};

const removeFromWishlist = (productId) => {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    toast.error('Dihapus dari Wishlist!');
};

const ProductCard = ({ product }) => {
    const [isWished, setIsWished] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            setIsWished(getWishlist().includes(product.id));
        }
    }, [product.id, token]);

     const handleWishlistToggle = (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('Silakan login untuk menambahkan ke wishlist.');
            navigate('/auth');
            return;
        }
        
        if (isWished) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
        setIsWished(!isWished);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('Silakan login untuk menambahkan ke keranjang.');
            navigate('/auth');
            return;
        }
        addToCart(product, 1);
    };

    const renderRating = () => {
        if (product.review_count > 0) {
            const rating = Math.round(product.avg_rating);
            return (
                <div className="product-card-rating">
                    {[...Array(rating)].map((_, i) => <FaStar key={i} />)}
                    <span className="review-count">({product.review_count})</span>
                </div>
            );
        }
        return <div className="product-card-rating no-rating">Belum ada ulasan</div>;
    };

    const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/${product.image_url?.replace(/\\/g, '/')}`;
    
    return (
        <Link to={`/product/${product.id}`} className="product-card-link">
            <div className="product-card">
                <div className="product-card-wishlist" onClick={handleWishlistToggle}>
                    {isWished ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                </div>
                <img src={imageUrl} alt={product.name} />
                <p className="product-card-name">{product.name}</p>
                <p className="product-card-price">Rp {parseInt(product.price).toLocaleString('id-ID')}</p>
                {renderRating()}
                <button className="product-card-add" onClick={handleAddToCart}>
                    <FaCartPlus />
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
