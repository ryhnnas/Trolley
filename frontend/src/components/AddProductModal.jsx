import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProductModal = ({ show, onClose, onProductAdded, initialData }) => {
    const categories = [
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

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [image, setImage] = useState(null);
    const isEditMode = !!initialData;

    useEffect(() => {
        if (isEditMode) {
            setName(initialData.name);
            setDescription(initialData.description);
            setPrice(initialData.price);
            setStock(initialData.stock);
            setCategory(initialData.category);
        } else {
            setName(''); setDescription(''); setPrice(''); setStock(''); setCategory('Kaos & T-Shirt');
        }
    }, [initialData, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        };

        const promise = isEditMode
            ? axios.put(`http://localhost:5000/api/products/${initialData.id}`, formData, config)
            : axios.post('http://localhost:5000/api/products', formData, config);

        toast.promise(promise, {
            loading: 'Menambahkan produk...',
            success: 'Produk berhasil ditambahkan!',
            error: 'Gagal menambahkan produk.',
        });

        promise.then(() => {
            onProductAdded();
            onClose(); 
        });
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Nama Produk</label><input type="text" onChange={(e) => setName(e.target.value)} required /></div>
                    <div className="form-group"><label>Deskripsi</label><textarea rows="3" style={{width: '100%'}} onChange={(e) => setDescription(e.target.value)} required></textarea></div>
                    <div className="form-group"><label>Harga (Rp)</label><input type="number" onChange={(e) => setPrice(e.target.value)} required /></div>
                    <div className="form-group"><label>Stok</label><input type="number" onChange={(e) => setStock(e.target.value)} required /></div>
                    <div className="form-group">
                        <label>Kategori</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}}>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group"><label>Gambar Produk</label><input type="file" onChange={(e) => setImage(e.target.files[0])} /></div>
                    <button type="submit" className="profile-button">Simpan Produk</button>
                    <button type="button" onClick={onClose} style={{marginLeft: '10px'}}>Batal</button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;