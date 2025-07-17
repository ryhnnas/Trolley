// src/controllers/cardController.js
const cardModel = require('../models/cardModel');
const db = require('../config/database');

exports.getCards = async (req, res) => {
    try {
        const cards = await cardModel.findByUserId(req.user.id);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.addCard = async (req, res) => {
    const { cardholder_name, cardNumber, expiryDate, cvv } = req.body;
    if (!cardholder_name || !cardNumber || !expiryDate || !cvv) {
        return res.status(400).json({ message: "Semua data kartu harus diisi." });
    }
    const last4Digits = cardNumber.slice(-4);
    const masked_number = `**** **** **** ${last4Digits}`;
    let card_network = 'Other';
    if (cardNumber.startsWith('4')) {
        card_network = 'Visa';
    } else if (cardNumber.startsWith('5')) {
        card_network = 'Mastercard';
    }
    const [expiry_month, expiry_year_short] = expiryDate.split('/');
    const expiry_year = `20${expiry_year_short}`;
    const safeCardData = {
        user_id: req.user.id,
        cardholder_name,
        masked_number,
        card_network,
        expiry_month,
        expiry_year
    };
    try {
        const result = await cardModel.create(safeCardData);
        res.status(201).json({ message: "Kartu berhasil ditambahkan", cardId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const card = await cardModel.findById(req.params.id);
        if (!card || card.user_id !== req.user.id) {
            return res.status(403).json({ message: "Akses ditolak." });
        }
        await cardModel.remove(req.params.id);
        res.json({ message: "Kartu berhasil dihapus." });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.setPrimaryCard = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const card = await cardModel.findById(req.params.id);
        if (!card || card.user_id !== req.user.id) {
            throw new Error("Akses ditolak");
        }
        await cardModel.clearPrimary(req.user.id, connection);
        await cardModel.setPrimary(req.params.id, connection);
        await connection.commit();
        res.json({ message: "Kartu utama berhasil diatur." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Gagal mengatur kartu utama", error: error.message });
    } finally {
        connection.release();
    }
};