import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Phone, Mail, MapPin, Clock, MessageSquare, Star, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const { settings } = useSettings();
    const [openFaq, setOpenFaq] = useState(null);

    const contactList = [
        { icon: Phone, label: 'CALL US', value: settings?.contactPhone || '+91 9876543210', href: `tel:${settings?.contactPhone}` },
        { icon: MessageSquare, label: 'WHATSAPP', value: settings?.whatsappNumber || '+91 9876543210', href: `https://wa.me/${settings?.whatsappNumber}` },
        { icon: Mail, label: 'EMAIL', value: settings?.email || 'hello@aura.com', href: `mailto:${settings?.email}` },
    ];

    return (
        <div style={{ background: 'var(--crease)', minHeight: '100vh', padding: '4rem 0 0', overflowX: 'hidden' }}>
            {/* Header */}
            <div className="container" style={{ marginBottom: '3rem' }}>
                <div className="flex-column" style={{ gap: '2rem', maxWidth: '800px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex"
                        style={{ alignItems: 'center', gap: '1.2rem' }}
                    >
                        <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }}></div>
                        <span className="text-gold" style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.4em' }}>REACH OUT</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{ fontSize: 'clamp(1.5rem, 6vw, 3.2rem)', color: 'var(--charcoal)', lineHeight: 1.1, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                        {settings?.contactHeroTitle || 'Contact Us'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: '1.1rem', color: 'var(--stone)', lineHeight: 1.8, fontWeight: 500, letterSpacing: '0.01em' }}
                    >
                        {settings?.contactHeroSubtitle || "Have a question about our furniture? Want to place an order? We're happy to help. Call, WhatsApp, or email us anytime."}
                    </motion.p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '6rem' }}>
                {/* Contact Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {contactList.map((item, idx) => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, boxShadow: 'var(--shadow-luxury)' }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            style={{
                                padding: '2.5rem 2rem',
                                background: 'white',
                                borderRadius: '2.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                textDecoration: 'none',
                                textAlign: 'center',
                                alignItems: 'center',
                                boxShadow: 'var(--shadow-md)',
                                border: '1px solid rgba(0,0,0,0.02)',
                                transition: 'var(--transition-slow)'
                            }}
                        >
                            <div className="flex-center" style={{ width: '4rem', height: '4rem', borderRadius: '1.5rem', background: 'rgba(212,175,55,0.06)', color: 'var(--gold)' }}>
                                <item.icon size={26} strokeWidth={1.5} />
                            </div>
                            <div className="flex-column" style={{ gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '0.2em' }}>{item.label}</span>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--charcoal)' }}>{item.value}</h3>
                            </div>
                            <div className="flex" style={{ gap: '0.5rem', alignItems: 'center', opacity: 0.4 }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Tap to connect</span>
                                <ExternalLink size={14} />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* FAQ Section */}
                {(settings?.faqs?.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: '6rem' }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <span className="text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.4em' }}>LEARN MORE</span>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginTop: '0.75rem', fontWeight: 900 }}>Common Questions</h2>
                        </div>
                        <div className="flex-column" style={{ gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                            {settings.faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="glass-card"
                                    style={{ background: 'white', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        style={{ width: '100%', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                    >
                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--charcoal)' }}>{faq.question}</span>
                                        {openFaq === idx ? <ChevronUp size={20} color="var(--gold)" /> : <ChevronDown size={20} color="var(--stone)" />}
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div style={{ padding: '0 2rem 2rem', fontSize: '0.95rem', color: 'var(--stone)', lineHeight: 1.6, fontWeight: 500 }}>
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Address + Hours */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {settings?.mapLink ? (
                        <a
                            href={settings.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-card flex-column"
                            style={{ padding: '2rem', gap: '1rem', textAlign: 'center', alignItems: 'center', borderRadius: '1.5rem', background: 'white', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                        >
                            <MapPin size={24} color="var(--gold)" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Our Store</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--stone)', lineHeight: 1.6 }}>
                                {settings?.address || "123 Furniture Market, New Delhi, India"}
                            </p>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)', marginTop: '0.5rem' }}>View on Google Maps →</span>
                        </a>
                    ) : (
                        <div className="glass-card flex-column" style={{ padding: '2rem', gap: '1rem', textAlign: 'center', alignItems: 'center', borderRadius: '1.5rem', background: 'white' }}>
                            <MapPin size={24} color="var(--gold)" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Our Store</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--stone)', lineHeight: 1.6 }}>
                                {settings?.address || "123 Furniture Market, New Delhi, India"}
                            </p>
                        </div>
                    )}
                    <div className="glass-card flex-column" style={{ padding: '2rem', gap: '1rem', textAlign: 'center', alignItems: 'center', borderRadius: '1.5rem', background: 'white' }}>
                        <Clock size={24} color="var(--gold)" />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Store Timings</h3>
                        <div className="flex-column" style={{ gap: '0.25rem' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Monday – Saturday: {settings?.contactTimingsMonSat || '10 AM – 8 PM'}</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sunday: {settings?.contactTimingsSun || '11 AM – 5 PM'}</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '3rem', borderRadius: '2rem', background: 'var(--charcoal)', color: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
                >
                    <Star size={28} fill="var(--gold)" color="var(--gold)" />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{settings?.contactHelpTitle || 'Need Help Choosing?'}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '500px' }}>
                        {settings?.contactHelpText || "Not sure which furniture is right for your home? Message us on WhatsApp for free consultation."}
                    </p>
                    <a
                        href={`https://wa.me/${settings?.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-luxury gold-gradient text-white"
                        style={{ padding: '1rem 2.5rem', fontSize: '0.75rem', textDecoration: 'none', borderRadius: '1.25rem' }}
                    >
                        MESSAGE US ON WHATSAPP
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
