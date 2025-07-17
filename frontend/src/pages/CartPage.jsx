import React, { useState, useEffect } from 'react';
import { getCart, saveCart } from '../utils/cart';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CartPage.css';
import toast from 'react-hot-toast';

const CartPage = () => {
    const navigate = useNavigate()

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    const shippingCost = 9000;
    const serviceFee = 2000;

    useEffect(() => {
        const cartData = getCart();
        setCartItems(cartData);
    }, []);

    useEffect(() => {
        const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setSubtotal(newSubtotal);
    }, [cartItems]);

   const handleQuantityChange = (productId, newQuantity) => {
        let updatedCart;
        if (newQuantity <= 0) {
            if (window.confirm("Hapus item ini dari keranjang?")) {
                updatedCart = cartItems.filter(item => item.id !== productId);
                toast.error('Item dihapus dari keranjang!');
            } else {
                return;
            }
        } else {
            updatedCart = cartItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        }
        
        setCartItems(updatedCart);
        saveCart(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleRemoveItem = (productId) => {
        if (window.confirm("Hapus item ini dari keranjang?")) {
            const updatedCart = cartItems.filter(item => item.id !== productId);
            setCartItems(updatedCart);
            saveCart(updatedCart);
            window.dispatchEvent(new Event('cartUpdated'));
            toast.error('Item dihapus dari keranjang!');
        }
    };

    return (
        <div className="cart-page-container">
            <div className="back-link" onClick={() => navigate(-1)}>
                &lt; Kembali
            </div>
            <h1>KERANJANG KAMU</h1>
            <div className="cart-layout">
                <div className="cart-items-list">
                    {cartItems.length > 0 ? cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <button onClick={() => handleRemoveItem(item.id)} className="remove-item-btn">×</button>
                            <img src={`${import.meta.env.VITE_BACKEND_URL}/${item.image_url?.replace(/\\/g, '/')}`} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                            </div>
                            <div className="quantity-stepper">
                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <p className="cart-item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                        </div>
                    )) : (
                        <p>Keranjang Anda masih kosong.</p>
                    )}
                </div>

                <aside className="cart-summary">
                    <h2>TOTAL KERANJANG</h2>
                    <div className="summary-row">
                        <span>Subtotal untuk Produk</span>
                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="summary-row">
                        <span>Biaya Pengiriman (2 - 3 hari)</span>
                        <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="summary-row">
                        <span>Biaya Layanan</span>
                        <span>Rp {serviceFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>Rp {(subtotal + shippingCost + serviceFee).toLocaleString('id-ID')}</span>
                    </div>
                    <Link to="/checkout"><button className="checkout-button">Lakukan Checkout</button></Link>
                    <Link to="/"><button className="continue-shopping-button">Lanjutkan Belanja</button></Link>
                </aside>
            </div>
        </div>
    );
};

export default CartPage;