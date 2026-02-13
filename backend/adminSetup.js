require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Settings = require('./models/Settings');

const setup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // 1. Create Default Admin
        const email = 'admin@furniture.com';
        const password = 'admin123'; // User should change this after login

        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            await Admin.create({ email, password });
            console.log(`✅ Admin created: ${email} / ${password}`);
        } else {
            console.log('ℹ️ Admin already exists.');
        }

        // 2. Initialize Settings if empty
        const existingSettings = await Settings.findOne();
        if (!existingSettings) {
            await Settings.create({});
            console.log('✅ Default settings initialized.');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error during setup:', err);
        process.exit(1);
    }
};

setup();
