import React, { useState, useEffect } from 'react';
import api from '../../api';
import { FaPlus, FaEdit, FaTrash, FaCreditCard, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../styles/CardsAndAddressesPage.css';

const CardModal = ({ show, onClose, onSave }) => {
    const [formData, setFormData] = useState({ cardholder_name: '', cardNumber: '', expiryDate: '', cvv: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    if (!show) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Tambah Kartu Baru</h2>
                <p style={{color: 'red', fontWeight: 'bold'}}>PERINGATAN: Ini adalah simulasi. Jangan masukkan nomor kartu asli Anda.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Nomor Kartu</label><input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="**** **** **** ****" required /></div>
                    <div className="form-group"><label>Nama Pemilik Kartu</label><input type="text" name="cardholder_name" value={formData.cardholder_name} onChange={handleChange} placeholder="Nama Lengkap" required /></div>
                    <div className="form-group" style={{display: 'flex', gap: '10px'}}>
                        <div style={{flex: 1}}><label>Kadaluarsa (MM/YY)</label><input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" required /></div>
                        <div style={{flex: 1}}><label>CVV</label><input type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" required /></div>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Batal</button>
                        <button type="submit" className="add-btn">Simpan Kartu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddressModal = ({ show, onClose, address, onSave }) => {
    const [formData, setFormData] = useState({});
    useEffect(() => {
        setFormData(address || { label: '', recipient_name: '', phone_number: '', full_address: '', city: '', postal_code: '' });
    }, [address, show]); 
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    if (!show) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{address ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Label Alamat(Rumah/Kantor)</label><input type="text" name="label" value={formData.label || ''} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Nama Penerima</label><input type="text" name="recipient_name" value={formData.recipient_name || ''} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Nomor Telepon</label><input type="text" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Alamat Lengkap</label><textarea name="full_address" rows="3" style={{width: '100%'}} value={formData.full_address || ''} onChange={handleChange} required></textarea></div>
                    <div className="form-group"><label>Kota / Kabupaten</label><input type="text" name="city" value={formData.city || ''} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Kode Pos</label><input type="text" name="postal_code" value={formData.postal_code || ''} onChange={handleChange} required /></div>
                    <div className="modal-form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Batal</button>
                        <button type="submit" className="add-btn">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PaymentCard = ({ card, onDelete }) => {
    const getCardLogo = (network) => {
        if (network?.toLowerCase() === 'visa') return <FaCcVisa />;
        if (network?.toLowerCase() === 'mastercard') return <FaCcMastercard />;
        return <FaCreditCard />;
    };
    return (
        <div className={`payment-card ${card.is_primary ? 'primary' : ''}`}>
            <div className="card-actions">
                <button title="Hapus" onClick={onDelete}><FaTrash /></button>
            </div>
             <div className="card-top">
                <img src="/chip.png" alt="Chip" className="card-chip" />
                <div className="card-network-logo">{getCardLogo(card.card_network)}</div>
            </div>
            <div className="card-number">{card.masked_number}</div>
            <div className="card-bottom">
                <div className="cardholder-name">{card.cardholder_name}</div>
                <div className="card-expiry">EXP {card.expiry_month}/{card.expiry_year.slice(-2)}</div>
            </div>
        </div>
    );
};

const AddressCard = ({ address, onEdit, onDelete, onSetPrimary }) => (
    <div className={`address-card ${address.is_primary ? 'primary' : ''}`}>
        <div>
            <div className="address-card-header">
                <h3>{address.label}</h3>
                {address.is_primary ? <span className="primary-badge">Utama</span> : null}
            </div>
            <div className="address-card-body">
                <p><strong>{address.recipient_name}</strong></p>
                <p>{address.phone_number}</p>
                <p>{address.full_address}, {address.city}, {address.postal_code}</p>
            </div>
        </div>
        <div className="address-card-actions">
            {!address.is_primary && (
                <button className="set-primary-btn" onClick={() => onSetPrimary(address.id)}>
                    Jadikan Utama
                </button>
            )}
            
            <div className="icon-actions">
                <button className="edit-btn" title="Edit" onClick={() => onEdit(address)}><FaEdit/></button>
                <button className="delete-btn" title="Hapus" onClick={() => onDelete(address.id)}><FaTrash/></button>
            </div>
        </div>
    </div>
);


const CardsAndAddressesPage = () => {
    const [cards, setCards] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAddresses = async () => {
        try { const res = await api.get('/addresses', config); setAddresses(res.data); } catch (error) { console.error("Gagal fetch alamat", error); }
    };
    const fetchCards = async () => {
        try { const res = await api.get('/cards', config); setCards(res.data); } catch (error) { console.error("Gagal fetch kartu", error); }
    };

    useEffect(() => {
        fetchAddresses();
        fetchCards();
    }, []);

    const handleOpenAddressModal = (address = null) => {
        setCurrentAddress(address);
        setShowAddressModal(true);
    };
    const handleCloseAddressModal = () => { setCurrentAddress(null); setShowAddressModal(false); };
    const handleOpenCardModal = () => setShowCardModal(true);
    const handleCloseCardModal = () => setShowCardModal(false);
    
    const handleSaveAddress = (formData) => {
        const promise = currentAddress
            ? api.put(`/addresses/${currentAddress.id}`, formData, config)
            : api.post('/addresses', formData, config);
        
        toast.promise(promise, { loading: 'Menyimpan alamat...', success: 'Alamat berhasil disimpan!', error: 'Gagal menyimpan.' });
        promise.then(() => {
            fetchAddresses();
            setShowAddressModal(false);
        });
    };

    const handleSaveCard = async (formData) => {
        const promise = api.post('/cards', formData, config);
        toast.promise(promise, { loading: 'Menyimpan kartu...', success: 'Kartu ditambahkan!', error: 'Gagal menyimpan.' });
        promise.then(() => { 
            fetchCards(); 
            handleCloseCardModal(); });
    };

    const handleDeleteCard = (cardId) => {
        if (window.confirm("Anda yakin ingin menghapus kartu ini?")) {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const promise = api.delete(`/cards/${cardId}`, config);
            
            toast.promise(promise, {
                loading: 'Menghapus kartu...',
                success: 'Kartu berhasil dihapus!',
                error: 'Gagal menghapus kartu.',
            });

            promise.then(() => fetchCards());
        }
    };
    
    const handleDeleteAddress = async (id) => {
        if (window.confirm("Yakin ingin menghapus alamat ini?")) {
            const promise = api.delete(`/addresses/${id}`, config);
            toast.promise(promise, { loading: 'Menghapus...', success: 'Alamat dihapus!', error: 'Gagal menghapus.' });
            promise.then(() => fetchAddresses());
        }
    };
    
    const handleSetPrimaryAddress = async (id) => {
        const promise = api.patch(`/addresses/${id}/set-primary`, {}, config);
        toast.promise(promise, { loading: 'Menyeting...', success: 'Alamat utama diubah!', error: 'Gagal.' });
        promise.then(() => fetchAddresses());
    };

    const handleSetPrimaryCard = async (cardId) => {
        const promise = api.patch(`/cards/${cardId}/set-primary`, {}, config);
        
        toast.promise(promise, {
            loading: 'Menyeting kartu utama...',
            success: 'Kartu utama berhasil diubah!',
            error: 'Gagal mengubah kartu utama.',
        });

        promise.then(() => {
            fetchCards();
            fetchAddresses(); 
        });
    };

    return (
        <div className="account-management-page">
            <AddressModal 
                show={showAddressModal} 
                onClose={handleCloseAddressModal} 
                address={currentAddress} 
                onSave={handleSaveAddress} 
            />
            <CardModal show={showCardModal} onClose={handleCloseCardModal} onSave={handleSaveCard} />
            
            <section className="account-section">
                <div className="section-header">
                    <h2>Kartu Saya</h2>
                    <button className="add-btn" onClick={handleOpenCardModal}><FaPlus /> Tambah Kartu</button>
                </div>
                <div className="card-grid">
                    {cards.length > 0 ? cards.map(card => (
                        <PaymentCard 
                            key={card.id} 
                            card={card} 
                            onDelete={() => handleDeleteCard(card.id)}
                            onSetPrimary={() => handleSetPrimaryCard(card.id)}
                        />
                    )) : <p>Belum ada kartu tersimpan.</p>}
                </div>
            </section>

            <section className="account-section">
                <div className="section-header">
                    <h2>Alamat Saya</h2>
                    <button className="add-btn" onClick={() => handleOpenAddressModal(null)}><FaPlus /> Tambah Alamat</button>
                </div>
                <div className="address-grid">
                    {addresses.length > 0 ? addresses.map(addr => (
                        <AddressCard 
                            key={addr.id} 
                            address={addr}
                            onEdit={handleOpenAddressModal}
                            onDelete={handleDeleteAddress}
                            onSetPrimary={handleSetPrimaryAddress}
                        />
                    )) : <p>Belum ada alamat tersimpan.</p>}
                </div>
            </section>
        </div>
    );
};

export default CardsAndAddressesPage;
