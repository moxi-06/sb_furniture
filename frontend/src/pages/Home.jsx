import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Shield, Truck, HeartHandshake, CheckCircle, Star, Quote } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
    const { settings } = useSettings();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);

    const iconMap = { Shield, Truck, HeartHandshake, CheckCircle };

    const defaultQualityFeatures = [
        { title: 'Strong & Durable', subtitle: 'Made with the best wood and materials that last for years.', icon: 'Shield' },
        { title: 'Free Delivery', subtitle: 'We deliver to your doorstep with careful handling.', icon: 'Truck' },
        { title: 'Trusted by 5000+ Families', subtitle: 'Our customers love us. We treat every order with care.', icon: 'HeartHandshake' },
        { title: 'Easy Returns', subtitle: 'Not satisfied? Return within 7 days, no questions asked.', icon: 'CheckCircle' }
    ];

    let qualityFeatures = defaultQualityFeatures;
    try {
        if (settings?.qualityFeatures) {
            qualityFeatures = typeof settings.qualityFeatures === 'string' ? JSON.parse(settings.qualityFeatures) : settings.qualityFeatures;
        }
    } catch (e) {
        qualityFeatures = defaultQualityFeatures;
    }

    // Category images fallback
    const categoryImages = {
        'Sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
        'Beds': 'https://images.unsplash.com/photo-1505693419148-db19f4d71aa4?auto=format&fit=crop&q=80&w=800',
        'Dining': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
        'Decor': 'https://images.unsplash.com/photo-1513519247340-0255c26b23d9?auto=format&fit=crop&q=80&w=800',
        'Office': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800',
        'General': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800',
    };
    const defaultCatImg = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, allRes] = await Promise.all([
                    API.get('/products?featured=true'),
                    API.get('/products')
                ]);
                setFeaturedProducts(featuredRes.data.slice(0, 4));

                // Get only categories that have at least one product
                const catCounts = {};
                allRes.data.forEach(p => {
                    const cat = p.category || 'General';
                    catCounts[cat] = (catCounts[cat] || 0) + 1;
                });
                const dynamicCats = Object.keys(catCounts).map(name => ({
                    name,
                    count: catCounts[name],
                    img: categoryImages[name] || defaultCatImg
                }));
                setCategories(dynamicCats);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ background: 'var(--crease)', overflowX: 'hidden' }}>
            {/* Hero Section */}
            <section style={{ height: '90vh', position: 'relative', overflow: 'hidden' }}>
                <motion.div style={{ y: y1, position: 'absolute', inset: 0, zIndex: 0 }}>
                    <img
                        src={settings?.heroImage?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920'}
                        style={{ width: '100%', height: '120%', objectFit: 'cover' }}
                        alt="Hero"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920'; }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(18,18,18,0.75), rgba(18,18,18,0.2))' }}></div>
                </motion.div>

                <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2 }}
                        style={{ maxWidth: '600px' }}
                    >
                        <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }}></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.3em' }}>{settings?.heroLabel || 'QUALITY FURNITURE'}</span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: 'white', lineHeight: 0.95, fontWeight: 900, marginBottom: '1.5rem' }}>
                            {settings?.heroTitle || 'Beautiful Furniture for Your Home'}
                        </h1>

                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '450px', marginBottom: '2.5rem', fontWeight: 500, lineHeight: 1.7 }}>
                            {settings?.heroSubtitle || 'Find the perfect furniture to make your home comfortable and stylish.'}
                        </p>

                        <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                            <Link to="/products" className="btn-luxury gold-gradient text-white" style={{ padding: '1rem 2.5rem', fontSize: '0.7rem' }}>
                                {settings?.heroBtnText || 'SEE ALL FURNITURE'}
                            </Link>
                            <Link to="/about" className="btn-luxury glass text-white" style={{ padding: '1rem 2.5rem', fontSize: '0.7rem' }}>
                                {settings?.heroBtnText2 || 'ABOUT US'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Products */}
            {(settings?.showFeaturedSection !== false) && (
                <section className="section-padding">
                    <div className="container">
                        <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                            <span className="text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.4em' }}>
                                {settings?.featuredSectionSubtitle || 'TOP SELLING'}
                            </span>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginTop: '0.75rem' }}>
                                {settings?.featuredSectionTitle || 'Our Best Picks'}
                            </h2>
                        </div>

                        {featuredProducts.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {featuredProducts.map((product, idx) => (
                                    <ProductCard key={product._id} product={product} index={idx} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex-center flex-column" style={{ padding: '4rem', gap: '1rem', opacity: 0.4 }}>
                                <p style={{ fontSize: '1rem', color: 'var(--stone)' }}>No featured products yet. Add products from the admin panel.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Why Choose Us */}
            {(settings?.showQualitySection !== false) && (
                <section style={{ background: 'var(--charcoal)', padding: 'var(--space-xl) 0' }}>
                    <div className="container">
                        <div className="flex-column" style={{ gap: '1rem', textAlign: 'center', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                            <span className="text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.3em' }}>
                                {settings?.qualitySectionSubtitle || 'OUR PROMISE'}
                            </span>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white' }}>
                                {settings?.qualitySectionTitle || 'Why Choose Us'}
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {qualityFeatures.map((item, idx) => {
                                const IconComponent = iconMap[item.icon] || Shield;
                                return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 1.5rem' }}
                                >
                                    <div className="flex-center" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.06)', color: 'var(--gold)' }}>
                                        <IconComponent size={22} />
                                    </div>
                                    <h4 style={{ fontSize: '1.1rem', color: 'white', fontWeight: 800 }}>{item.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.subtitle}</p>
                                </motion.div>
                            )})}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            {(settings?.showCategoriesSection !== false && categories.length > 0) && (
                <section className="section-padding">
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                            <span className="text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.4em' }}>
                                {settings?.categorySectionSubtitle || 'CATEGORIES'}
                            </span>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginTop: '0.75rem' }}>
                                {settings?.categorySectionTitle || 'Shop by Type'}
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="cat-item"
                                    style={{ height: '300px', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative' }}
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s ease' }}
                                        onError={(e) => { e.target.src = defaultCatImg; }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,18,18,0.7), transparent 60%)' }}></div>
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', padding: '2rem' }}>
                                        <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>{cat.name}</h3>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 700 }}>{cat.count} {cat.count === 1 ? 'item' : 'items'}</span>
                                        <Link
                                            to={`/products?category=${cat.name}`}
                                            className="btn-luxury"
                                            style={{ background: 'white', color: 'var(--charcoal)', padding: '0.6rem 1.5rem', fontSize: '0.65rem', textDecoration: 'none', borderRadius: '1rem' }}
                                        >
                                            VIEW ALL
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials Section */}
            {(settings?.showTestimonialsSection !== false && settings?.testimonials?.length > 0) && (
                <section className="section-padding" style={{ background: 'var(--charcoal)', color: 'white' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                            <span className="text-gold" style={{ fontSize: '0.75rem', letterSpacing: '0.4em' }}>{settings?.testimonialSectionLabel || 'REVIEWS'}</span>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginTop: '0.75rem' }}>{settings?.testimonialSectionTitle || 'Customer Love'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {settings.testimonials.map((t, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="glass-card"
                                    style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(212,175,55,0.1)' }}
                                >
                                    <Quote size={40} className="text-gold" style={{ opacity: 0.2 }} />
                                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)' }}>
                                        "{t.content}"
                                    </p>
                                    <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                                        <div className="flex-center" style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--gold)', color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>
                                            {t.name[0]}
                                        </div>
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

            <style dangerouslySetInnerHTML={{
                __html: `
                .cat-item:hover img { transform: scale(1.08); }
            `}} />
        </div>
    );
};

export default Home;
