import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, Tag, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const defaultForm = {
        name: '', price: '', originalPrice: '', description: '',
        category: 'General', stock: '', featured: false, images: []
    };
    const [formData, setFormData] = useState(defaultForm);

    const categories = ['General', 'Sofa', 'Beds', 'Dining', 'Office', 'Decor'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await API.get('/products');
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const openAdd = () => {
        setFormData(defaultForm);
        setEditProduct(null);
        setError('');
        setShowModal(true);
    };

    const openEdit = (p) => {
        setFormData({
            name: p.name, price: p.price, originalPrice: p.originalPrice || '',
            description: p.description || '', category: p.category || 'General',
            stock: p.stock || '', featured: p.featured || false, images: []
        });
        setEditProduct(p);
        setError('');
        setShowModal(true);
    };

    const removeExistingImage = async (index) => {
        if (!editProduct) return;
        if (!confirm('Delete this image from Cloudinary?')) return;
        try {
            await API.delete(`/products/${editProduct._id}/images`, { data: { imageIndex: index } });
            fetchProducts();
            setEditProduct(null);
            setShowModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) { setError('Product name is required'); return; }
        if (!formData.price || formData.price <= 0) { setError('Please enter a valid price'); return; }

        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('description', formData.description || '');
            data.append('category', formData.category || 'General');
            data.append('stock', formData.stock || 0);
            data.append('featured', formData.featured ? 'true' : 'false');

            // Only send originalPrice if it has a value
            if (formData.originalPrice && Number(formData.originalPrice) > 0) {
                data.append('originalPrice', formData.originalPrice);
            }

            formData.images.forEach(file => data.append('images', file));

            if (editProduct) {
                data.append('existingImages', JSON.stringify(editProduct.images));
                await API.put(`/products/${editProduct._id}`, data);
            } else {
                await API.post('/products', data);
            }

            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await API.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const calcDiscount = (original, display) => {
        if (!original || !display || original <= display) return 0;
        return Math.round(((original - display) / original) * 100);
    };

    const filteredProducts = products.filter(p => {
        const name = p.name || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const formDiscount = calcDiscount(Number(formData.originalPrice), Number(formData.price));

    const inputStyle = {
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(0,0,0,0.08)',
        fontSize: '0.85rem',
        fontWeight: 500,
        outline: 'none',
        width: '100%',
        background: 'var(--crease)',
        transition: 'border-color 0.3s ease'
    };

    const labelStyle = { fontSize: '0.7rem', fontWeight: 800, color: 'var(--stone)', letterSpacing: '0.1em' };

    return (
        <div className="flex-column" style={{ gap: '2rem' }}>
            {/* Header */}
            <div className="flex-between" style={{ alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Products</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--stone)' }}>
                        {searchTerm || filterCategory !== 'All'
                            ? `${filteredProducts.length} result(s) found`
                            : `${products.length} items in catalog`}
                    </p>
                </div>
                <button onClick={openAdd} className="admin-btn admin-btn-primary flex-center" style={{ gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontSize: '0.8rem' }}>
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex-column" style={{ gap: '1rem' }}>
                <div className="flex-between" style={{ alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ ...inputStyle, paddingLeft: '2.8rem', background: 'white', borderRadius: '1rem' }}
                        />
                    </div>
                </div>

                <div className="flex" style={{ gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {['All', ...categories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                background: filterCategory === cat ? 'var(--charcoal)' : 'white',
                                color: filterCategory === cat ? 'white' : 'var(--stone)',
                                border: '1px solid ' + (filterCategory === cat ? 'var(--charcoal)' : 'rgba(0,0,0,0.05)'),
                                cursor: 'pointer'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {filteredProducts.map(p => {
                    const disc = calcDiscount(p.originalPrice, p.price);
                    return (
                        <div key={p._id} className="glass-card" style={{ padding: '1rem', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {/* Image */}
                            <div style={{ height: '180px', borderRadius: '1rem', overflow: 'hidden', position: 'relative', background: 'var(--crease)' }}>
                                {p.images[0] ? (
                                    <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div className="flex-center" style={{ height: '100%', color: 'var(--stone)', opacity: 0.3 }}>
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                {disc > 0 && (
                                    <div className="flex-center" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#ef4444', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '1rem', fontSize: '0.6rem', fontWeight: 900, gap: '0.25rem' }}>
                                        <Tag size={10} /> {disc}% OFF
                                    </div>
                                )}
                                {p.featured && (
                                    <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'var(--gold)', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '1rem', fontSize: '0.6rem', fontWeight: 900 }}>
                                        Featured
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-column" style={{ gap: '0.25rem', padding: '0 0.25rem' }}>
                                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.1em' }}>{p.category?.toUpperCase()}</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.2 }}>{p.name}</h3>
                                <div className="flex" style={{ alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>₹{p.price.toLocaleString()}</span>
                                    {p.originalPrice && p.originalPrice > p.price && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--stone)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex" style={{ gap: '0.5rem', marginTop: 'auto' }}>
                                <button onClick={() => openEdit(p)} className="admin-btn flex-center" style={{ flex: 1, gap: '0.35rem', padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.7rem' }}>
                                    <Edit size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(p._id)} className="admin-btn flex-center" style={{ padding: '0.5rem 0.75rem', borderRadius: '0.75rem', color: '#ef4444' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '550px', maxHeight: '85vh', overflow: 'auto', padding: '2rem', borderRadius: '1.5rem', background: 'white' }}
                        >
                            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={() => setShowModal(false)} className="flex-center" style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--crease)' }}>
                                    <X size={14} />
                                </button>
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex-column" style={{ gap: '1.25rem' }}>
                                {/* Required: Name */}
                                <div className="flex-column" style={{ gap: '0.4rem' }}>
                                    <label style={labelStyle}>PRODUCT NAME *</label>
                                    <input style={inputStyle} type="text" placeholder="e.g. Oslo Sofa Set" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>

                                <div className="flex-column" style={{ gap: '1.25rem' }}>
                                    <div className="flex-column" style={{ gap: '0.4rem' }}>
                                        <label style={labelStyle}>SELLING PRICE *</label>
                                        <input style={inputStyle} type="number" placeholder="₹ 25,000" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div className="flex-column" style={{ gap: '0.4rem' }}>
                                        <label style={labelStyle}>ORIGINAL PRICE (optional)</label>
                                        <input style={inputStyle} type="number" placeholder="₹ 35,000" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} />
                                    </div>
                                </div>

                                {/* Auto-discount preview */}
                                {formDiscount > 0 && (
                                    <div className="flex" style={{ alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '0.75rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                                        <Tag size={14} color="#22c55e" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e' }}>{formDiscount}% discount will be shown automatically</span>
                                    </div>
                                )}

                                {/* Optional Fields Section */}
                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--stone)', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'block' }}>OPTIONAL DETAILS</span>

                                    <div className="flex-column" style={{ gap: '1rem' }}>
                                        <div className="flex-column" style={{ gap: '1.25rem' }}>
                                            <div className="flex-column" style={{ gap: '0.4rem' }}>
                                                <label style={labelStyle}>CATEGORY</label>
                                                <select style={{ ...inputStyle, cursor: 'pointer' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="flex-column" style={{ gap: '0.4rem' }}>
                                                <label style={labelStyle}>STOCK</label>
                                                <input style={inputStyle} type="number" placeholder="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="flex-column" style={{ gap: '0.4rem' }}>
                                            <label style={labelStyle}>DESCRIPTION</label>
                                            <textarea style={{ ...inputStyle, resize: 'none', minHeight: '80px' }} placeholder="Describe the product..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>

                                        <label className="flex" style={{ alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} style={{ width: '1rem', height: '1rem', accentColor: 'var(--gold)' }} />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mark as Featured</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="flex-column" style={{ gap: '0.5rem' }}>
                                    <label style={labelStyle}>PRODUCT IMAGES</label>
                                    {editProduct && editProduct.images && editProduct.images.length > 0 && (
                                        <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                            {editProduct.images.map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(idx)}
                                                        style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <label className="flex-center flex-column" style={{ padding: '1.5rem', borderRadius: '1rem', border: '2px dashed rgba(0,0,0,0.1)', cursor: 'pointer', gap: '0.5rem', background: 'var(--crease)' }}>
                                        <ImageIcon size={24} style={{ opacity: 0.3 }} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--stone)' }}>
                                            {formData.images.length > 0 ? `${formData.images.length} new image(s) selected` : 'Click to upload images'}
                                        </span>
                                        <input type="file" multiple accept="image/*" onChange={e => setFormData({ ...formData, images: [...e.target.files] })} style={{ display: 'none' }} />
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-btn admin-btn-primary flex-center"
                                    style={{ padding: '0.9rem', borderRadius: '1rem', fontSize: '0.85rem', gap: '0.5rem', fontWeight: 800, width: '100%' }}
                                >
                                    <Save size={16} />
                                    {loading ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
