const storeModel = require('../models/storeModel');

exports.getStats = async (req, res) => {
    try {
        const store = await storeModel.findStoreByUserId(req.user.id);
        if (!store) {
            return res.status(404).json({ message: "Toko tidak ditemukan." });
        }
        const stats = await storeModel.getStoreStats(store.id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.getMyStore = async (req, res) => {
    try {
        const store = await storeModel.findStoreByUserId(req.user.id);
        if (!store) {
            return res.status(404).json({ message: "Toko tidak ditemukan." });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.getPublicStore = async (req, res) => {
    try {
        const store = await storeModel.getPublicStoreProfile(req.params.storeId);
        if (!store) {
            return res.status(404).json({ message: "Toko tidak ditemukan." });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};