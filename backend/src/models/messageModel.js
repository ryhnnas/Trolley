const db = require('../config/database');

exports.findByConversationId = async (conversationId) => {
    const [rows] = await db.query('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC', [conversationId]);
    return rows;
};

exports.create = async (messageData) => {
    const [result] = await db.query('INSERT INTO messages SET ?', [messageData]);
    const [newMessage] = await db.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    return newMessage[0];
};

exports.markAsRead = async (conversationId, receiverId) => {
    await db.query(
        'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND receiver_id = ?',
        [conversationId, receiverId]
    );
};