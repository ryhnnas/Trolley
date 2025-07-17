const db = require('../config/database');

exports.create = async (productData) => {
  const [result] = await db.query('INSERT INTO products SET ?', [productData]);
  return result;
};

exports.addImage = async (productId, imageUrl) => {
  await db.query('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [productId, imageUrl]);
};

exports.findAll = async (filters = {}) => {
    let query = `
        SELECT p.*, s.name as store_name, 
               (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url,
               rev.avg_rating, rev.review_count
        FROM products p
        JOIN stores s ON p.store_id = s.id
        LEFT JOIN (
            SELECT product_id, AVG(rating) as avg_rating, COUNT(id) as review_count 
            FROM reviews 
            GROUP BY product_id
        ) rev ON p.id = rev.product_id
    `;
    const queryParams = [];
    const whereClauses = [];
    if (filters.search) {
        whereClauses.push('p.name LIKE ?');
        queryParams.push(`%${filters.search}%`);
    }
    if (filters.kategori && filters.kategori !== 'Semua') {
        whereClauses.push('p.category = ?');
        queryParams.push(filters.kategori);
    }
    if (filters.minHarga) {
        whereClauses.push('p.price >= ?');
        queryParams.push(filters.minHarga);
    }
    if (filters.maxHarga) {
        whereClauses.push('p.price <= ?');
        queryParams.push(filters.maxHarga);
    }
    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    }
    let orderBy = 'ORDER BY p.created_at DESC';
    switch (filters.urutkan) {
        case 'termurah':
            orderBy = 'ORDER BY p.price ASC';
            break;
        case 'termahal':
            orderBy = 'ORDER BY p.price DESC';
            break;
        case 'rating':
            orderBy = 'ORDER BY rev.avg_rating DESC';
            break;
    }
    query += ` ${orderBy}`;
    const [rows] = await db.query(query, queryParams);
    return rows;
};

exports.findById = async (id) => {
    const [productRows] = await db.query(
        `SELECT p.*, s.name as store_name, s.user_id as seller_id 
         FROM products p 
         JOIN stores s ON p.store_id = s.id 
         WHERE p.id = ?`, 
        [id]
    );
    if (productRows.length === 0) return null;
    const product = productRows[0];
    const [imageRows] = await db.query(`
        SELECT image_url 
        FROM product_images 
        WHERE product_id = ?`
        , [id]);
    product.images = imageRows.map(img => img.image_url);
    const [reviewRows] = await db.query(`
        SELECT r.*, u.name as user_name 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.product_id = ? 
        ORDER BY r.created_at DESC`,
        [id]);
    product.reviews = reviewRows;
    const [ratingStats] = await db.query(`
        SELECT AVG(rating) as avg_rating, COUNT(id) as review_count 
        FROM reviews WHERE product_id = ?`
        , [id]);
    product.avg_rating = ratingStats[0].avg_rating;
    product.review_count = ratingStats[0].review_count;

    return product;
};

exports.findStoreByUserId = async (userId) => {
    const [rows] = await db.query('SELECT * FROM stores WHERE user_id = ?', [userId]);
    return rows[0];
};

exports.update = async (id, data) => {
    await db.query('UPDATE products SET ? WHERE id = ?', [data, id]);
};

exports.remove = async (id) => {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
};

exports.findByStoreId = async (storeId) => {
    const [rows] = await db.query(`
        SELECT p.*, s.name as store_name, 
               (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url
        FROM products p
        JOIN stores s ON p.store_id = s.id
        WHERE p.store_id = ?
    `, [storeId]);
    return rows;
};