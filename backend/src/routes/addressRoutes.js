const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', addressController.getAddresses);
router.post('/', addressController.addAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.patch('/:id/set-primary', addressController.setPrimaryAddress);

module.exports = router;