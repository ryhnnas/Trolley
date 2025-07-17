import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { getCart, saveCart } from '../utils/cart';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [selectedCardId, setSelectedCardId] = useState('');

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 9000; 
    const serviceFee = 2000;
    const total = subtotal + shippingCost + serviceFee;

    useEffect(() => {
        const itemsFromState = location.state?.items;
        if (itemsFromState) {
            setItems(itemsFromState);
        } else {
            setItems(getCart());
        }

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        api.get('/addresses', config).then(res => {
            setAddresses(res.data);
            const primaryAddress = res.data.find(addr => addr.is_primary);
            if (primaryAddress) setSelectedAddressId(primaryAddress.id);
        });
        api.get('/cards', config).then(res => {
            setCards(res.data);
            const primaryCard = res.data.find(card => card.is_primary);
            if (primaryCard) setSelectedCardId(primaryCard.id);
        });
    }, [location.state]);

    const handlePlaceOrder = async () => {
        if (!selectedAddressId || !selectedCardId) {
            return toast.error("Silakan pilih alamat dan metode pembayaran.");
        }

        const orderData = {
            items: items,
            shipping_address_id: selectedAddressId,
            payment_card_id: selectedCardId,
            total_amount: total
        };

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const promise = api.post('/orders', orderData, config);

        toast.promise(promise, {
            loading: 'Memproses pesanan...',
            success: 'Pesanan berhasil dibuat!',
            error: 'Gagal membuat pesanan.',
        });

        promise.then(() => {
            if (!location.state?.items) {
                saveCart([]);
                window.dispatchEvent(new Event('cartUpdated'));
            }
            navigate('/dashboard/orders');
        });
    };

    return (
        <div className="checkout-page-container">
            <div className="back-link" onClick={() => navigate(-1)}>
                &lt; Kembali
            </div>
            <h1>Checkout</h1>
            <div className="checkout-layout">
                <div className="checkout-details">
                    <div className="checkout-section">
                        <h2>Alamat Pengiriman</h2>
                        {addresses.map(addr => (
                            <label key={addr.id} className="selection-card">
                                <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id} onChange={(e) => setSelectedAddressId(Number(e.target.value))} />
                                <div className="selection-content">
                                    <strong>{addr.label}</strong> ({addr.recipient_name})
                                    <p>{addr.full_address}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="checkout-section">
                        <h2>Metode Pembayaran</h2>
                        {cards.map(card => (
                            <label key={card.id} className="selection-card">
                                <input type="radio" name="card" value={card.id} checked={selectedCardId === card.id} onChange={(e) => setSelectedCardId(Number(e.target.value))} />
                                <div className="selection-content">
                                    <strong>{card.card_network}</strong>
                                    <p>{card.masked_number}</p>
                                </div>
                            </label>
                        ))}
                    </div>
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
                    <button className="place-order-button" onClick={handlePlaceOrder}>Lakukan Pembayaran</button>
                </aside>
            </div>
        </div>
    );
};

export default CheckoutPage;