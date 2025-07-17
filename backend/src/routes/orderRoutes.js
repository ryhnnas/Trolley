const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, isSeller } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, orderController.createOrder);
router.get('/history', authenticateToken, orderController.getBuyerOrderHistory);

router.get('/store', authenticateToken, isSeller, orderController.getSellerStoreOrders);

router.patch('/:orderId/status', authenticateToken, orderController.updateOrderStatus);

module.exports = router;