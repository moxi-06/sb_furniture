const Product = require('../models/Product');

// Bulk update prices
const bulkUpdatePrices = async (req, res) => {
    try {
        const { category, action, value } = req.body;

        if (!action || !value) {
            return res.status(400).json({ message: 'Action and value are required' });
        }

        const modifier = action === 'Increase' ? (1 + value / 100) : (1 - value / 100);

        const filter = category === 'All Products' ? {} : { category };

        const products = await Product.find(filter);

        const updates = products.map(p => {
            const newPrice = Math.round(p.price * modifier);
            const newOriginalPrice = p.originalPrice ? Math.round(p.originalPrice * modifier) : null;

            return Product.findByIdAndUpdate(p._id, {
                price: newPrice,
                originalPrice: newOriginalPrice
            });
        });

        await Promise.all(updates);

        res.json({ message: `Successfully updated ${products.length} products.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 5;
        const products = await Product.find({ stock: { $lt: threshold } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bulkUpdatePrices, getLowStockProducts };
