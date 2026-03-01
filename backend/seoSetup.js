require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

const seoData = {
    siteTitle: 'Sai Balaji Furniture - Best Furniture Shop in Madhavaram Chennai',
    siteMetaDescription: 'Affordable quality furniture in Madhavaram for homes, schools & bulk buyers. Stylish sofas, beds & custom furniture at trusted local prices.',
    siteKeywords: 'Furniture shop in Madhavaram, Best furniture store Madhavaram Chennai, Affordable furniture in Madhavaram, Wooden furniture shop Chennai North, Sofa sets in Madhavaram, Budget furniture shop near Roja Nagar, Home furniture showroom Madhavaram, Bedroom furniture Madhavaram Chennai, Dining table shop Madhavaram, School furniture supplier Chennai, Bulk furniture orders Madhavaram, Office furniture Madhavaram Chennai, Custom furniture Madhavaram, Middle-class budget furniture Chennai, Mattress and furniture shop Madhavaram, Ready-made furniture Chennai North, Family furniture store Madhavaram, Wholesale furniture Madhavaram, Quality wooden furniture Chennai, Local furniture shop near me Madhavaram',
    address: 'Roja Nagar, Madhavaram, Chennai, Tamil Nadu – 600060',
    brandName: 'SAI BALAJI FURNITURE',
    whatsappNumber: '919043335169',
    contactPhone: '9444257022'
};

const setupSEO = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(seoData);
            await settings.save();
            console.log('✅ Created new settings with SEO data.');
        } else {
            Object.assign(settings, seoData);
            await settings.save();
            console.log('✅ Updated existing settings with SEO data.');
        }

        console.log('🚀 SEO Setup Complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during SEO setup:', err);
        process.exit(1);
    }
};

setupSEO();
