const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken, isSeller } = require('../middleware/authMiddleware');

router.get('/:storeId', storeController.getPublicStore);

router.use(authenticateToken, isSeller);
router.get('/stats', storeController.getStats);
router.get('/my-store', storeController.getMyStore);

router.use(authenticateToken, isSeller);
router.get('/my-store/stats', authenticateToken, isSeller, storeController.getStats);
router.get('/my-store/details', authenticateToken, isSeller, storeController.getMyStore);

module.exports = router;