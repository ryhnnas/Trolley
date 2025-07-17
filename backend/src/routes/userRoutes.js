const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, userController.getProfile);
router.post('/upgrade-to-seller', authenticateToken, userController.upgradeToSeller);
router.get('/dashboard-summary', authenticateToken, userController.getDashboardSummary);
router.put('/profile', authenticateToken, userController.updateUserInfo);
router.put('/password', authenticateToken, userController.updateUserPassword);
router.delete('/me', authenticateToken, userController.deleteCurrentUser);

module.exports = router;