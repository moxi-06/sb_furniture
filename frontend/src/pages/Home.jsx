import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import API from '../services/api';
import { ArrowRight, Shield, Truck, HeartHandshake, CheckCircle, Star, Quote, Paintbrush, Layers, Maximize, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
    const { settings } = useSettings();
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);

    const iconMap = { Shield, Truck, HeartHandshake, CheckCircle };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const allRes = await API.get('/products');
                const catCounts = {};
                allRes.data.forEach(p => {
                    const cat = p.category || 'General';
                    catCounts[cat] = (catCounts[cat] || 0) + 1;
                });

                const categoryImages = {
                    'Sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
                    'Beds': 'https://images.unsplash.com/photo-1505693419148-db19f4d71aa4?auto=format&fit=crop&q=80&w=800',
                    'Dining': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
                    'Decor': 'https://images.unsplash.com/photo-1513519247340-0255c26b23d9?auto=format&fit=crop&q=80&w=800',
                    'Office': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
                    'General': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800',
                };

                const dynamicCats = Object.keys(catCounts).map(name => ({
                    id: name,
                    name,
                    count: catCounts[name],
                    img: categoryImages[name] || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800'
                }));
                setCategories(dynamicCats);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            if (location.pathname === '/') {
                const sections = ['hero', 'quality', 'customization', 'categories', 'customers', 'testimonials'];
                const scrollPosition = window.scrollY + 85;
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
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = el.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }, [location.hash]);

    return (
        <div style={{ background: 'var(--crease)', overflowX: 'hidden' }}>
            {/* Hero Section */}
            <section id="hero" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
                <motion.div style={{ y: y1, position: 'absolute', inset: 0, zIndex: 0 }}>
                    <img
                        src={settings?.heroImage?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920'}
                        style={{ width: '100%', height: '120%', objectFit: 'cover' }}
                        alt="Hero"
                        fetchpriority="high"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))' }} />
                </motion.div>

                <div className="container flex-center" style={{ height: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{
                            maxWidth: '900px',
                            width: '95%',
                            padding: '2rem'
                        }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1.05,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textShadow: '0 10px 40px rgba(0,0,0,0.4)'
                        }}>
                            {settings?.heroTitle || 'Curating Comfort for Your Home'}
                        </h1>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            color: 'rgba(255,255,255,0.95)',
                            margin: '2.5rem auto 3.5rem',
                            fontWeight: 500,
                            lineHeight: 1.6,
                            maxWidth: '700px',
                            letterSpacing: '0.02em',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                            {settings?.heroSubtitle || 'Experience the blend of artisanal craftsmanship and modern design.'}
                        </p>
                        <div className="flex" style={{ justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <Link to="/products" className="btn-luxury gold-gradient text-white" style={{ padding: '1.4rem 3.5rem', borderRadius: '1.5rem', fontSize: '0.85rem' }}>
                                EXPLORE COLLECTION
                            </Link>
                            <a href="#customization" className="btn-luxury glass text-white" style={{ padding: '1.4rem 3.5rem', borderRadius: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                                CUSTOM DESIGN
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* King of Customization Section */}
            {(settings?.showCustomizationSection !== false) && (
                <section id="customization" className="section-padding" style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: isMobile ? `url(${settings?.customizationImage?.url || 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1000'})` : '#fff',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: isMobile ? '100dvh' : 'calc(100vh - 80px)',
                    maxHeight: isMobile ? 'none' : '1000px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: isMobile ? '6rem 0' : '4rem 0'
                }}>
                    {/* Blueprint/Tech Drawing Background Pattern */}
                    {!isMobile ? (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.03,
                            pointerEvents: 'none',
                            zIndex: 0,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg zIndex='0' stroke='%23000' stroke-width='0.5'%3E%3Cpath d='M30 0v60M0 30h60'/%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Cpath d='M15 15l30 30M45 15L15 45'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '120px 120px'
                        }}></div>
                    ) : (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 0 }}></div>
                    )}

                    {!isMobile && (
                        <>
                            <div style={{ position: 'absolute', top: '0', right: '0', width: '50%', height: '100%', background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)', zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(18,18,18,0.03) 0%, transparent 70%)', zIndex: 0 }}></div>
                        </>
                    )}

                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: isMobile ? '3rem' : 'clamp(2rem, 5vw, 5rem)',
                            alignItems: 'center',
                            textAlign: isMobile ? 'center' : 'left'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div style={{ marginBottom: '3rem' }}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="flex"
                                        style={{ justifyContent: isMobile ? 'center' : 'flex-start', alignItems: 'center', gap: '1.2rem', marginBottom: '1.2rem' }}
                                    >
                                        <div style={{ width: '50px', height: '1.5px', background: 'var(--gold)' }}></div>
                                        <span className="text-gold" style={{ fontSize: '0.8rem', letterSpacing: '0.6em', fontWeight: 900 }}>BESPOKE CRAFTSMANSHIP</span>
                                    </motion.div>
                                    <h2 style={{
                                        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                                        lineHeight: 1.05,
                                        fontWeight: 900,
                                        color: isMobile ? 'white' : 'var(--charcoal)',
                                        marginBottom: '1.8rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {settings?.customizationTitle || 'The King of Customization'}
                                    </h2>
                                    <p style={{
                                        fontSize: '1.1rem',
                                        color: isMobile ? 'rgba(255,255,255,0.8)' : 'var(--stone)',
                                        lineHeight: 1.8,
                                        fontWeight: 500,
                                        maxWidth: isMobile ? '100%' : '550px',
                                        marginLeft: isMobile ? 'auto' : '0',
                                        marginRight: isMobile ? 'auto' : '0',
                                        letterSpacing: '0.01em'
                                    }}>
                                        {settings?.customizationSubtitle || 'Your vision, our mastery. Every curve, fabric, and finish tailored to your unique lifestyle.'}
                                    </p>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 220px)',
                                    gap: '1.5rem',
                                    marginBottom: '4rem'
                                }}>
                                    {[
                                        { icon: Paintbrush, label: 'Custom Palette', y: 0 },
                                        { icon: Layers, label: 'Premium Fabrics', y: 30 },
                                        { icon: Maximize, label: 'Perfect Fit', y: -20 },
                                        { icon: Sparkles, label: 'Concept Design', y: 10 }
                                    ].map((opt, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: isMobile ? 0 : opt.y }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            whileHover={{ y: (isMobile ? 0 : opt.y) - 10, transition: { duration: 0.3 } }}
                                            style={{
                                                padding: '2.5rem 1.5rem',
                                                borderRadius: '2rem',
                                                background: isMobile ? 'rgba(255,255,255,0.08)' : 'white',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(0,0,0,0.03)',
                                                boxShadow: 'var(--shadow-md)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '1.2rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1.25rem', background: 'rgba(212,175,55,0.06)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <opt.icon size={22} strokeWidth={1.2} />
                                            </div>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: isMobile ? 'white' : 'var(--charcoal)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center' }}>{opt.label}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                                    <motion.a
                                        href={`https://wa.me/${settings?.whatsappNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-luxury gold-gradient text-white"
                                        style={{
                                            padding: '1.4rem 3.5rem',
                                            fontSize: '0.8rem',
                                            fontWeight: 900,
                                            borderRadius: '1.5rem',
                                            boxShadow: '0 15px 30px rgba(212,175,55,0.3)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '50%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                transform: 'skewX(-20deg)',
                                                zIndex: 1
                                            }}
                                        />
                                        <span style={{ position: 'relative', zIndex: 2 }}>CONSULT WITH DESIGNER</span>
                                    </motion.a>
                                </div>
                            </motion.div>

                            {!isMobile && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1 }}
                                    style={{ position: 'relative' }}
                                >
                                    <motion.div
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                                        style={{
                                            position: 'relative',
                                            borderRadius: '4rem',
                                            overflow: 'hidden',
                                            boxShadow: 'var(--shadow-luxury)',
                                            zIndex: 2,
                                            border: '10px solid white'
                                        }}
                                    >
                                        <img
                                            src={settings?.customizationImage?.url || 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1000'}
                                            alt="Customization"
                                            style={{ width: '100%', height: '75vh', minHeight: '600px', maxHeight: '850px', objectFit: 'cover' }}
                                        />

                                        {/* Material Badges */}
                                        {!isMobile && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1 }}
                                                    style={{ position: 'absolute', top: '20%', left: '10%', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(212,175,55,0.2)' }}
                                                >
                                                    SEASONED TEAK
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 1.3 }}
                                                    style={{ position: 'absolute', bottom: '30%', right: '15%', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(212,175,55,0.2)' }}
                                                >
                                                    PREMIUM VELVET
                                                </motion.div>
                                            </>
                                        )}
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Customers Section */}
            <section id="customers" style={{ background: 'var(--crease)', padding: '8rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span className="text-gold" style={{ fontSize: '0.8rem', letterSpacing: '0.4em', fontWeight: 900 }}>PARTNERSHIPS</span>
                        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 900, marginTop: '1.2rem', color: 'var(--charcoal)', textTransform: 'uppercase' }}>Trusted By Institutions</h2>
                        <div style={{ width: '60px', height: '3px', background: 'var(--gold)', margin: '1.5rem auto' }}></div>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.8rem',
                        alignItems: 'stretch'
                    }}>
                        {(settings?.customers?.length > 0 ? settings.customers : [
                            { name: 'Saveetha University (SIMATS)' },
                            { name: 'Nathella Sampath Chetti School' },
                            { name: 'Gateway International Schools' },
                            { name: 'Rukmani Vidhiyalaya School' },
                            { name: 'Silver Sky Builders' }
                        ]).map((c, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -8, background: 'var(--gold)', color: 'white', borderColor: 'var(--gold)', boxShadow: 'var(--shadow-luxury)' }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                style={{
                                    padding: '3rem 2rem',
                                    borderRadius: '2.5rem',
                                    background: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: 900,
                                    color: 'var(--charcoal)',
                                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    boxShadow: 'var(--shadow-sm)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}
                            >
                                {c.name}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Section */}
            <section id="quality" style={{ background: 'white', padding: '8rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span className="text-gold" style={{ fontSize: '0.8rem', letterSpacing: '0.4em', fontWeight: 900 }}>THE AURA STANDARD</span>
                        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--charcoal)', marginTop: '1.2rem', textTransform: 'uppercase' }}>Uncompromising Quality</h2>
                        <p style={{ color: 'var(--stone)', fontSize: '1.1rem', fontWeight: 500, marginTop: '1.5rem', maxWidth: '650px', margin: '1.5rem auto' }}>
                            We combine traditional craftsmanship with modern innovation to create furniture that lasts for generations.
                        </p>
                        <div style={{ width: '60px', height: '3px', background: 'var(--gold)', margin: '2rem auto' }}></div>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {[
                            { icon: Shield, title: 'Lifetime Warranty', desc: 'Our furniture is built to last. We offer a comprehensive lifetime warranty on structural integrity.' },
                            { icon: Truck, title: 'Safe Delivery', desc: 'Every piece is handled with extreme care and shipped in custom reinforced packaging.' },
                            { icon: HeartHandshake, title: 'Expert Support', desc: 'Our design consultants are available 24/7 to help you curate your perfect space.' },
                            { icon: CheckCircle, title: 'Quality Assurance', desc: 'Each item undergoes a 25-point inspection before leaving our workshop.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -12, boxShadow: 'var(--shadow-luxury)', borderColor: 'var(--gold)' }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                style={{
                                    textAlign: 'center',
                                    padding: '4.5rem 3rem',
                                    borderRadius: '2.5rem',
                                    background: 'var(--crease)',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                    border: '1px solid rgba(0,0,0,0.03)'
                                }}
                            >
                                <div style={{ color: 'var(--gold)', marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '1.5rem', background: 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <feature.icon size={38} strokeWidth={1} />
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.2rem', color: 'var(--charcoal)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--stone)', fontSize: '0.95rem', lineHeight: 1.8, fontWeight: 500 }}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" style={{ background: 'var(--crease)', padding: '8rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span className="text-gold" style={{ fontSize: '0.8rem', letterSpacing: '0.4em', fontWeight: 900 }}>COLLECTIONS</span>
                        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 900, marginTop: '1.2rem', color: 'var(--charcoal)', textTransform: 'uppercase' }}>Explore Curations</h2>
                        <p style={{ color: 'var(--stone)', fontSize: '1.1rem', fontWeight: 500, marginTop: '1.5rem' }}>Find the perfect piece for every room in your home.</p>
                        <div style={{ width: '60px', height: '3px', background: 'var(--gold)', margin: '2rem auto' }}></div>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                style={{
                                    position: 'relative',
                                    borderRadius: '2.5rem',
                                    overflow: 'hidden',
                                    height: '450px',
                                    boxShadow: 'var(--shadow-luxury)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}
                            >
                                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', padding: '3rem' }}>
                                    <div style={{ width: '100%' }}>
                                        <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat.name}</h3>
                                        <Link to={`/products?category=${cat.id}`} className="text-gold" style={{ fontSize: '0.85rem', fontWeight: 900, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '0.2em' }}>
                                            VIEW COLLECTION <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            {(settings?.showTestimonialsSection !== false && settings?.testimonials?.length > 0) && (
                <section id="testimonials" className="section-padding" style={{ background: 'var(--charcoal)', color: 'white' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <span className="text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.4em' }}>REVIEWS</span>
                            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginTop: '0.75rem', fontWeight: 900 }}>Customer Love</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {settings.testimonials.map((t, idx) => (
                                <motion.div
                                    key={idx}
                                    className="glass-card"
                                    whileHover={{ y: -5, borderColor: 'var(--gold)' }}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '2.5rem',
                                        borderRadius: '2rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        border: '1px solid rgba(212,175,55,0.1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Quote size={40} className="text-gold" style={{ opacity: 0.2 }} />
                                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>"{t.content}"</p>
                                    <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                                        <div className="flex-center" style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--gold)', color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>{t.name[0]}</div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{t.name}</h4>
                                            <div className="flex" style={{ gap: '2px', color: 'var(--gold)', marginTop: '0.2rem' }}>
                                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
