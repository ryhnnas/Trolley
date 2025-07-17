const db = require('../config/database');

exports.verifyPurchase = async (userId, productId, orderId) => {
    const [rows] = await db.query(
        'SELECT * FROM order_items WHERE order_id = ? AND product_id = ? AND (SELECT buyer_id FROM orders WHERE id = ?) = ?',
        [orderId, productId, orderId, userId]
    );
    return rows.length > 0;
};

exports.create = async (reviewData) => {
    const [result] = await db.query('INSERT INTO reviews SET ?', [reviewData]);
    return result;
};