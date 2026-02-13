const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    logo: {
        url: { type: String, default: '' },
        public_id: { type: String, default: '' }
    },
    heroTitle: { type: String, default: 'Beautiful Furniture for Your Home' },
    heroSubtitle: { type: String, default: 'Find the perfect furniture to make your home comfortable and stylish.' },
    brandName: { type: String, default: 'FURNITURE.' },
    adminPanelTitle: { type: String, default: '' },
    tagline: { type: String, default: 'Premium furniture for modern living spaces.' },
    productCardHeight: { type: String, default: '260px' },
    heroImage: {
        url: { type: String, default: '' },
        public_id: { type: String, default: '' }
    },
    whatsappNumber: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    email: { type: String, default: 'hello@aura.com' },
    address: { type: String, default: '123 Furniture Market, New Delhi, India' },
    mapLink: { type: String, default: '' },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' }
    },
    footerText: { type: String, default: '© 2026 Furniture. All Rights Reserved.' },

    // Customization: Colors
    primaryColor: { type: String, default: '#121212' },
    accentColor: { type: String, default: '#D4AF37' },

    // Customization: Main Page Texts
    featuredSectionTitle: { type: String, default: 'Our Best Picks' },
    featuredSectionSubtitle: { type: String, default: 'TOP SELLING' },
    qualitySectionTitle: { type: String, default: 'Why Choose Us' },
    qualitySectionSubtitle: { type: String, default: 'OUR PROMISE' },
    categorySectionTitle: { type: String, default: 'Shop by Type' },
    categorySectionSubtitle: { type: String, default: 'CATEGORIES' },
    heroBtnText: { type: String, default: 'See All Furniture' },
    heroBtnText2: { type: String, default: 'About Us' },
    heroLabel: { type: String, default: 'QUALITY FURNITURE' },

    // Additional Editable Features
    whatsappBtnText: { type: String, default: 'WHATSAPP' },
    footerTagline: { type: String, default: 'Premium furniture for modern living spaces.' },
    emptyProductsMessage: { type: String, default: 'No products found. Try a different search or category.' },
    emptyProductsBtnText: { type: String, default: 'SHOW ALL' },
    testimonialSectionTitle: { type: String, default: 'Customer Love' },
    testimonialSectionLabel: { type: String, default: 'REVIEWS' },

    // ABOUT PAGE CONFIG
    aboutText: { type: String, default: 'Premium furniture for modern living spaces. We bring you handpicked, high-quality furniture that makes your home beautiful and comfortable.' },
    aboutHeroTitle: { type: String, default: 'Our Story.' },
    aboutSection1Title: { type: String, default: 'We Pick the Best for You' },
    aboutSection1Text: { type: String, default: 'We carefully select every piece of furniture we sell. Only items that meet our quality standards make it to our store.' },
    aboutSection2Title: { type: String, default: 'Built to Last' },
    aboutSection2Text: { type: String, default: 'We use strong, durable materials like seasoned teak wood and high-quality foam.' },
    aboutStat1Number: { type: String, default: '15+' },
    aboutStat1Label: { type: String, default: 'YEARS' },
    aboutStat2Number: { type: String, default: '5000+' },
    aboutStat2Label: { type: String, default: 'HAPPY HOMES' },
    aboutQuote: { type: String, default: 'A beautiful home brings peace to the mind and joy to the heart.' },

    // CONTACT PAGE CONFIG
    contactHeroTitle: { type: String, default: 'Contact Us' },
    contactHeroSubtitle: { type: String, default: "Have a question about our furniture? Want to place an order? We're happy to help." },
    contactTimingsMonSat: { type: String, default: '10 AM – 8 PM' },
    contactTimingsSun: { type: String, default: '11 AM – 5 PM' },
    contactHelpTitle: { type: String, default: 'Need Help Choosing?' },
    contactHelpText: { type: String, default: "Not sure which furniture is right for your home? Message us on WhatsApp for free consultation." },

    // POLICIES
    privacyPolicy: { type: String, default: '' },
    returnPolicy: { type: String, default: '' },
    termsConditions: { type: String, default: '' },

    // PRODUCT PAGE SPECIFICS
    productDeliveryNote: { type: String, default: 'Careful delivery to your door' },
    productWarrantyNote: { type: String, default: 'Built to last generations' },

    // Hero Section
    heroLabel: { type: String, default: 'QUALITY FURNITURE' },

    // Quality/Features Section
    qualityFeatures: { type: String, default: JSON.stringify([
        { title: 'Strong & Durable', subtitle: 'Made with the best wood and materials that last for years.', icon: 'Shield' },
        { title: 'Free Delivery', subtitle: 'We deliver to your doorstep with careful handling.', icon: 'Truck' },
        { title: 'Trusted by 5000+ Families', subtitle: 'Our customers love us. We treat every order with care.', icon: 'HeartHandshake' },
        { title: 'Easy Returns', subtitle: 'Not satisfied? Return within 7 days, no questions asked.', icon: 'CheckCircle' }
    ]) },

    // Products Page
    productsPageTitle: { type: String, default: 'Our Furniture' },
    productsPageLabel: { type: String, default: 'ALL PRODUCTS' },
    productsSearchPlaceholder: { type: String, default: 'Search furniture...' },

    // NEW POWER FEATURES
    // Announcement Bar
    showAnnouncement: { type: Boolean, default: false },
    announcementText: { type: String, default: 'FREE DELIVERY ON ALL ORDERS ABOVE ₹50,000' },
    announcementBgColor: { type: String, default: '#D4AF37' },
    announcementTextColor: { type: String, default: '#ffffff' },
    announcementCountdown: { type: Date },

    // Section Visibility Toggles
    showFeaturedSection: { type: Boolean, default: true },
    showQualitySection: { type: Boolean, default: true },
    showCategoriesSection: { type: Boolean, default: true },
    showTestimonialsSection: { type: Boolean, default: true },

    // Promo Popup
    showPromoPopup: { type: Boolean, default: false },
    popupShowEveryTime: { type: Boolean, default: false },
    promoPopupTitle: { type: String, default: 'Special Offer!' },
    promoPopupText: { type: String, default: 'Get 10% off on your first order. Use code: AURA10' },
    promoPopupImage: { url: String, public_id: String },
    promoPopupBtnText: { type: String, default: 'Shop Now' },
    promoPopupBtnLink: { type: String, default: '/products' },

    // Testimonials
    testimonials: [{
        name: String,
        role: String,
        content: String,
        rating: { type: Number, default: 5 },
        image: String
    }],

    // FAQs
    faqs: [{
        question: String,
        answer: String
    }],

    // Inventory & Currency
    lowStockThreshold: { type: Number, default: 5 },
    currencySymbol: { type: String, default: '₹' },

    // Maintenance & Advanced
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'We are currently updating our showroom. Please check back soon!' },
    customCSS: { type: String, default: '' },
    customJS: { type: String, default: '' },

    // SEO
    siteTitle: { type: String, default: 'Premium Luxury Furniture' },
    siteMetaDescription: { type: String, default: 'Exquisite furniture for modern living. Shop our collection of sofas, beds, and more.' },
    siteKeywords: { type: String, default: 'furniture, luxury, sofa, bed, home decor, india' },
    favicon: { url: String, public_id: String },

    // Navigation Links
    navLinks: { type: String, default: JSON.stringify([
        { name: 'HOME', path: '/' },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'CONTACT', path: '/contact' }
    ]) }
});

module.exports = mongoose.model('Settings', settingsSchema);
