import React, { useEffect } from 'react';
import Navbar from './Navbar';
import WhatsAppButton from './WhatsAppButton';
import PromoPopup from './PromoPopup';
import Footer from './Footer';
import { useSettings } from '../context/SettingsContext';

const Layout = ({ children }) => {
    const { settings } = useSettings();

    useEffect(() => {
        // Inject Custom JS if present
        if (settings?.customJS) {
            const script = document.createElement('script');
            script.innerHTML = settings.customJS;
            script.id = 'aura-custom-js';
            document.head.appendChild(script);
            return () => {
                const oldScript = document.getElementById('aura-custom-js');
                if (oldScript) oldScript.remove();
            };
        }
    }, [settings?.customJS]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--crease)' }}>
            {/* Custom CSS Injection */}
            {settings?.customCSS && (
                <style dangerouslySetInnerHTML={{ __html: settings.customCSS }} />
            )}

            <Navbar />
            <main style={{ flexGrow: 1, paddingTop: '90px' }}>
                {children}
            </main>
            <WhatsAppButton />
            <PromoPopup />
            <Footer />
        </div>
    );
};

export default Layout;
