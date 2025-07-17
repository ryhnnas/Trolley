import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import { FaStar, FaStore } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import '../styles/StoreProfilePage.css';

const StoreProfilePage = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/stores/${storeId}`);
                setStore(response.data);
            } catch (error) {
                console.error("Gagal mengambil data toko", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [storeId]);

    if (loading) return <p className="page-message">Memuat halaman toko...</p>;
    if (!store) return <p className="page-message">Toko tidak ditemukan.</p>;

    return (
        <div className="store-profile-container">
            <header className="store-header">
                <div className="store-avatar">
                    <FaStore />
                </div>
                <div className="store-info">
                    <h1>{store.name}</h1>
                    <div className="store-meta">
                        <span className="rating">
                            <FaStar /> {store.rating}
                        </span>
                        <span className="reviews">({store.review_count} ulasan)</span>
                    </div>
                    <p className="store-description">{store.description}</p>
                </div>
            </header>

            <main className="store-products-section">
                <h2>Semua Produk dari {store.name}</h2>
                <div className="product-grid">
                    {store.products.length > 0 ? store.products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    )) : (
                        <p>Toko ini belum memiliki produk.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StoreProfilePage;