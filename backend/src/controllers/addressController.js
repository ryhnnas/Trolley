// src/controllers/addressController.js
const addressModel = require('../models/addressModel');
const db = require('../config/database');

exports.getAddresses = async (req, res) => {
    try {
        const addresses = await addressModel.findByUserId(req.user.id);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const addressData = { ...req.body, user_id: req.user.id };
        const result = await addressModel.create(addressData);
        res.status(201).json({ message: "Alamat berhasil ditambahkan", addressId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await addressModel.findById(req.params.id);
        if (!address || address.user_id !== req.user.id) {
            return res.status(403).json({ message: "Akses ditolak" });
        }
        await addressModel.update(req.params.id, req.body);
        res.json({ message: "Alamat berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const address = await addressModel.findById(req.params.id);
        if (!address || address.user_id !== req.user.id) {
            return res.status(403).json({ message: "Akses ditolak" });
        }
        await addressModel.remove(req.params.id);
        res.json({ message: "Alamat berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.setPrimaryAddress = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const address = await addressModel.findById(req.params.id);
        if (!address || address.user_id !== req.user.id) {
            throw new Error("Akses ditolak");
        }
        await addressModel.clearPrimary(req.user.id, connection);
        await addressModel.setPrimary(req.params.id, connection);
        await connection.commit();
        res.json({ message: "Alamat utama berhasil diatur" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Gagal mengatur alamat utama", error: error.message });
    } finally {
        connection.release();
    }
};