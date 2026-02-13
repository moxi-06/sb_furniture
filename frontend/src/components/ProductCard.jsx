import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowUpRight, Star, Tag } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product, index }) => {
    const { settings } = useSettings();
    const navigate = useNavigate();
    const whatsappLink = generateWhatsAppLink(settings?.whatsappNumber || '', 'product', product);

    // Auto-calculate discount percentage
    const discountPercent = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleCardClick = () => {
        navigate(`/product/${product._id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            viewport={{ once: true }}
            onClick={handleCardClick}
            className="glass-card"
            style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                height: '100%',
                position: 'relative',
                borderRadius: '1.5rem',
                cursor: 'pointer'
            }}
        >
            {/* Image */}
            <div style={{ height: settings?.productCardHeight || '260px', borderRadius: '1.25rem', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={product.images[0]?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400'}
                    alt={product.name}
                    className="product-card-hover-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                />

                {/* Badges */}
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                    {product.featured && (
                        <div className="glass-dark flex-center" style={{ padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.6rem', fontWeight: 800, gap: '0.35rem' }}>
                            <Star size={10} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
                            <span>FEATURED</span>
                        </div>
                    )}
                    {discountPercent > 0 && (
                        <div className="flex-center" style={{ padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.6rem', fontWeight: 900, background: '#ef4444', color: 'white', gap: '0.3rem' }}>
                            <Tag size={10} />
                            <span>{discountPercent}% OFF</span>
                        </div>
                    )}
                    {product.offerLabel && !discountPercent && (
                        <div className="flex-center" style={{ padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.6rem', fontWeight: 900, background: 'var(--gold)', color: 'white' }}>
                            <span>{product.offerLabel}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-column" style={{ gap: '0.5rem', padding: '0 0.5rem 0.5rem', flex: 1 }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.15em' }}>{product.category?.toUpperCase()}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--charcoal)', lineHeight: 1.2 }}>{product.name}</h3>

                <div className="flex" style={{ alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--charcoal)' }}>₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--stone)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                    )}
                </div>

                <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.5 }}>
                        {product.description?.slice(0, 60)}{product.description?.length > 60 ? '...' : ''}
                    </p>
                    <div className="flex" style={{ gap: '0.5rem', flexShrink: 0 }}>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-center glass"
                            style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', transition: 'all 0.3s ease' }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'inherit'; }}
                        >
                            <MessageCircle size={14} />
                        </a>
                        <div
                            className="flex-center glass"
                            style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }}
                        >
                            <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .glass-card:hover .product-card-hover-img { transform: scale(1.05); }
            `}} />
        </motion.div>
    );
};

export default ProductCard;
