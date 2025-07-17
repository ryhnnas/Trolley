const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken, isSeller } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/initiate', chatController.initiateConversation);
router.get('/messages/:conversationId', chatController.getMessagesByConversation);
router.get('/seller-inbox', authenticateToken, isSeller, chatController.getSellerConversations);
router.get('/inbox', authenticateToken, chatController.getUserConversations);
router.patch('/messages/:conversationId/read', chatController.markConversationAsRead);

module.exports = router;