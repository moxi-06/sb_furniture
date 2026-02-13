import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Instagram, Facebook, Phone } from 'lucide-react';

const Footer = () => {
    const { settings } = useSettings();

    return (
        <footer className="footer" style={{ background: 'var(--charcoal)', color: 'white', padding: '3rem 0 2rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Logo & Tagline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                        <Link to="/">
                            {settings?.logo?.url ? (
                                <img src={settings.logo.url} alt="Logo" style={{ height: '2.5rem', filter: 'brightness(0) invert(1)' }} />
                            ) : (
                                <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
                                    {settings?.brandName || 'FURNITURE.'}
                                </span>
                            )}
                        </Link>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, maxWidth: '250px' }}>
                            {settings?.footerTagline || 'Premium furniture for modern living spaces.'}
                        </p>
                    </div>

                    {/* Visit Us */}
                    <div className="flex-column" style={{ gap: '0.5rem', maxWidth: '250px' }}>
                        <h4 style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '0.2rem' }}>VISIT US</h4>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                            {settings?.address || '123 Furniture Market, New Delhi, India'}
                        </p>
                        {settings?.mapLink && (
                            <a href={settings.mapLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, textDecoration: 'underline' }}>
                                Get Directions →
                            </a>
                        )}
                    </div>

                    {/* Social & Contact */}
                    <div className="flex" style={{ gap: '1rem', alignItems: 'flex-start' }}>
                        {settings?.socialLinks?.instagram && (
                            <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex-center" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', transition: 'all 0.3s' }}>
                                <Instagram size={18} />
                            </a>
                        )}
                        {settings?.socialLinks?.facebook && (
                            <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex-center" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', transition: 'all 0.3s' }}>
                                <Facebook size={18} />
                            </a>
                        )}
                        {settings?.contactPhone && (
                            <a href={`tel:${settings.contactPhone}`} className="flex-center" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--gold)', color: 'white' }}>
                                <Phone size={18} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Divider + Copyright */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                        {settings?.footerText || '© 2026 Furniture. All Rights Reserved.'}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
