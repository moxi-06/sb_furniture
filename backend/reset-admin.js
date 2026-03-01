require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

const resetAdmin = async () => {
    const email = 'admin@gmail.com';
    const newPassword = 'Admin@123';

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const admin = await Admin.findOne({ email });
        if (admin) {
            admin.password = newPassword;
            await admin.save();
            console.log('Password reset successfully!');
            console.log('Email:', email);
            console.log('Password:', newPassword);
        } else {
            console.log('Admin not found');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

resetAdmin();
