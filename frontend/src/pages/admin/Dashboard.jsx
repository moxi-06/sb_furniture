import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { Package, Star, Eye, TrendingUp, Users, ShoppingBag, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { settings } = useSettings();
    const [stats, setStats] = useState({ total: 0, featured: 0, categories: 0, outOfStock: 0 });
    const [recentProducts, setRecentProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await API.get('/products');
                const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
                const oos = data.filter(p => p.stock === 0).length;

                setStats({
                    total: data.length,
                    featured: data.filter(p => p.featured).length,
                    categories: cats.length,
                    outOfStock: oos
                });
                setRecentProducts(data.slice(0, 5));

                // Fetch low stock based on threshold
                const threshold = settings?.lowStockThreshold || 5;
                const { data: lowStock } = await API.get(`/products/utils/low-stock?threshold=${threshold}`);
                setLowStockProducts(lowStock);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [settings]);

    const statCards = [
        { label: 'TOTAL PRODUCTS', value: stats.total, icon: Package, color: 'var(--charcoal)', bg: 'rgba(0,0,0,0.03)' },
        { label: 'FEATURED', value: stats.featured, icon: Star, color: 'var(--gold)', bg: 'rgba(212,175,55,0.1)' },
        { label: 'CATEGORIES', value: stats.categories, icon: ShoppingBag, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { label: 'OUT OF STOCK', value: stats.outOfStock, icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    ];

    if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}>Loading...</div>;

    return (
        <div className="flex-column" style={{ gap: '2.5rem' }}>
            {/* Header */}
            <div className="flex-between" style={{ alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-0.02em' }}>Dashboard</h2>
                    <p style={{ fontSize: '1rem', color: 'var(--stone)', fontWeight: 500 }}>Live overview of your furniture empire.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--stone)', letterSpacing: '0.1em' }}>LOW STOCK THRESHOLD</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--gold)' }}>{settings?.lowStockThreshold || 5} UNITS</p>
                </div>
            </div>

            {/* Low Stock Alerts */}
            <AnimatePresence>
                {lowStockProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card"
                        style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '1.5rem', borderRadius: '1.5rem' }}
                    >
                        <div className="flex" style={{ gap: '1rem', alignItems: 'flex-start' }}>
                            <div className="flex-center" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: '#ef4444', color: 'white' }}>
                                <AlertCircle size={20} />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#9f1239', marginBottom: '0.25rem' }}>Critical Inventory Alerts</h4>
                                <p style={{ fontSize: '0.85rem', color: '#be123c', fontWeight: 500, marginBottom: '1rem' }}>
                                    {lowStockProducts.length} items are running low or out of stock.
                                </p>
                                <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {lowStockProducts.slice(0, 3).map(p => (
                                        <div key={p._id} style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #fda4af' }}>
                                            {p.name} ({p.stock} left)
                                        </div>
                                    ))}
                                    {lowStockProducts.length > 3 && (
                                        <Link to="/admin/products" style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.25rem', paddingLeft: '0.5rem' }}>
                                            + {lowStockProducts.length - 3} MORE <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {statCards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card"
                        style={{ padding: '2rem', borderRadius: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'white', border: '1px solid rgba(0,0,0,0.03)' }}
                    >
                        <div className="flex-center" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1.25rem', background: card.bg, color: card.color }}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--stone)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>{card.label}</p>
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-0.02em', lineHeight: 1 }}>{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Recent Products */}
                <div className="glass-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'white', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <div className="flex-between" style={{ marginBottom: '2rem', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Recent Inventory</h3>
                        <Link to="/admin/products" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold)', textDecoration: 'none' }}>VEW ALL →</Link>
                    </div>
                    <div className="flex-column" style={{ gap: '1rem' }}>
                        {recentProducts.map(p => (
                            <div key={p._id} className="flex-between" style={{ padding: '1rem', background: 'var(--crease)', borderRadius: '1.25rem' }}>
                                <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', overflow: 'hidden', background: '#eee', border: '1px solid rgba(0,0,0,0.05)' }}>
                                        {p.images[0] && <img src={p.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{p.name}</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--stone)', fontWeight: 600 }}>{p.category}</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: '1rem', fontWeight: 900 }}>₹{p.price?.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth & Actions */}
                <div className="flex-column" style={{ gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'var(--charcoal)', color: 'white' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Store Identity</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Your store is currently visible to the world.</p>
                        <div className="flex-column" style={{ gap: '0.75rem' }}>
                            <Link to="/admin/settings" className="flex-between" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.05)', textDecoration: 'none', color: 'white' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>System Health</span>
                                <Activity size={18} color="var(--gold)" />
                            </Link>
                            <Link to="/admin/settings" className="flex-between" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.05)', textDecoration: 'none', color: 'white' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>SEO & Growth</span>
                                <Globe size={18} color="var(--gold)" />
                            </Link>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'white', border: '1px solid rgba(0,0,0,0.03)', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                        <Link to="/admin/products" className="admin-btn" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'var(--gold)', color: 'white', textAlign: 'center', fontWeight: 900, textDecoration: 'none', boxShadow: '0 15px 30px rgba(212,175,55,0.2)' }}>
                            + ADD NEW FURNITURE
                        </Link>
                        <a href="/" target="_blank" className="admin-btn" style={{ padding: '1.25rem', borderRadius: '1.25rem', background: 'white', color: 'var(--charcoal)', textAlign: 'center', fontWeight: 900, textDecoration: 'none', border: '1px solid rgba(0,0,0,0.1)' }}>
                            VIEW LIVE WEBSITE
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Activity/Globe icons if not imported from lucide
const Activity = ({ size, color }) => <TrendingUp size={size} color={color} />;
const Globe = ({ size, color }) => <Users size={size} color={color} />;

export default AdminDashboard;
