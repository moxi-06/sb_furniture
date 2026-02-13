const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// Get all products
const getProducts = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        let query = {};

        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, originalPrice, offerLabel, category, stock, featured } = req.body;

        let images = [];
        if (req.files) {
            images = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
        }

        const product = new Product({
            name, description, price, originalPrice, offerLabel, category, stock,
            featured: featured === 'true' || featured === true,
            images
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, description, price, originalPrice, offerLabel, category, stock, featured, existingImages } = req.body;

        // Handle image updates
        let updatedImages = existingImages ? JSON.parse(existingImages) : product.images;

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
            updatedImages = [...updatedImages, ...newImages];
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.originalPrice = originalPrice || product.originalPrice;
        product.offerLabel = offerLabel || product.offerLabel;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
        product.images = updatedImages;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete images from Cloudinary
        for (const image of product.images) {
            if (image.public_id) {
                try {
                    await cloudinary.uploader.destroy(image.public_id);
                } catch (err) {
                    console.error('Error deleting image from Cloudinary:', err);
                }
            }
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete single image from product
const deleteProductImage = async (req, res) => {
    try {
        const { imageIndex } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const idx = parseInt(imageIndex);
        if (idx >= 0 && idx < product.images.length) {
            const image = product.images[idx];
            if (image.public_id) {
                try {
                    await cloudinary.uploader.destroy(image.public_id);
                } catch (err) {
                    console.error('Error deleting image from Cloudinary:', err);
                }
            }
            product.images.splice(idx, 1);
            await product.save();
            res.json(product);
        } else {
            res.status(400).json({ message: 'Invalid image index' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, deleteProductImage };
