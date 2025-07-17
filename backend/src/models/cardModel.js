const db = require('../config/database');

exports.findByUserId = async (userId) => {
    const [rows] = await db.query('SELECT * FROM payment_cards WHERE user_id = ? ORDER BY is_primary DESC, id DESC', [userId]);
    return rows;
};

exports.create = async (cardData) => {
    const [result] = await db.query('INSERT INTO payment_cards SET ?', [cardData]);
    return result;
};

exports.findById = async (id) => {
    const [rows] = await db.query('SELECT * FROM payment_cards WHERE id = ?', [id]);
    return rows[0];
};

exports.remove = async (id) => {
    await db.query('DELETE FROM payment_cards WHERE id = ?', [id]);
};

exports.clearPrimary = async (userId, connection) => {
    const conn = connection || db;
    await conn.query('UPDATE payment_cards SET is_primary = false WHERE user_id = ?', [userId]);
};

exports.setPrimary = async (id, connection) => {
    const conn = connection || db;
    await conn.query('UPDATE payment_cards SET is_primary = true WHERE id = ?', [id]);
};