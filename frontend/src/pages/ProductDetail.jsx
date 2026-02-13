import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { ArrowLeft, MessageCircle, Star, ShieldCheck, Wind, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const { settings } = useSettings();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImageIdx, setMainImageIdx] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="flex-center flex-column" style={{ height: '60vh', gap: '1.5rem' }}>
            <div className="loader"></div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', color: 'var(--gold)' }}>Loading...</span>
        </div>
    );

    if (!product) return (
        <div className="flex-center flex-column" style={{ height: '60vh', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Product Not Found</h1>
            <Link to="/products" className="btn-luxury gold-gradient text-white" style={{ padding: '0.8rem 2rem', fontSize: '0.7rem' }}>Back to Products</Link>
        </div>
    );

    const whatsappLink = generateWhatsAppLink(settings?.whatsappNumber || '', 'product', product);

    // Auto-calculate discount
    const discountPercent = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div style={{ background: 'var(--crease)', minHeight: '100vh', padding: '3rem 0 6rem', overflowX: 'hidden' }}>
            <div className="container">
                {/* Back Button */}
                <Link to="/products" className="flex" style={{ alignItems: 'center', gap: '0.75rem', opacity: 0.5, marginBottom: '2rem', width: 'fit-content' }}>
                    <ArrowLeft size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em' }}>BACK TO PRODUCTS</span>
                </Link>

                {/* Product Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                    {/* Left: Images */}
                    <div className="flex-column" style={{ gap: '1rem' }}>
                        <div className="stack-visual" style={{ height: '450px', borderRadius: '2rem', position: 'relative' }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={mainImageIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    src={product.images[mainImageIdx]?.url}
                                    style={{ height: '100%' }}
                                    alt={product.name}
                                />
                            </AnimatePresence>

                            {/* Discount Badge */}
                            {discountPercent > 0 && (
                                <div className="flex-center" style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 900, background: '#ef4444', color: 'white', gap: '0.3rem', zIndex: 5 }}>
                                    <Tag size={12} />
                                    <span>{discountPercent}% OFF</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="thumb-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(product.images.length, 4)}, 1fr)`, gap: '0.75rem' }}>
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setMainImageIdx(idx)}
                                        style={{
                                            height: '80px',
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: mainImageIdx === idx ? '2px solid var(--gold)' : '2px solid transparent',
                                            transition: 'all 0.3s ease',
                                            opacity: mainImageIdx === idx ? 1 : 0.6
                                        }}
                                    >
                                        <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex-column" style={{ gap: '1.5rem' }}>
                        <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.2em' }}>{product.category?.toUpperCase()}</span>
                            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginTop: '0.5rem', lineHeight: 1.1 }}>{product.name}</h1>
                        </div>

                        <div className="flex" style={{ alignItems: 'baseline', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 900 }}>₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--stone)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                            )}
                            {discountPercent > 0 && (
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#22c55e' }}>Save {discountPercent}%</span>
                            )}
                        </div>

                        {product.featured && (
                            <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                                <Star size={14} fill="var(--gold)" color="var(--gold)" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)' }}>FEATURED PRODUCT</span>
                            </div>
                        )}

                        <p style={{ fontSize: '0.95rem', color: 'var(--stone)', lineHeight: 1.8 }}>
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock > 0 ? '#22c55e' : '#ef4444' }}></div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: product.stock > 0 ? '#22c55e' : '#ef4444' }}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* CTA */}
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-luxury gold-gradient text-white flex-center"
                            style={{ padding: '1rem 2.5rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 900, gap: '0.75rem', width: 'fit-content' }}
                        >
                            <MessageCircle size={18} />
                            <span>ASK ON WHATSAPP</span>
                        </a>

                        <div className="flex" style={{ gap: '0.75rem', opacity: 0.4, alignItems: 'center' }}>
                            <Clock size={14} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>We usually reply in 15 minutes</span>
                        </div>

                        {/* Trust Badges */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div className="glass-card flex-column" style={{ padding: '1.5rem', gap: '0.75rem', alignItems: 'center', textAlign: 'center', borderRadius: '1.25rem' }}>
                                <ShieldCheck size={24} color="var(--gold)" />
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Quality Guaranteed</h4>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--stone)' }}>{settings?.productWarrantyNote || 'Strong and durable furniture'}</p>
                                </div>
                            </div>
                            <div className="glass-card flex-column" style={{ padding: '1.5rem', gap: '0.75rem', alignItems: 'center', textAlign: 'center', borderRadius: '1.25rem' }}>
                                <Wind size={24} color="var(--gold)" />
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Safe Delivery</h4>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--stone)' }}>{settings?.productDeliveryNote || 'Careful delivery to your door'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .loader { width: 3rem; height: 3rem; border: 3px solid rgba(212, 175, 55, 0.1); border-top-color: var(--gold); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .container > div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}} />
        </div>
    );
};

export default ProductDetail;
