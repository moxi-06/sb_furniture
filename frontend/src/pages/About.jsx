import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Heart } from 'lucide-react';

const About = () => {
    const { settings } = useSettings();

    return (
        <div style={{ background: 'var(--crease)', minHeight: '100vh', padding: '4rem 0 0', overflowX: 'hidden' }}>
            {/* Header */}
            <div className="container" style={{ marginBottom: '4rem' }}>
                <div className="flex-column" style={{ gap: '1.5rem', maxWidth: '700px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex"
                        style={{ alignItems: 'center', gap: '1rem' }}
                    >
                        <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }}></div>
                        <span className="text-gold" style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em' }}>ABOUT US</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--charcoal)', lineHeight: 0.95, fontWeight: 900 }}
                    >
                        {settings?.aboutHeroTitle || 'Our Story.'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1rem', color: 'var(--stone)', lineHeight: 1.8, fontWeight: 500 }}
                    >
                        {settings?.aboutText || 'Premium furniture for modern living spaces. We bring you handpicked, high-quality furniture that makes your home beautiful and comfortable.'}
                    </motion.p>
                </div>
            </div>

            {/* Story Section */}
            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div className="flex-column" style={{ gap: '4rem' }}>
                    {/* Block 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="stack-visual" style={{ height: '350px', marginBottom: '2rem' }}>
                            <img
                                src="https://images.unsplash.com/photo-1544450547-55067a2f0aee?auto=format&fit=crop&q=80&w=1200"
                                style={{ height: '100%' }}
                                alt="Our Workshop"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1200'; }}
                            />
                        </div>
                        <div className="flex-column" style={{ gap: '1rem', textAlign: 'center', alignItems: 'center' }}>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900 }}>{settings?.aboutSection1Title || 'We Pick the Best for You'}</h2>
                            <p style={{ fontSize: '0.95rem', color: 'var(--stone)', lineHeight: 1.8, maxWidth: '600px' }}>
                                {settings?.aboutSection1Text || "We carefully select every piece of furniture we sell. Only items that meet our quality standards make it to our store. Your satisfaction is our top priority."}
                            </p>
                            <div className="flex" style={{ gap: '4rem', marginTop: '1rem' }}>
                                <div className="flex-column" style={{ alignItems: 'center' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{settings?.aboutStat1Number || '15+'}</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', opacity: 0.5 }}>{settings?.aboutStat1Label || 'YEARS'}</span>
                                </div>
                                <div className="flex-column" style={{ alignItems: 'center' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{settings?.aboutStat2Number || '5000+'}</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', opacity: 0.5 }}>{settings?.aboutStat2Label || 'HAPPY HOMES'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Block 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="stack-visual" style={{ height: '350px', marginBottom: '2rem' }}>
                            <img
                                src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?auto=format&fit=crop&q=80&w=1200"
                                style={{ height: '100%' }}
                                alt="Quality Materials"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1200'; }}
                            />
                        </div>
                        <div className="flex-column" style={{ gap: '1rem', textAlign: 'center', alignItems: 'center' }}>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900 }}>{settings?.aboutSection2Title || 'Built to Last'}</h2>
                            <p style={{ fontSize: '0.95rem', color: 'var(--stone)', lineHeight: 1.8, maxWidth: '600px' }}>
                                {settings?.aboutSection2Text || "We use strong, durable materials like seasoned teak wood and high-quality foam. Every piece of furniture is made to be used daily, for years to come."}
                            </p>
                            <div className="flex" style={{ gap: '1rem', marginTop: '1rem' }}>
                                {[ShieldCheck, Award, Heart].map((Icon, idx) => (
                                    <div key={idx} className="glass flex-center" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1.25rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                                        <Icon size={20} color="var(--gold)" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quote */}
            <div style={{ background: 'var(--charcoal)', padding: '5rem 0', overflow: 'hidden' }}>
                <div className="container flex-center">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'white', fontWeight: 900, textAlign: 'center', maxWidth: '800px', lineHeight: 1.3 }}
                    >
                        "{settings?.aboutQuote || 'A beautiful home brings peace to the mind and joy to the heart.'}"
                    </motion.h2>
                </div>
            </div>
        </div>
    );
};

export default About;
