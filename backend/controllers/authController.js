const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.comparePassword(password))) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.json({
                _id: admin._id,
                email: admin.email,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register admin (one-time setup or protected)
const registerAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminExists = await Admin.findOne({ email });
        if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

        const admin = await Admin.create({ email, password });
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update admin account (email or password)
const updateAdminAccount = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const admin = await Admin.findById(req.adminId);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        if (email) admin.email = email;
        if (newPassword) admin.password = newPassword; // Middleware will hash it

        await admin.save();
        res.json({ message: 'Account updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginAdmin, registerAdmin, updateAdminAccount };
