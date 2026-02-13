import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from 'react-router-dom';
import { generateWhatsAppLink } from '../utils/whatsapp';

const WhatsAppButton = () => {
    const { settings } = useSettings();
    const location = useLocation();

    // Don't show on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    let type = "home";
    if (location.pathname.includes('/products')) type = "products";
    if (location.pathname.includes('/product/')) type = "product";

    const whatsappLink = generateWhatsAppLink(settings?.whatsappNumber || '', type);

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 100,
                background: '#25D366',
                color: 'white',
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
            <MessageCircle size={26} />
        </a>
    );
};

export default WhatsAppButton;
