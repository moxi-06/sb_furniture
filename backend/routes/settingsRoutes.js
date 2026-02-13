const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getSettings);
router.put('/', protect, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
    { name: 'promoPopupImage', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
]), updateSettings);

module.exports = router;
