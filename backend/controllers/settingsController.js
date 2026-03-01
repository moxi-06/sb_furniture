const Settings = require('../models/Settings');
const { cloudinary } = require('../config/cloudinary');

// Get settings
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Create default if none exists
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update settings (Admin only)
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        const fields = req.body;

        // Helper to handle image replacement
        const handleImage = async (fieldName) => {
            if (req.files && req.files[fieldName]) {
                if (settings[fieldName] && settings[fieldName].public_id) {
                    await cloudinary.uploader.destroy(settings[fieldName].public_id);
                }
                settings[fieldName] = {
                    url: req.files[fieldName][0].path,
                    public_id: req.files[fieldName][0].filename
                };
            }
        };

        await handleImage('logo');
        await handleImage('heroImage');
        await handleImage('promoPopupImage');
        await handleImage('favicon');

        // Update other fields
        const jsonFields = ['socialLinks', 'testimonials', 'faqs', 'promoPopup'];

        Object.keys(fields).forEach(key => {
            if (jsonFields.includes(key)) {
                try {
                    settings[key] = typeof fields[key] === 'string' ? JSON.parse(fields[key]) : fields[key];
                } catch (e) {
                    console.error(`Error parsing ${key}:`, e);
                }
            } else if (!['logo', 'heroImage', 'promoPopupImage', 'favicon'].includes(key)) {
                // Convert string booleans to actual booleans
                if (fields[key] === 'true') settings[key] = true;
                else if (fields[key] === 'false') settings[key] = false;
                else settings[key] = fields[key];
            }
        });

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete image from settings
const deleteSettingImage = async (req, res) => {
    try {
        const { field } = req.params;
        const validFields = ['logo', 'heroImage', 'promoPopupImage', 'favicon'];
        
        if (!validFields.includes(field)) {
            return res.status(400).json({ message: 'Invalid image field' });
        }

        let settings = await Settings.findOne();
        if (!settings) return res.status(404).json({ message: 'Settings not found' });

        if (settings[field] && settings[field].public_id) {
            try {
                await cloudinary.uploader.destroy(settings[field].public_id);
            } catch (err) {
                console.error('Error deleting image from Cloudinary:', err);
            }
            settings[field] = { url: '', public_id: '' };
            await settings.save();
            res.json(settings);
        } else {
            res.status(400).json({ message: 'No image to delete' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSettings, updateSettings, deleteSettingImage };
