const db = require('../config/database');

exports.create = async (userData) => {
  const [result] = await db.query('INSERT INTO users SET ?', [userData]);
  return result;
};

exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.updateRole = async (id, role, connection) => {
  const conn = connection || db;
  await conn.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
};

exports.getDashboardSummary = async (userId) => {
    const [recentOrders] = await db.query(
        'SELECT id, created_at, total_amount, status FROM orders WHERE buyer_id = ? ORDER BY created_at DESC LIMIT 3',
        [userId]
    );
    const [orderStats] = await db.query(
        'SELECT COUNT(*) as totalOrders, SUM(CASE WHEN status IN ("Processing", "Shipped") THEN 1 ELSE 0 END) as pendingOrders FROM orders WHERE buyer_id = ?',
        [userId]
    );
    const [unreadChatsResult] = await db.query(
        'SELECT COUNT(DISTINCT conversation_id) as unreadChats FROM messages WHERE receiver_id = ? AND is_read = 0',
        [userId]
    );
    return {
        recentOrders,
        totalOrders: orderStats[0].totalOrders || 0,
        pendingOrders: parseInt(orderStats[0].pendingOrders) || 0,
        unreadChats: unreadChatsResult[0].unreadChats || 0
    };
};

exports.updateInfo = async (userId, data) => {
    const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [data, userId]);
    return result;
};

exports.updatePassword = async (userId, hashedPassword) => {
    const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    return result;
};

exports.remove = async (userId) => {
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
};