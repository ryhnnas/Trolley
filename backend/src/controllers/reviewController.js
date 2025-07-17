const reviewModel = require('../models/reviewModel');

exports.addReview = async (req, res) => {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user.id;
    if (!productId || !orderId || !rating) {
        return res.status(400).json({ message: "Data ulasan tidak lengkap." });
    }
    try {
        const hasPurchased = await reviewModel.verifyPurchase(userId, productId, orderId);
        if (!hasPurchased) {
            return res.status(403).json({ message: "Anda hanya bisa memberi ulasan untuk produk yang sudah dibeli." });
        }
        const reviewData = {
            user_id: userId,
            product_id: productId,
            order_id: orderId,
            rating,
            comment
        };
        await reviewModel.create(reviewData);
        res.status(201).json({ message: "Ulasan berhasil ditambahkan. Terima kasih!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Anda sudah memberikan ulasan untuk produk ini." });
        }
        res.status(500).json({ message: "Error server", error: error.message });
    }
};