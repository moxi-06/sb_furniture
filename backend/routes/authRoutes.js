const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, updateAdminAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin); // Ideally protected or disabled after setup
router.put('/account', protect, updateAdminAccount);

module.exports = router;
