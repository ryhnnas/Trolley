const db = require('../config/database');

exports.create = async (storeData, connection) => {
  const conn = connection || db;
  const [result] = await conn.query('INSERT INTO stores SET ?', [storeData]);
  return result;
};

exports.findStoreByUserId = async (userId) => {
    const [rows] = await db.query('SELECT * FROM stores WHERE user_id = ?', [userId]);
    return rows[0];
};

exports.getStoreStats = async (storeId) => {
    const [salesResult] = await db.query(
        `SELECT SUM(oi.quantity * oi.price_per_item) as totalSales 
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE oi.store_id = ? AND o.status = 'Completed'`,
        [storeId]
    );
    const [productsSoldResult] = await db.query(
        `SELECT SUM(oi.quantity) as productsSold 
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE oi.store_id = ? AND o.status = 'Completed'`,
        [storeId]
    );
    const [newOrdersResult] = await db.query(
        `SELECT COUNT(DISTINCT o.id) as newOrders
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE oi.store_id = ? AND o.status = 'Processing'`,
        [storeId]
    );
    return {
        totalSales: salesResult[0].totalSales || 0,
        productsSold: parseInt(productsSoldResult[0].productsSold) || 0,
        newOrders: newOrdersResult[0].newOrders || 0
    };
};

exports.getPublicStoreProfile = async (storeId) => {
    const [storeRows] = await db.query('SELECT * FROM stores WHERE id = ?', [storeId]);
    if (storeRows.length === 0) return null;
    const storeProfile = storeRows[0];
    const productModel = require('./productModel'); 
    storeProfile.products = await productModel.findByStoreId(storeId);
    const [ratingStats] = await db.query(
        `SELECT AVG(rating) as store_avg_rating, COUNT(id) as total_reviews 
         FROM reviews 
         WHERE product_id IN (SELECT id FROM products WHERE store_id = ?)`,
        [storeId]
    );
    storeProfile.rating = parseFloat(ratingStats[0].store_avg_rating || 0).toFixed(1);
    storeProfile.review_count = ratingStats[0].total_reviews || 0;
    return storeProfile;
};