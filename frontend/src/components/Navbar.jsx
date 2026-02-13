import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Menu, X, MessageSquare, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [announcementDismissed, setAnnouncementDismissed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDismissAnnouncement = () => {
        setAnnouncementDismissed(true);
    };

    useEffect(() => {
        setAnnouncementDismissed(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'CONTACT', path: '/contact' },
    ];

    return (
        <nav style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            background: scrolled ? 'rgba(18, 18, 18, 0.85)' : 'rgba(18, 18, 18, 0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s ease'
        }}>
            {/* Announcement Bar */}
            {settings?.showAnnouncement && !announcementDismissed && (
                <div style={{
                    background: 'var(--gold)',
                    color: '#fff',
                    padding: '0.4rem 1rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    position: 'relative'
                }}>
                    <span>{settings.announcementText}</span>
                    {settings.announcementCountdown && (
                        <div style={{ gap: '0.3rem', background: 'rgba(0,0,0,0.15)', padding: '0.1rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.65rem' }}>
                            <Timer size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
                            SALE ENDS SOON
                        </div>
                    )}
                    <button
                        onClick={handleDismissAnnouncement}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '0 0.5rem',
                            fontSize: '0.9rem',
                            lineHeight: 1,
                            opacity: 0.8,
                            position: 'absolute',
                            right: '1rem'
                        }}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Main Navbar */}
            <div className="container" style={{ padding: '1rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        {settings?.logo?.url ? (
                            <img src={settings.logo.url} alt="Logo" style={{ height: '2.2rem' }} />
                        ) : (
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{settings?.brandName || 'FURNITURE.'}</span>
                        )}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="desktop-only" style={{ display: 'flex', gap: '2rem' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                style={{ 
                                    color: location.pathname === link.path ? 'var(--gold)' : '#fff',
                                    textDecoration: 'none',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    opacity: location.pathname === link.path ? 1 : 0.8,
                                    transition: 'all 0.2s',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="desktop-only" style={{ display: 'flex' }}>
                        <a
                            href={`https://wa.me/${settings?.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: 'var(--gold)',
                                color: '#fff',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '2rem',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                letterSpacing: '0.1em',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <MessageSquare size={14} />
                            {settings?.whatsappBtnText || 'WHATSAPP'}
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        className="mobile-only"
                        onClick={() => setIsOpen(!isOpen)} 
                        style={{ color: '#fff', background: 'transparent', border: 'none' }}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: block !important; }
                }
                @media (min-width: 769px) {
                    .desktop-only { display: flex !important; }
                    .mobile-only { display: none !important; }
                }
            `}</style>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            background: 'rgba(18, 18, 18, 0.98)',
                            backdropFilter: 'blur(20px)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    style={{ 
                                        color: location.pathname === link.path ? 'var(--gold)' : '#fff',
                                        textDecoration: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.1em',
                                        padding: '0.5rem 0',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <a
                                href={`https://wa.me/${settings?.whatsappNumber}`}
                                style={{
                                    background: 'var(--gold)',
                                    color: '#fff',
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.1em',
                                    textDecoration: 'none',
                                    textAlign: 'center'
                                }}
                            >
                                {settings?.whatsappBtnText || 'WHATSAPP'}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
