const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', cardController.getCards);
router.post('/', cardController.addCard);
router.delete('/:id', cardController.deleteCard);
router.patch('/:id/set-primary', cardController.setPrimaryCard);

module.exports = router;