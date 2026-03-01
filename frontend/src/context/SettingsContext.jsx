import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

// SEO & Shop Defaults for Instant Branding
const DEFAULT_SETTINGS = {
    brandName: 'SAI BALAJI FURNITURE',
    siteTitle: 'Sai Balaji Furniture - Best Furniture Shop in Madhavaram Chennai',
    siteMetaDescription: 'Affordable quality furniture in Madhavaram for homes, schools & bulk buyers. Stylish sofas, beds & custom furniture at trusted local prices.',
    siteKeywords: 'Furniture shop in Madhavaram, Best furniture store Madhavaram Chennai, Affordable furniture in Madhavaram, Wooden furniture shop Chennai North, Sofa sets in Madhavaram, Budget furniture shop near Roja Nagar, Home furniture showroom Madhavaram, Bedroom furniture Madhavaram Chennai, Dining table shop Madhavaram, School furniture supplier Chennai, Bulk furniture orders Madhavaram, Office furniture Madhavaram Chennai, Custom furniture Madhavaram, Middle-class budget furniture Chennai, Mattress and furniture shop Madhavaram, Ready-made furniture Chennai North, Family furniture store Madhavaram, Wholesale furniture Madhavaram, Quality wooden furniture Chennai, Local furniture shop near me Madhavaram',
    address: 'Roja Nagar, Madhavaram, Chennai, Tamil Nadu – 600060',
    primaryColor: '#121212',
    accentColor: '#D4AF37',
    whatsappNumber: '919043335169',
    contactPhone: '9444257022',
};

export const SettingsProvider = ({ children }) => {
    // Load cached settings immediately if available
    const [settings, setSettings] = useState(() => {
        const cached = localStorage.getItem('aura_settings');
        return cached ? JSON.parse(cached) : DEFAULT_SETTINGS;
    });
    const [loading, setLoading] = useState(true);

    const applyColors = (data) => {
        if (data.primaryColor) {
            document.documentElement.style.setProperty('--charcoal', data.primaryColor);
            document.documentElement.style.setProperty('--charcoal-light', data.primaryColor);
        }
        if (data.accentColor) {
            document.documentElement.style.setProperty('--gold', data.accentColor);
        }
    };

    const fetchSettings = async () => {
        try {
            const { data } = await API.get('/settings');
            setSettings(data);
            localStorage.setItem('aura_settings', JSON.stringify(data));
            applyColors(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Fallback to defaults already in state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Apply initial colors (from cache or defaults)
        if (settings) applyColors(settings);
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setSettings, loading, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
