const db = require('../config/database');

exports.findByUserId = async (userId) => {
    const [rows] = await db.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_primary DESC, id DESC', [userId]);
    return rows;
};

exports.findById = async (id) => {
    const [rows] = await db.query('SELECT * FROM addresses WHERE id = ?', [id]);
    return rows[0];
};

exports.create = async (addressData) => {
    const [result] = await db.query('INSERT INTO addresses SET ?', [addressData]);
    return result;
};

exports.update = async (id, addressData) => {
    const [result] = await db.query('UPDATE addresses SET ? WHERE id = ?', [addressData, id]);
    return result;
};

exports.remove = async (id) => {
    const [result] = await db.query('DELETE FROM addresses WHERE id = ?', [id]);
    return result;
};

exports.clearPrimary = async (userId, connection) => {
    const conn = connection || db;
    await conn.query('UPDATE addresses SET is_primary = false WHERE user_id = ?', [userId]);
};

exports.setPrimary = async (id, connection) => {
    const conn = connection || db;
    await conn.query('UPDATE addresses SET is_primary = true WHERE id = ?', [id]);
};