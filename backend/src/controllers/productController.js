const productModel = require('../models/productModel');
const storeModel = require('../models/storeModel');
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.findAll(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error server.', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error server.', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    if (!name || !price || !stock) return res.status(400).json({ message: 'Nama, harga, dan stok harus diisi.'});
    if (!req.file) return res.status(400).json({ message: 'Gambar produk harus diunggah.' });
    try {
        const store = await productModel.findStoreByUserId(req.user.id);
        if (!store) return res.status(403).json({ message: 'Anda tidak memiliki toko.' });

        const productData = { store_id: store.id, name, description, price, stock, category };
        const newProduct = await productModel.create(productData);
        const imageUrl = req.file.path;
        await productModel.addImage(newProduct.insertId, imageUrl);
        res.status(201).json({ message: 'Produk berhasil dibuat.', productId: newProduct.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat produk.', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.productId);
        const store = await productModel.findStoreByUserId(req.user.id);
        if (!product || product.store_id !== store.id) return res.status(403).json({ message: 'Akses ditolak.' });
        const updatedData = { ...product, ...req.body };
        await productModel.update(req.params.productId, updatedData);
        if (req.file) {
            await productModel.addImage(req.params.productId, req.file.path);
        }
        res.status(200).json({ message: 'Produk berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui produk.', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.productId);
        const store = await productModel.findStoreByUserId(req.user.id);
        if (!product || product.store_id !== store.id) return res.status(403).json({ message: 'Akses ditolak.' });
        product.images.forEach(imagePath => {
            fs.unlink(path.join(__dirname, '../..', imagePath), err => {
                if (err) console.error("Gagal menghapus file:", imagePath, err);
            });
        });
        await productModel.remove(req.params.productId);
        res.status(200).json({ message: 'Produk berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus produk.', error: error.message });
    }
};

exports.getSellerProducts = async (req, res) => {
    try {
        const store = await storeModel.findStoreByUserId(req.user.id);
        if (!store) {
            return res.status(404).json({ message: "Toko tidak ditemukan." });
        }
        const products = await productModel.findByStoreId(store.id);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};