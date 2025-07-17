const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');
const productModel = require('../models/productModel');

exports.initiateConversation = async (req, res) => {
    const { productId } = req.body;
    const buyerId = req.user.id;
    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }
        const sellerId = product.seller_id;

        if (buyerId === sellerId) {
            return res.status(400).json({ message: "Anda tidak bisa mengirim pesan ke toko Anda sendiri." });
        }
        const conversation = await conversationModel.findOrCreate(buyerId, sellerId, productId);
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.getMessagesByConversation = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await messageModel.findByConversationId(conversationId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.getSellerConversations = async (req, res) => {
    try {
        const conversations = await conversationModel.findBySellerId(req.user.id);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.getUserConversations = async (req, res) => {
    try {
        const conversations = await conversationModel.findByUserId(req.user.id);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

exports.markConversationAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;
        await messageModel.markAsRead(conversationId, userId);
        res.json({ message: "Pesan ditandai sudah dibaca." });
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};