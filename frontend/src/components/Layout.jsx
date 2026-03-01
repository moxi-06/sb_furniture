import React, { useEffect } from 'react';
import Navbar from './Navbar';
import WhatsAppButton from './WhatsAppButton';
import PromoPopup from './PromoPopup';
import Footer from './Footer';
import { useSettings } from '../context/SettingsContext';

const Layout = ({ children }) => {
    const { settings } = useSettings();

    useEffect(() => {
        // Inject SEO Meta Tags
        if (settings) {
            document.title = settings.siteTitle || 'Sai Balaji Furniture';

            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = settings.siteMetaDescription || 'Premium furniture for modern living spaces.';

            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = settings.siteKeywords || 'furniture, wooden, custom, madhavaram';

            // Favicon
            if (settings.favicon?.url) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = settings.favicon.url;
            }
        }

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
    }, [settings]);

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
