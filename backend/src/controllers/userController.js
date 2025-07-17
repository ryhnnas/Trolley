const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error server.', error: error.message });
  }
};

exports.upgradeToSeller = async (req, res) => {
  const { storeName, storeDescription } = req.body;
  const userId = req.user.id;
  if (!storeName) {
    return res.status(400).json({ message: 'Nama toko harus diisi.' });
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await userModel.updateRole(userId, 'seller', connection);
    const storeData = { user_id: userId, name: storeName, description: storeDescription };
    await storeModel.create(storeData, connection);
    await connection.commit();
    const payload = { id: userId, role: 'seller' };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ 
      message: 'Selamat! Akun Anda telah di-upgrade menjadi penjual.',
      token: newToken 
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Nama toko sudah digunakan.' });
    res.status(500).json({ message: 'Gagal upgrade akun.', error: error.message });
  } finally {
    connection.release();
  }
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const summary = await userModel.getDashboardSummary(req.user.id);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.updateUserInfo = async (req, res) => {
    const { name, email } = req.body;
    const dataToUpdate = { name, email };
    try {
        await userModel.updateInfo(req.user.id, dataToUpdate);
        res.json({ message: "Profil berhasil diperbarui." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Email sudah digunakan oleh akun lain." });
        }
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password lama salah." });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updatePassword(req.user.id, hashedNewPassword);
        res.json({ message: "Password berhasil diubah." });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.deleteCurrentUser = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;
    if (!password) {
        return res.status(400).json({ message: "Password diperlukan untuk konfirmasi." });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah." });
        }
        await userModel.remove(userId);
        res.json({ message: "Akun Anda telah berhasil dihapus secara permanen." });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};