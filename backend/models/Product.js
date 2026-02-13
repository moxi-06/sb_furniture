const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // For "Amazon-like" offer display
  offerLabel: { type: String }, // e.g., "50% OFF", "Limited Time Offer"
  category: { type: String, default: 'General' },
  stock: { type: Number, default: 0 },
  images: [{
    url: String,
    public_id: String
  }],
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
