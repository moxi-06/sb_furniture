import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Menu, X, MessageSquare, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [announcementDismissed, setAnnouncementDismissed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const sections = ['hero', 'customization', 'quality', 'categories', 'customers', 'testimonials'];
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            if (location.pathname === '/') {
                const scrollPosition = window.scrollY + 85; // Navbar height + small buffer
                let current = 'hero';

                for (const section of sections) {
                    const el = document.getElementById(section);
                    if (el) {
                        const offsetTop = el.offsetTop;
                        const height = el.offsetHeight;
                        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
                            current = section;
                        }
                    }
                }
                setActiveSection(current);
            } else {
                setActiveSection('');
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Run once on load
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const handleDismissAnnouncement = () => {
        setAnnouncementDismissed(true);
    };

    useEffect(() => {
        setAnnouncementDismissed(false);
    }, [location.pathname]);

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'CUSTOMIZE', path: '/#customization' },
        { name: 'CUSTOMERS', path: '/#customers' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'CONTACT', path: '/contact' },
    ];

    const isLinkActive = (path) => {
        if (location.pathname === '/') {
            if (path === '/') return activeSection === 'hero';
            if (path.includes('#')) {
                const hash = path.split('#')[1];
                return activeSection === hash;
            }
            return false;
        }
        return location.pathname === path;
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
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
                    <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
                        {settings?.logo?.url ? (
                            <img src={settings.logo.url} alt="Logo" style={{ height: '2.5rem' }} />
                        ) : (
                            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.04em' }}>{settings?.brandName || 'FURNITURE.'}</span>
                        )}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="desktop-only" style={{ gap: '2.5rem', alignItems: 'center' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                style={{
                                    color: isLinkActive(link.path) ? 'var(--gold)' : '#333',
                                    textDecoration: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    letterSpacing: '0.15em',
                                    opacity: 1,
                                    transition: 'all 0.3s'
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
                            className="gold-gradient text-white"
                            style={{
                                padding: '0.8rem 1.8rem',
                                borderRadius: '2rem',
                                fontSize: '0.75rem',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
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
                        style={{ color: 'var(--charcoal)', background: 'transparent', border: 'none', padding: '0.5rem' }}
                    >
                        {isOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>


            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.2rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    color: isLinkActive(link.path) ? 'var(--gold)' : '#333',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.15em',
                                    padding: '0.8rem 0',
                                    borderBottom: '1px solid rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {link.name}
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isLinkActive(link.path) ? 'var(--gold)' : 'transparent' }}></div>
                            </Link>
                        ))}
                        <a
                            href={`https://wa.me/${settings?.whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gold-gradient text-white"
                            style={{
                                padding: '1.2rem',
                                borderRadius: '1.25rem',
                                fontSize: '0.8rem',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                textDecoration: 'none',
                                textAlign: 'center',
                                marginTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.8rem'
                            }}
                        >
                            <MessageSquare size={18} />
                            {settings?.whatsappBtnText || 'CONNECT ON WHATSAPP'}
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
