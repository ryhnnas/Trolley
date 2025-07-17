import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../styles/WishlistPage.css';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const getWishlist = () => {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
    };

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            const wishlistIds = getWishlist();
            if (wishlistIds.length > 0) {
                try {
                    const response = await api.get('/products');
                    const allProducts = response.data;
                    const wishedProducts = allProducts.filter(product => wishlistIds.includes(product.id));
                    setWishlistItems(wishedProducts);
                } catch (error) {
                    console.error("Gagal mengambil data produk untuk wishlist", error);
                }
            }
            setLoading(false);
        };

        fetchWishlistProducts();
    }, []);

    if (loading) {
        return <p>Memuat wishlist...</p>;
    }

    return (
        <div className="wishlist-page-container">
            <h1>Wishlist Saya</h1>
            {wishlistItems.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlistItems.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="wishlist-empty">
                    <h2>Wishlist Anda masih kosong</h2>
                    <p>Cari produk yang Anda suka dan klik ikon hati untuk menyimpannya di sini.</p>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;