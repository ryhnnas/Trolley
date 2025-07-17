const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, isSeller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/my-store', authenticateToken, isSeller, productController.getSellerProducts);

router.get('/', productController.getAllProducts);

router.get('/:productId', productController.getProductById);

router.post('/', authenticateToken, isSeller, upload.single('image'), productController.createProduct);
router.put('/:productId', authenticateToken, isSeller, upload.single('image'), productController.updateProduct);
router.delete('/:productId', authenticateToken, isSeller, productController.deleteProduct);

module.exports = router;