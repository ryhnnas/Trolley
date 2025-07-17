import React, { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import '../styles/Dashboard.css';

const ProfilePage = () => {
    const [infoData, setInfoData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/profile', config);
                setInfoData({ name: res.data.name, email: res.data.email });
            } catch (error) {
                console.error("Gagal fetch user data", error);
            }
        };
        fetchUser();
    }, []);

    const handleInfoChange = (e) => {
        setInfoData({ ...infoData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        const promise = api.put('/users/profile', infoData, config);
        toast.promise(promise, {
            loading: 'Menyimpan...',
            success: 'Profil berhasil diperbarui!',
            error: (err) => err.response?.data?.message || 'Gagal menyimpan.',
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Password baru dan konfirmasi tidak cocok!");
        }
        const promise = api.put('/users/password', {
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        }, config);

        toast.promise(promise, {
            loading: 'Mengubah password...',
            success: 'Password berhasil diubah!',
            error: (err) => err.response?.data?.message || 'Gagal mengubah password.',
        });
    };


    return (
        <div className="profile-page">
            <div className="profile-section">
                <h2>Informasi Pribadi</h2>
                <form onSubmit={handleInfoSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nama Lengkap</label>
                        <input type="text" id="name" name="name" value={infoData.name} onChange={handleInfoChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={infoData.email} onChange={handleInfoChange} />
                    </div>
                    <button type="submit" className="profile-button">Simpan Perubahan Info</button>
                </form>
            </div>

            <div className="profile-section">
                <h2>Ubah Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label htmlFor="oldPassword">Password Lama</label>
                        <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Password Baru</label>
                        <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                    </div>
                    <button type="submit" className="profile-button">Ubah Password</button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;