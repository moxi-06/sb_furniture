require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const Admin = mongoose.model('Admin', adminSchema);

const createAdmin = async () => {
    const email = 'admin@gmail.com';
    const password = 'Admin@123';

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('(Will NOT overwrite - credentials are preserved in database)');
        } else {
            await Admin.create({ email, password });
            console.log('Admin created successfully!');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
