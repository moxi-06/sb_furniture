import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const PromoPopup = () => {
    const { settings } = useSettings();
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '850px',
                            background: 'white',
                            borderRadius: '3rem',
                            overflow: 'hidden',
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
                            boxShadow: '0 50px 100px rgba(0,0,0,0.6)'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'white', border: '1px solid rgba(0,0,0,0.05)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--charcoal)', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                        >
                            <X size={20} />
                        </button>

                        {/* Image Side */}
                        <div style={{ height: isMobile ? '250px' : 'auto', position: 'relative' }}>
                            {settings?.promoPopupImage?.url ? (
                                <img src={settings.promoPopupImage.url} alt="Promo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div className="flex-center" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--charcoal), #222)' }}>
                                    <p style={{ color: 'var(--gold)', fontWeight: 900, fontSize: '2.5rem', letterSpacing: '0.1em' }}>{(settings?.brandName || 'AURA').toUpperCase()}</p>
                                </div>
                            )}
                        </div>

                        {/* Text Side */}
                        <div style={{ padding: isMobile ? '3rem 2rem' : '4rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
                            <div className="flex-column" style={{ gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ padding: '0.5rem 1.25rem', background: 'rgba(212,175,55,0.1)', borderRadius: '2rem' }}>
                                    <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '0.3em' }}>EXCLUSIVE OFFER</h4>
                                </div>
                                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                    {settings?.promoPopupTitle || 'Elevate Your Space'}
                                </h2>
                            </div>

                            <p style={{ color: 'var(--stone)', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500, maxWidth: '400px' }}>
                                {settings?.promoPopupText || 'Sign up for our newsletter or browse our latest collection and get amazing deals on luxury furniture.'}
                            </p>

                            <Link
                                to={settings?.promoPopupBtnLink || '/products'}
                                onClick={handleClose}
                                className="btn-luxury gold-gradient text-white"
                                style={{
                                    width: '100%',
                                    maxWidth: '300px',
                                    padding: '1.4rem 2rem',
                                    borderRadius: '1.5rem',
                                    textDecoration: 'none',
                                    fontWeight: 900,
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    boxShadow: '0 15px 30px rgba(212,175,55,0.2)',
                                    letterSpacing: '0.1em'
                                }}
                            >
                                {settings?.promoPopupBtnText || 'SHOP COLLECTION'}
                                <ArrowRight size={18} />
                            </Link>

                            <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: 800, color: 'var(--stone)', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.1em' }}>
                                NO THANKS, I'LL BROWSE FIRST
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PromoPopup;
