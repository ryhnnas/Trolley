import React, { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaShieldAlt, FaPaintBrush, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const navigate = useNavigate();

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleConfirmDelete = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        const config = { 
            headers: { Authorization: `Bearer ${token}` },
            data: { password: passwordConfirm }
        };

        const promise = api.delete('/users/me', config);

        toast.promise(promise, {
            loading: 'Menghapus akun Anda...',
            success: 'Akun berhasil dihapus. Anda akan logout.',
            error: (err) => err.response?.data?.message || 'Gagal menghapus akun.',
        });

        promise.then(() => {
            localStorage.removeItem('token');
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 2000);
        }).catch(err => {
            console.error(err);
        });
    };


  return (
    <div className="settings-page">
      <h1>Pengaturan Akun</h1>

      <div className="settings-section">
        <h2 className="section-title"><FaPaintBrush /> Tampilan</h2>
        <p>Pilih tema tampilan aplikasi.</p>
        <div className="form-group">
            <label htmlFor="theme-select">Tema Aplikasi</label>
            <select id="theme-select" value={theme} onChange={handleThemeChange} className="theme-select">
                <option value="light">Terang (Light)</option>
                <option value="dark">Gelap (Dark)</option>
            </select>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h2 className="section-title"><FaExclamationTriangle /> Zona Berbahaya</h2>
        <p>Tindakan berikut tidak dapat diurungkan. Harap berhati-hati.</p>
        <button className="settings-button danger-button" onClick={() => setShowDeleteModal(true)}>
          Hapus Akun Saya
        </button>
      </div>

    {showDeleteModal && (
      <div className="modal-overlay">
            <div className="modal-content">
                <h2>Apakah Anda Benar-benar Yakin?</h2>
                <p className="warning-text">
                    Tindakan ini akan menghapus semua data Anda secara permanen, termasuk toko, produk, dan riwayat pesanan.
                    Untuk melanjutkan, ketik password Anda di bawah ini.
                </p>
              <form onSubmit={handleConfirmDelete}>
                  <div className="form-group">
                      <label htmlFor="passwordConfirm">Password</label>
                      <input 
                          type="password" 
                          id="passwordConfirm"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          placeholder="Masukkan password Anda"
                          required 
                      />
                  </div>
                  <div className="modal-actions">
                      <button type="button" className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Batal</button>
                      <button type="submit" className="settings-button danger-button">Ya, Hapus Akun Saya</button>
                  </div>
              </form>
          </div>
      </div>
    )}

    </div>
  );
};

export default SettingsPage;