import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../styles/Homepage.css';
import ProductCard from '../components/ProductCard';

const Homepage = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [filters, setFilters] = useState({
        kategori: 'Semua',
        urutkan: 'terbaru'
    });

    const categories = [
      "Semua",
      "Kaos & T-Shirt",
      "Kemeja & Blus",
      "Celana & Rok",
      "Jaket & Outerwear",
      "Dress & Gamis",
      "Hijab",
      "Tas & Dompet",
      "Sepatu",
      "Handphone",
      "Laptop",
      "Buku",
      "Makeup"
    ];
    const sortOptions = {
        'terbaru': 'Terbaru',
        'termurah': 'Harga: Terendah ke Tertinggi',
        'termahal': 'Harga: Tertinggi ke Terendah',
        'rating': 'Rating Tertinggi'
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const profileResponse = await api.get('/users/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(profileResponse.data);
                } catch (err) {
                    console.error('Gagal mengambil data profil', err);
                }
            }
            setLoadingUser(false);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const params = new URLSearchParams(filters);
                const response = await api.get(`/products?${params.toString()}`);
                setProducts(response.data);
            } catch (err) {
                console.error('Gagal memuat produk.', err);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const renderGreeting = () => {
        if (loadingUser) return "Memuat...";
        if (user) return user.name;
        return "Tamu";
    };

    return (
        <div className="homepage-container">
            <div className="welcome-greeting">
                <h1>Halo, {renderGreeting()} 👋</h1>
                <p>Mau belanja apa hari ini?</p>
            </div>

            <section className="homepage-banner">
                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/banner-promo.jpg`} alt="Promotional Banner" />
            </section>

            <section className="trending-section">
                <div className="filter-bar">
                    <div className="filter-group">
                        <label htmlFor="kategori">Kategori</label>
                        <select name="kategori" id="kategori" value={filters.kategori} onChange={handleFilterChange}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="urutkan">Urutkan</label>
                        <select name="urutkan" id="urutkan" value={filters.urutkan} onChange={handleFilterChange}>
                            {Object.entries(sortOptions).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="product-grid">
                    {loadingProducts ? (
                        <p>Memuat produk...</p>
                    ) : (
                        products.length > 0 ? products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        )) : <p>Produk tidak ditemukan.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Homepage;
