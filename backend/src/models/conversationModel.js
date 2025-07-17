const db = require('../config/database');

exports.findOrCreate = async (buyerId, sellerId, productId) => {
    const [existing] = await db.query(`
        SELECT * FROM conversations WHERE buyer_id = ? AND seller_id = ? AND product_id = ?
        `,[buyerId, sellerId, productId]);
    if (existing.length > 0) {
        return existing[0];
    }
    const [result] = await db.query(`
        INSERT INTO conversations (buyer_id, seller_id, product_id) VALUES (?, ?, ?)
        `,[buyerId, sellerId, productId]);
    const [newConversation] = await db.query('SELECT * FROM conversations WHERE id = ?', [result.insertId]);
    return newConversation[0];
};

exports.findBySellerId = async (sellerId) => {
    const [conversations] = await db.query(`
        SELECT 
            c.id, c.product_id, c.updated_at,
            p.name AS product_name,
            u.name AS buyer_name,
            (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND receiver_id = ? AND is_read = 0) AS unread_count
        FROM conversations c
        JOIN users u ON c.buyer_id = u.id
        JOIN products p ON c.product_id = p.id
        WHERE c.seller_id = ?
        ORDER BY c.updated_at DESC
    `, [sellerId, sellerId]);

    return conversations;
};

exports.findByUserId = async (userId) => {
    const [conversations] = await db.query(`
        SELECT 
            c.id, c.product_id, c.updated_at,
            p.name AS product_name,
            buyer.name AS buyer_name,
            seller.name AS seller_name,
            (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND receiver_id = ? AND is_read = 0) AS unread_count
        FROM conversations c
        JOIN users buyer ON c.buyer_id = buyer.id
        JOIN users seller ON c.seller_id = seller.id
        JOIN products p ON c.product_id = p.id
        WHERE c.buyer_id = ? OR c.seller_id = ?
        ORDER BY c.updated_at DESC
    `, [userId, userId, userId]);

    return conversations;
};