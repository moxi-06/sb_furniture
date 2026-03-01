import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Products = () => {
    const { settings } = useSettings();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [dynamicCategories, setDynamicCategories] = useState(['ALL']);

    const currentCategory = searchParams.get('category') || 'ALL';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Always fetch all products first to build dynamic categories
                const { data: all } = await API.get('/products');
                setAllProducts(all);

                // Build categories list from actual products only
                const cats = [...new Set(all.map(p => p.category).filter(Boolean))];
                setDynamicCategories(['ALL', ...cats]);

                // Filter based on current params
                const category = currentCategory === 'ALL' ? '' : currentCategory;
                const searchQuery = searchParams.get('search') || '';
                const { data } = await API.get(`/products?category=${category}&search=${searchQuery}`);
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams, currentCategory]);

    const handleCategoryChange = (cat) => {
        setSearchParams({ category: cat, search });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ category: currentCategory, search });
    };

    return (
        <div style={{ background: 'var(--crease)', minHeight: '100vh', paddingBottom: '4rem', overflowX: 'hidden' }}>
            {/* Header */}
            <header style={{ padding: '6rem 0 4rem' }}>
                <div className="container flex-column" style={{ gap: '2.5rem', position: 'relative', zIndex: 10 }}>
                    <div className="flex-column" style={{ gap: '2rem', maxWidth: '800px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex"
                            style={{ alignItems: 'center', gap: '1.2rem' }}
                        >
                            <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }}></div>
                            <span className="text-gold" style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.4em' }}>{settings?.productsPageLabel || 'ALL PRODUCTS'}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            style={{ fontSize: 'clamp(1.5rem, 6vw, 3.2rem)', color: 'var(--charcoal)', lineHeight: 1.1, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            {settings?.productsPageTitle || 'Our Furniture'}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ fontSize: '1.1rem', color: 'var(--stone)', lineHeight: 1.8, fontWeight: 500, letterSpacing: '0.01em' }}
                        >
                            {settings?.productsPageDescription || 'Explore our curated collection of premium furniture, designed to elevate your living spaces with style and comfort. Find the perfect pieces to complement your home.'}
                        </motion.p>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        onSubmit={handleSearch}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '3rem',
                            background: 'white',
                            maxWidth: '600px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            boxShadow: 'var(--shadow-md)',
                            border: '1px solid rgba(0,0,0,0.04)'
                        }}
                    >
                        <Search size={22} style={{ opacity: 0.2, color: 'var(--stone)' }} />
                        <input
                            type="text"
                            placeholder={settings?.productsSearchPlaceholder || 'Search furniture...'}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: 500,
                                width: '100%',
                                outline: 'none',
                                color: 'var(--charcoal)',
                                letterSpacing: '0.01em'
                            }}
                        />
                        <button type="submit" className="flex-center gold-gradient" style={{ width: '3rem', height: '3rem', borderRadius: '50%', color: 'white', flexShrink: 0, boxShadow: '0 10px 20px rgba(212,175,55,0.2)' }}>
                            <ArrowRight size={18} />
                        </button>
                    </motion.form>
                </div>
            </header>

            <div className="container">
                {/* Category Tabs — Only categories that have products */}
                <div className="flex-between" style={{ padding: '0 0 2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                        {dynamicCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '2rem',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.3s ease',
                                    background: currentCategory === cat ? 'var(--charcoal)' : 'white',
                                    color: currentCategory === cat ? 'white' : 'var(--stone)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--stone)' }}>
                        {products.length} product{products.length !== 1 ? 's' : ''} found
                    </span>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
                        >
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="glass-card" style={{ height: '380px', animation: 'pulse 2s infinite' }}></div>
                            ))}
                        </motion.div>
                    ) : products.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}
                        >
                            {products.map((product, idx) => (
                                <ProductCard key={product._id} product={product} index={idx} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-center flex-column"
                            style={{ padding: '6rem 0', gap: '1.5rem', textAlign: 'center' }}
                        >
                            <div className="glass flex-center" style={{ width: '5rem', height: '5rem', borderRadius: '50%', color: 'var(--stone)', opacity: 0.3 }}>
                                <Search size={28} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>No products found</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--stone)' }}>{settings?.emptyProductsMessage || 'Try a different search or category.'}</p>
                            <button
                                onClick={() => setSearchParams({})}
                                className="btn-luxury gold-gradient text-white"
                                style={{ padding: '0.8rem 2rem', fontSize: '0.7rem' }}
                            >
                                {settings?.emptyProductsBtnText || 'SHOW ALL'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Products;
