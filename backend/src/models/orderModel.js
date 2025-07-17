const db = require('../config/database');

exports.getProductsForOrder = async (productIds, connection) => {
  const conn = connection || db;
  const [rows] = await conn.query('SELECT * FROM products WHERE id IN (?) FOR UPDATE', [productIds]);
  return rows;
};

exports.createOrder = async (orderData, connection) => {
  const conn = connection || db;
  const [result] = await conn.query('INSERT INTO orders SET ?', [orderData]);
  return result;
};

exports.createOrderItem = async (itemData, connection) => {
  const conn = connection || db;
  await conn.query('INSERT INTO order_items SET ?', [itemData]);
};

exports.decreaseStock = async (productId, quantity, connection) => {
  const conn = connection || db;
  await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);
};

exports.findOrdersByBuyerId = async (buyerId) => {
    const [orders] = await db.query('SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC', [buyerId]);
    for (const order of orders) {
        const [items] = await db.query(`
            SELECT 
                oi.product_id, 
                oi.quantity, 
                oi.price_per_item,
                p.name as product_name,
                (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as product_image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [order.id]);
        order.items = items;
    }

    return orders;
};

exports.findStoreByUserId = async (userId) => {
    const [rows] = await db.query('SELECT id FROM stores WHERE user_id = ?', [userId]);
    return rows[0];
};

exports.findOrdersByStoreId = async (storeId) => {
    const [rows] = await db.query(`
        SELECT oi.order_id, o.status, p.name as product_name, oi.quantity, oi.price_per_item, o.created_at
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE oi.store_id = ? ORDER BY o.created_at DESC`, [storeId]);
    return rows;
};

exports.updateStatus = async (orderId, status) => {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return result;
};

exports.findOrderById = async (orderId) => {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    return rows[0];
};