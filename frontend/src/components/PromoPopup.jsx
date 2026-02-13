import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const PromoPopup = () => {
    const { settings } = useSettings();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (settings?.showPromoPopup) {
            const showEveryTime = settings.popupShowEveryTime;
            const storageKey = showEveryTime ? 'promo-dismissed-permanently' : 'promo-seen';
            const dismissed = sessionStorage.getItem(storageKey);
            
            if (!dismissed) {
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [settings]);

    const handleClose = () => {
        setIsVisible(false);
        if (settings?.popupShowEveryTime) {
            localStorage.setItem('promo-dismissed-permanently', 'true');
        } else {
            sessionStorage.setItem('promo-seen', 'true');
        }
    };

    if (!settings?.showPromoPopup) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
                    />

                    {/* Content Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '700px',
                            background: 'white',
                            borderRadius: '2.5rem',
                            overflow: 'hidden',
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth > 640 ? '1fr 1.2fr' : '1fr',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(255,255,255,0.9)', border: 'none', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--charcoal)' }}
                        >
                            <X size={18} />
                        </button>

                        {/* Image Side */}
                        <div style={{ background: '#eee', height: window.innerWidth > 640 ? 'auto' : '200px' }}>
                            {settings?.promoPopupImage?.url ? (
                                <img src={settings.promoPopupImage.url} alt="Promo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div className="flex-center" style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, var(--charcoal), #333)' }}>
                                    <p style={{ color: 'var(--gold)', fontWeight: 900, fontSize: '2rem' }}>{(settings?.brandName || 'STORE').toUpperCase()}</p>
                                </div>
                            )}
                        </div>

                        {/* Text Side */}
                        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>EXCLUSIVE OFFER</h4>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                    {settings?.promoPopupTitle || 'Elevate Your Space'}
                                </h2>
                            </div>
                            <p style={{ color: 'var(--stone)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                                {settings?.promoPopupText || 'Sign up for our newsletter or browse our latest collection and get amazing deals on luxury furniture.'}
                            </p>
                            <Link
                                to={settings?.promoPopupBtnLink || '/products'}
                                onClick={handleClose}
                                style={{
                                    background: 'var(--charcoal)',
                                    color: 'white',
                                    padding: '1.25rem 2rem',
                                    borderRadius: '1.25rem',
                                    textDecoration: 'none',
                                    fontWeight: 900,
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                {settings?.promoPopupBtnText || 'SHOP COLLECTION'}
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PromoPopup;
