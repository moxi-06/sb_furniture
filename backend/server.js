require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://sb-furniture-frontend.vercel.app'
        ];
        // Remove trailing slash from origin if present
        const cleanOrigin = origin?.replace(/\/$/, '');
        const cleanAllowedOrigins = allowedOrigins.map(o => o.replace(/\/$/, ''));
        
        if (!origin || cleanAllowedOrigins.includes(cleanOrigin)) {
            callback(null, cleanOrigin || true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Vercel serverless export
module.exports = app;
