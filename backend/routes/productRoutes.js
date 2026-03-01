const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, deleteProductImage } = require('../controllers/productController');
const { bulkUpdatePrices, getLowStockProducts } = require('../controllers/productUtilController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/utils/low-stock', protect, getLowStockProducts);
router.post('/utils/bulk-price', protect, bulkUpdatePrices);
router.get('/:id', getProductById);
router.post('/', protect, upload.array('images', 5), createProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.delete('/:id/images', protect, deleteProductImage);

module.exports = router;
