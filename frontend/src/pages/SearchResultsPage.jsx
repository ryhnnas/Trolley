import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import ProductCard from '../components/ProductCard';
import '../styles/Homepage.css'; 

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const query = searchParams.get('query');

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query) return; 
            setLoading(true);
            try {
                const response = await api.get(`/products?search=${query}`);
                setProducts(response.data);
            } catch (error) {
                console.error("Gagal melakukan pencarian", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [query]);

    return (
        <div className="homepage-container">
            <div className="trending-section">
                <div className="trending-header">
                    <h2>Hasil Pencarian untuk: "{query}"</h2>
                </div>
                <div className="product-grid">
                    {loading ? (
                        <p>Mencari produk...</p>
                    ) : (
                        products.length > 0 ? products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        )) : <p>Produk tidak ditemukan.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;