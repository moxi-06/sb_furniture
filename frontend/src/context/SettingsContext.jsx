import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data } = await API.get('/settings');
            setSettings(data);

            // Apply dynamic colors to CSS variables
            if (data.primaryColor) {
                document.documentElement.style.setProperty('--charcoal', data.primaryColor);
                document.documentElement.style.setProperty('--charcoal-light', data.primaryColor);
            }
            if (data.accentColor) {
                document.documentElement.style.setProperty('--gold', data.accentColor);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setSettings, loading, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

