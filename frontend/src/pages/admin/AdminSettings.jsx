import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import API from '../../services/api';
import {
    Save,
    Image as ImageIcon,
    Phone,
    Palette,
    Layout,
    Shield,
    ShoppingBag,
    Info,
    Megaphone,
    Boxes,
    HelpCircle,
    Code,
    Activity,
    Plus,
    Trash2,
    AlertTriangle,
    Globe,
    Zap,
    TrendingUp,
    Star,
    Loader2,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettings = () => {
    const { settings, fetchSettings } = useSettings();
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('brand');
    const [bulkData, setBulkData] = useState({ category: 'All Products', action: 'Increase', value: '' });
    const [bulkLoading, setBulkLoading] = useState(false);
    const [accFormData, setAccFormData] = useState({ email: '', newPassword: '' });
    const [accLoading, setAccLoading] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({ ...settings });
            setAccFormData(prev => ({ ...prev, email: settings.email || '' }));
        }
    }, [settings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();

        // Remove internal fields and handled image objects
        const { _id, __v, logo, heroImage, promoPopupImage, favicon, ...rest } = formData;

        Object.keys(rest).forEach(key => {
            if (typeof rest[key] === 'object' && rest[key] !== null) {
                data.append(key, JSON.stringify(rest[key]));
            } else {
                data.append(key, rest[key] === undefined ? '' : rest[key]);
            }
        });

        // Append files
        Object.keys(files).forEach(key => {
            if (files[key]) data.append(key, files[key]);
        });

        try {
            await API.put('/settings', data);
            setMessage('Saved successfully!');
            fetchSettings();
            setTimeout(() => setMessage(''), 3000);
            setFiles({}); // Clear selected files
        } catch (err) {
            console.error(err);
            setMessage('Error saving settings');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, key) => {
        setFiles({ ...files, [key]: e.target.files[0] });
    };

    const deleteImage = async (field) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await API.delete(`/settings/image/${field}`);
            fetchSettings();
            setMessage('Image deleted');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Error deleting image');
        }
    };

    const clearFile = (key) => {
        const newFiles = { ...files };
        delete newFiles[key];
        setFiles(newFiles);
    };

    const addItem = (key, defaultObj) => {
        const current = formData[key] || [];
        setFormData({ ...formData, [key]: [...current, defaultObj] });
    };

    const removeItem = (key, index) => {
        const current = [...(formData[key] || [])];
        current.splice(index, 1);
        setFormData({ ...formData, [key]: current });
    };

    const updateItem = (key, index, field, value) => {
        const current = [...(formData[key] || [])];
        current[index][field] = value;
        setFormData({ ...formData, [key]: current });
    };

    const handleAccSubmit = async (e) => {
        e.preventDefault();
        setAccLoading(true);
        try {
            const { email, newPassword } = accFormData;
            const res = await API.put('/auth/account', { email, newPassword });
            setMessage(res.data.message);
            setTimeout(() => setMessage(''), 5000);
            setAccFormData({ ...accFormData, newPassword: '' });
            fetchSettings();
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Error updating account');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setAccLoading(false);
        }
    };

    const handleBulkUpdate = async () => {
        if (!bulkData.value) return alert('Enter a percentage value');
        if (!window.confirm(`Are you sure you want to ${bulkData.action.toLowerCase()} prices for ${bulkData.category} by ${bulkData.value}%?`)) return;

        setBulkLoading(true);
        try {
            const res = await API.post('/products/utils/bulk-price', {
                category: bulkData.category,
                action: bulkData.action,
                value: parseFloat(bulkData.value)
            });
            setMessage(res.data.message);
            setTimeout(() => setMessage(''), 5000);
            setBulkData({ ...bulkData, value: '' });
        } catch (err) {
            console.error(err);
            setMessage('Error in bulk update');
        } finally {
            setBulkLoading(false);
        }
    };

    const inputStyle = {
        padding: '0.9rem 1.25rem',
        borderRadius: '1rem',
        border: '1px solid rgba(0,0,0,0.08)',
        fontSize: '0.9rem',
        fontWeight: 500,
        outline: 'none',
        width: '100%',
        background: 'white',
        transition: 'all 0.3s ease'
    };

    const labelStyle = {
        fontSize: '0.7rem',
        fontWeight: 800,
        color: 'var(--stone)',
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
        display: 'block',
        textTransform: 'uppercase'
    };

    const fieldRowStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        width: '100%',
        padding: '0.5rem 0'
    };

    const tabs = [
        { id: 'brand', name: 'Identity', icon: Palette },
        { id: 'home', name: 'Sections', icon: Layout },
        { id: 'marketing', name: 'Marketing', icon: Megaphone },
        { id: 'inventory', name: 'Business', icon: Boxes },
        { id: 'testimonials', name: 'Reviews', icon: Star },
        { id: 'faq', name: 'FAQ', icon: HelpCircle },
        { id: 'about', name: 'About ', icon: Info },
        { id: 'contact', name: 'Contact', icon: Phone },
        { id: 'policies', name: 'Policies', icon: Shield },
        { id: 'advanced', name: 'Advanced', icon: Code },
        { id: 'account', name: 'Account', icon: User },
    ];

    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div style={{ marginBottom: '2.5rem' }}>
            <div className="flex" style={{ alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div className="flex-center" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--gold)', color: 'white' }}>
                    <Icon size={18} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{title}</h3>
            </div>
            {description && <p style={{ fontSize: '0.85rem', color: 'var(--stone)' }}>{description}</p>}
        </div>
    );

    return (
        <div className="flex-column" style={{ gap: '2rem', paddingBottom: '8rem' }}>
            <div className="flex-between" style={{ alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--charcoal)', letterSpacing: '-0.02em' }}>Control Center</h1>
                    <p style={{ fontSize: '0.95rem', color: 'var(--stone)', fontWeight: 500 }}>Global system configurations & branding</p>
                </div>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            background: message.includes('Error') ? '#fee2e2' : 'var(--gold)',
                            color: message.includes('Error') ? '#ef4444' : 'white',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '1rem',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)'
                        }}
                    >
                        {message.toUpperCase()}
                    </motion.div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex" style={{ gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.9rem 1.5rem',
                            borderRadius: '1.25rem',
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: activeTab === tab.id ? 'var(--charcoal)' : 'white',
                            color: activeTab === tab.id ? 'white' : 'var(--stone)',
                            boxShadow: activeTab === tab.id ? '0 10px 20px rgba(0,0,0,0.1)' : 'none',
                            border: '1px solid ' + (activeTab === tab.id ? 'var(--charcoal)' : 'rgba(0,0,0,0.05)')
                        }}
                    >
                        <tab.icon size={15} />
                        {tab.name.toUpperCase()}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-column" style={{ gap: '2rem' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="glass-card"
                        style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '2.5rem', background: 'white', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 50px rgba(0,0,0,0.02)' }}
                    >
                        {/* TAB: IDENTITY */}
                        {activeTab === 'brand' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <SectionHeader icon={Palette} title="Branding & Store Identity" description="Global visual settings and brand assets." />

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>Store Logo</label>
                                        <div className="flex" style={{ alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ width: '5rem', height: '5rem', background: 'var(--crease)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                {files.logo ? <img src={URL.createObjectURL(files.logo)} style={{ height: '60%', objectFit: 'contain' }} alt="" /> : (settings?.logo?.url && <img src={settings.logo.url} style={{ height: '60%', objectFit: 'contain' }} alt="" />)}
                                            </div>
                                            <label className="admin-btn" style={{ background: 'var(--charcoal)', color: 'white', fontSize: '0.7rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 800 }}>
                                                UPLOAD LOGO
                                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'logo')} style={{ display: 'none' }} />
                                            </label>
                                            {settings?.logo?.url && (
                                                <button type="button" onClick={() => deleteImage('logo')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem' }}>
                                                    DELETE
                                                </button>
                                            )}
                                            {files.logo && (
                                                <button type="button" onClick={() => clearFile('logo')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem' }}>
                                                    CLEAR
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>Browser Favicon</label>
                                        <div className="flex" style={{ alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ width: '3rem', height: '3rem', background: 'var(--crease)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                {files.favicon ? <img src={URL.createObjectURL(files.favicon)} style={{ width: '24px', height: '24px' }} alt="" /> : (settings?.favicon?.url && <img src={settings.favicon.url} style={{ width: '24px', height: '24px' }} alt="" />)}
                                            </div>
                                            <label className="admin-btn" style={{ background: 'var(--charcoal)', color: 'white', fontSize: '0.7rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 800 }}>
                                                UPLOAD ICON
                                                <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'favicon')} style={{ display: 'none' }} />
                                            </label>
                                            {settings?.favicon?.url && (
                                                <button type="button" onClick={() => deleteImage('favicon')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem' }}>
                                                    DELETE
                                                </button>
                                            )}
                                            {files.favicon && (
                                                <button type="button" onClick={() => clearFile('favicon')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem' }}>
                                                    CLEAR
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem' }}>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>Brand Name</label>
                                        <input type="text" value={formData.brandName || ''} onChange={e => setFormData({ ...formData, brandName: e.target.value })} style={inputStyle} />
                                    </div>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>Admin Panel Title</label>
                                        <input type="text" value={formData.adminPanelTitle || ''} onChange={e => setFormData({ ...formData, adminPanelTitle: e.target.value })} style={inputStyle} placeholder="Leave empty to use brand name" />
                                    </div>
                                </div>

                                <div style={fieldRowStyle}>
                                    <label style={labelStyle}>Tagline (Footer)</label>
                                    <input type="text" value={formData.footerTagline || ''} onChange={e => setFormData({ ...formData, footerTagline: e.target.value })} style={inputStyle} placeholder="Premium furniture for modern living spaces." />
                                </div>

                                <div style={fieldRowStyle}>
                                    <label style={labelStyle}>WhatsApp Button Text</label>
                                    <input type="text" value={formData.whatsappBtnText || ''} onChange={e => setFormData({ ...formData, whatsappBtnText: e.target.value })} style={inputStyle} placeholder="WHATSAPP" />
                                </div>

                                <div style={fieldRowStyle}>
                                    <label style={labelStyle}>Product Image Height</label>
                                    <select value={formData.productCardHeight || '260px'} onChange={e => setFormData({ ...formData, productCardHeight: e.target.value })} style={inputStyle}>
                                        <option value="200px">Compact (200px)</option>
                                        <option value="260px">Standard (260px)</option>
                                        <option value="320px">Large (320px)</option>
                                        <option value="400px">Showcase (400px)</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>Accent Color (Buttons & Links)</label>
                                        <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                            <input type="color" value={formData.accentColor || '#D4AF37'} onChange={e => setFormData({ ...formData, accentColor: e.target.value })} style={{ width: '3.5rem', height: '3.5rem', border: 'none', borderRadius: '1rem', cursor: 'pointer', padding: 0 }} />
                                            <input type="text" value={formData.accentColor || '#D4AF37'} onChange={e => setFormData({ ...formData, accentColor: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>System Background</label>
                                        <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                            <input type="color" value={formData.primaryColor || '#121212'} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} style={{ width: '3.5rem', height: '3.5rem', border: 'none', borderRadius: '1rem', cursor: 'pointer', padding: 0 }} />
                                            <input type="text" value={formData.primaryColor || '#121212'} onChange={e => setFormData({ ...formData, primaryColor: e.target.value })} style={inputStyle} />
                                        </div>
                                    </div>
                                </div>

                                <div style={fieldRowStyle}>
                                    <label style={labelStyle}>Currency Symbol</label>
                                    <input type="text" value={formData.currencySymbol || '₹'} onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })} style={{ ...inputStyle, maxWidth: '100px' }} />
                                </div>
                            </div>
                        )}

                        {/* TAB: SECTIONS (Home Visibility) */}
                        {activeTab === 'home' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <SectionHeader icon={Layout} title="Homepage Sections" description="Dynamic section visibility and text content." />

                                <div className="grid-toggle" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {[
                                        { label: 'Featured Products', key: 'showFeaturedSection' },
                                        { label: 'Categories Grid', key: 'showCategoriesSection' },
                                        { label: 'Why Choose Us', key: 'showQualitySection' },
                                        { label: 'Customer Reviews', key: 'showTestimonialsSection' }
                                    ].map(toggle => (
                                        <label key={toggle.key} className="flex-between" style={{ padding: '1.25rem', borderRadius: '1rem', background: 'var(--crease)', cursor: 'pointer' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{toggle.label}</span>
                                            <input type="checkbox" checked={formData[toggle.key]} onChange={e => setFormData({ ...formData, [toggle.key]: e.target.checked })} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                                        </label>
                                    ))}
                                </div>

                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 900 }}>Featured Section Text</h4>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Label</label><input type="text" value={formData.featuredSectionSubtitle || ''} onChange={e => setFormData({ ...formData, featuredSectionSubtitle: e.target.value })} style={inputStyle} /></div>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Title</label><input type="text" value={formData.featuredSectionTitle || ''} onChange={e => setFormData({ ...formData, featuredSectionTitle: e.target.value })} style={inputStyle} /></div>
                                </div>

                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 900 }}>Hero Section</h4>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Hero Label (small text above title)</label><input type="text" value={formData.heroLabel || ''} onChange={e => setFormData({ ...formData, heroLabel: e.target.value })} style={inputStyle} /></div>
                                </div>

                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 900 }}>Why Choose Us (Quality Features)</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--stone)' }}>Edit the 4 feature cards shown in this section.</p>
                                    {(() => {
                                        const features = formData.qualityFeatures ? (typeof formData.qualityFeatures === 'string' ? JSON.parse(formData.qualityFeatures) : formData.qualityFeatures) : [
                                            { title: 'Strong & Durable', subtitle: 'Made with the best wood and materials that last for years.', icon: 'Shield' },
                                            { title: 'Free Delivery', subtitle: 'We deliver to your doorstep with careful handling.', icon: 'Truck' },
                                            { title: 'Trusted by 5000+ Families', subtitle: 'Our customers love us. We treat every order with care.', icon: 'HeartHandshake' },
                                            { title: 'Easy Returns', subtitle: 'Not satisfied? Return within 7 days, no questions asked.', icon: 'CheckCircle' }
                                        ];
                                        return features.map((f, idx) => (
                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', padding: '1rem', background: 'var(--crease)', borderRadius: '1rem' }}>
                                                <div style={fieldRowStyle}><label style={labelStyle}>Title</label><input type="text" value={f.title} onChange={e => { const newF = [...features]; newF[idx].title = e.target.value; setFormData({ ...formData, qualityFeatures: JSON.stringify(newF) }); }} style={inputStyle} /></div>
                                                <div style={fieldRowStyle}><label style={labelStyle}>Description</label><input type="text" value={f.subtitle} onChange={e => { const newF = [...features]; newF[idx].subtitle = e.target.value; setFormData({ ...formData, qualityFeatures: JSON.stringify(newF) }); }} style={inputStyle} /></div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 900 }}>Products Page</h4>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Page Label (small text)</label><input type="text" value={formData.productsPageLabel || ''} onChange={e => setFormData({ ...formData, productsPageLabel: e.target.value })} style={inputStyle} /></div>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Page Title</label><input type="text" value={formData.productsPageTitle || ''} onChange={e => setFormData({ ...formData, productsPageTitle: e.target.value })} style={inputStyle} /></div>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Search Placeholder</label><input type="text" value={formData.productsSearchPlaceholder || ''} onChange={e => setFormData({ ...formData, productsSearchPlaceholder: e.target.value })} style={inputStyle} /></div>
                                </div>
                            </div>
                        )}

                        {/* TAB: MARKETING (Popups, Announcements) */}
                        {activeTab === 'marketing' && (
                            <div className="flex-column" style={{ gap: '2.5rem' }}>
                                <div className="flex-column" style={{ gap: '1.5rem' }}>
                                    <SectionHeader icon={Megaphone} title="Announcement Bar" description="Sticky bar at the top of the website." />

                                    <div className="flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
                                        <label className="flex-center" style={{ gap: '0.5rem', fontWeight: 800, fontSize: '0.8rem' }}>
                                            <input type="checkbox" checked={formData.showAnnouncement} onChange={e => setFormData({ ...formData, showAnnouncement: e.target.checked })} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                                            Enable Bar
                                        </label>
                                    </div>

                                    <div style={fieldRowStyle}><label style={labelStyle}>Announcement Text</label><input type="text" value={formData.announcementText || ''} onChange={e => setFormData({ ...formData, announcementText: e.target.value })} style={inputStyle} /></div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div style={fieldRowStyle}>
                                            <label style={labelStyle}>Background Color</label>
                                            <div className="flex" style={{ gap: '1rem' }}>
                                                <input type="color" value={formData.announcementBgColor || '#D4AF37'} onChange={e => setFormData({ ...formData, announcementBgColor: e.target.value })} style={{ width: '3.5rem', height: '3.5rem', border: 'none', borderRadius: '1rem', cursor: 'pointer' }} />
                                                <input type="text" value={formData.announcementBgColor || '#D4AF37'} onChange={e => setFormData({ ...formData, announcementBgColor: e.target.value })} style={inputStyle} />
                                            </div>
                                        </div>
                                        <div style={fieldRowStyle}>
                                            <label style={labelStyle}>Text Color</label>
                                            <div className="flex" style={{ gap: '1rem' }}>
                                                <input type="color" value={formData.announcementTextColor || '#ffffff'} onChange={e => setFormData({ ...formData, announcementTextColor: e.target.value })} style={{ width: '3.5rem', height: '3.5rem', border: 'none', borderRadius: '1rem', cursor: 'pointer' }} />
                                                <input type="text" value={formData.announcementTextColor || '#ffffff'} onChange={e => setFormData({ ...formData, announcementTextColor: e.target.value })} style={inputStyle} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2.5rem' }}>
                                    <SectionHeader icon={Zap} title="Promo Popup" description="Entry popup to drive sales and capture attention." />

                                    <label className="flex-center" style={{ gap: '0.5rem', fontWeight: 800, fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                                        <input type="checkbox" checked={formData.showPromoPopup} onChange={e => setFormData({ ...formData, showPromoPopup: e.target.checked })} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                                        Enable Popup
                                    </label>

                                    <label className="flex-center" style={{ gap: '0.5rem', fontWeight: 800, fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                                        <input type="checkbox" checked={formData.popupShowEveryTime} onChange={e => setFormData({ ...formData, popupShowEveryTime: e.target.checked })} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                                        Show on every visit (not just once per session)
                                    </label>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                                        <div className="flex-column" style={{ gap: '1.5rem' }}>
                                            <div style={fieldRowStyle}><label style={labelStyle}>Popup Title</label><input type="text" value={formData.promoPopupTitle || ''} onChange={e => setFormData({ ...formData, promoPopupTitle: e.target.value })} style={inputStyle} /></div>
                                            <div style={fieldRowStyle}><label style={labelStyle}>Message</label><textarea rows="3" value={formData.promoPopupText || ''} onChange={e => setFormData({ ...formData, promoPopupText: e.target.value })} style={{ ...inputStyle, resize: 'none' }}></textarea></div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div style={fieldRowStyle}><label style={labelStyle}>Button Text</label><input type="text" value={formData.promoPopupBtnText || ''} onChange={e => setFormData({ ...formData, promoPopupBtnText: e.target.value })} style={inputStyle} /></div>
                                                <div style={fieldRowStyle}><label style={labelStyle}>Button Link</label><input type="text" value={formData.promoPopupBtnLink || ''} onChange={e => setFormData({ ...formData, promoPopupBtnLink: e.target.value })} style={inputStyle} /></div>
                                            </div>
                                        </div>
                                        <div style={fieldRowStyle}>
                                            <label style={labelStyle}>Popup Image</label>
                                            <div style={{ position: 'relative', height: '200px', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                <img src={files.promoPopupImage ? URL.createObjectURL(files.promoPopupImage) : settings?.promoPopupImage?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                    <label className="admin-btn" style={{ background: 'white', color: 'var(--charcoal)', fontSize: '0.65rem', padding: '0.6rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 900 }}>
                                                        CHANGE
                                                        <input type="file" onChange={e => handleFileChange(e, 'promoPopupImage')} style={{ display: 'none' }} />
                                                    </label>
                                                    {(settings?.promoPopupImage?.url || files.promoPopupImage) && (
                                                        <button type="button" onClick={() => { deleteImage('promoPopupImage'); clearFile('promoPopupImage'); }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 900, fontSize: '0.65rem' }}>
                                                            DELETE
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: INVENTORY & BUSINESS (Bulk Tools) */}
                        {activeTab === 'inventory' && (
                            <div className="flex-column" style={{ gap: '2.5rem' }}>
                                <div className="flex-column" style={{ gap: '1.5rem' }}>
                                    <SectionHeader icon={Activity} title="Health & Stock Monitoring" description="Automated alerts for your inventory." />
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>Low Stock Alert Threshold</label>
                                        <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                            <input type="number" value={formData.lowStockThreshold || 5} onChange={e => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })} style={{ ...inputStyle, maxWidth: '120px' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--stone)' }}>Show a red warning when stock is below this number.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2.5rem' }}>
                                    <SectionHeader icon={TrendingUp} title="Bulk Price Management" description="Global pricing adjustment tool." />
                                    <div className="glass-card" style={{ background: 'var(--crease)', padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                            <AlertTriangle size={24} color="#f59e0b" />
                                            <p style={{ fontSize: '0.85rem', color: 'var(--stone)', fontWeight: 600 }}>This tool will modify product prices in the database directly. Use with caution.</p>
                                        </div>
                                        <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                                            <div className="flex-column" style={{ gap: '0.4rem', flexGrow: 1 }}>
                                                <label style={labelStyle}>Category Target</label>
                                                <select
                                                    value={bulkData.category}
                                                    onChange={e => setBulkData({ ...bulkData, category: e.target.value })}
                                                    style={inputStyle}
                                                >
                                                    <option>All Products</option>
                                                    {Array.from(new Set((settings?.categories || []).map(c => c))).map(c => <option key={c}>{c}</option>)}
                                                    <option>Sofa</option><option>Beds</option><option>Dining</option><option>Decor</option><option>Office</option>
                                                </select>
                                            </div>
                                            <div className="flex-column" style={{ gap: '0.4rem', width: '130px' }}>
                                                <label style={labelStyle}>Adjustment</label>
                                                <select
                                                    value={bulkData.action}
                                                    onChange={e => setBulkData({ ...bulkData, action: e.target.value })}
                                                    style={inputStyle}
                                                >
                                                    <option>Increase</option>
                                                    <option>Decrease</option>
                                                </select>
                                            </div>
                                            <div className="flex-column" style={{ gap: '0.4rem', width: '100px' }}>
                                                <label style={labelStyle}>Value (%)</label>
                                                <input
                                                    type="number"
                                                    value={bulkData.value}
                                                    onChange={e => setBulkData({ ...bulkData, value: e.target.value })}
                                                    placeholder="10"
                                                    style={inputStyle}
                                                />
                                            </div>
                                            <button
                                                onClick={handleBulkUpdate}
                                                disabled={bulkLoading}
                                                type="button"
                                                className="admin-btn flex-center"
                                                style={{ background: 'var(--gold)', color: 'white', padding: '0 2rem', height: '3.5rem', alignSelf: 'flex-end', borderRadius: '1rem', fontWeight: 900, fontSize: '0.7rem', gap: '0.5rem' }}
                                            >
                                                {bulkLoading ? <Loader2 className="spin" size={16} /> : <TrendingUp size={16} />}
                                                APPLY BULK UPDATE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: TESTIMONIALS */}
                        {activeTab === 'testimonials' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <div className="flex-between">
                                    <SectionHeader icon={Star} title="Customer Reviews" description="Manage the feedback shown on your site." />
                                    <button onClick={() => addItem('testimonials', { name: '', role: '', content: '', rating: 5 })} type="button" className="admin-btn flex-center" style={{ background: 'var(--charcoal)', color: 'white', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '0.7rem' }}>
                                        <Plus size={16} /> ADD REVIEW
                                    </button>
                                </div>
                                <div className="flex-column" style={{ gap: '1.5rem' }}>
                                    {(formData.testimonials || []).map((t, idx) => (
                                        <div key={idx} className="flex-column" style={{ gap: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '1.5rem', position: 'relative' }}>
                                            <button onClick={() => removeItem('testimonials', idx)} type="button" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div style={fieldRowStyle}><label style={labelStyle}>Customer Name</label><input type="text" value={t.name} onChange={e => updateItem('testimonials', idx, 'name', e.target.value)} style={inputStyle} /></div>
                                                <div style={fieldRowStyle}><label style={labelStyle}>Role / Location</label><input type="text" value={t.role} onChange={e => updateItem('testimonials', idx, 'role', e.target.value)} style={inputStyle} placeholder="New Delhi" /></div>
                                            </div>
                                            <div style={fieldRowStyle}><label style={labelStyle}>Content</label><textarea rows="2" value={t.content} onChange={e => updateItem('testimonials', idx, 'content', e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea></div>
                                            <div style={fieldRowStyle}><label style={labelStyle}>Rating (1-5)</label><input type="number" min="1" max="5" value={t.rating} onChange={e => updateItem('testimonials', idx, 'rating', parseInt(e.target.value))} style={{ ...inputStyle, maxWidth: '80px' }} /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB: FAQ */}
                        {activeTab === 'faq' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <div className="flex-between">
                                    <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" description="Help customers by answering common queries." />
                                    <button onClick={() => addItem('faqs', { question: '', answer: '' })} type="button" className="admin-btn flex-center" style={{ background: 'var(--charcoal)', color: 'white', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '0.7rem' }}>
                                        <Plus size={16} /> ADD FAQ
                                    </button>
                                </div>
                                <div className="flex-column" style={{ gap: '1.5rem' }}>
                                    {(formData.faqs || []).map((faq, idx) => (
                                        <div key={idx} className="flex-column" style={{ gap: '1rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '1.5rem', position: 'relative' }}>
                                            <button onClick={() => removeItem('faqs', idx)} type="button" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                                            <div style={fieldRowStyle}><label style={labelStyle}>Question</label><input type="text" value={faq.question} onChange={e => updateItem('faqs', idx, 'question', e.target.value)} style={inputStyle} /></div>
                                            <div style={fieldRowStyle}><label style={labelStyle}>Answer</label><textarea rows="3" value={faq.answer} onChange={e => updateItem('faqs', idx, 'answer', e.target.value)} style={{ ...inputStyle, resize: 'none' }}></textarea></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB: ADVANCED (SEO, CSS, Maintenance) */}
                        {activeTab === 'advanced' && (
                            <div className="flex-column" style={{ gap: '2.5rem' }}>
                                <div className="flex-column" style={{ gap: '1.5rem' }}>
                                    <SectionHeader icon={Globe} title="SEO Configuration" description="Control how your site appears in Search Engines." />
                                    <div style={fieldRowStyle}><label style={labelStyle}>Site Title (Browser Tab)</label><input type="text" value={formData.siteTitle || ''} onChange={e => setFormData({ ...formData, siteTitle: e.target.value })} style={inputStyle} /></div>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Meta Description</label><textarea rows="2" value={formData.siteMetaDescription || ''} onChange={e => setFormData({ ...formData, siteMetaDescription: e.target.value })} style={{ ...inputStyle, resize: 'none' }}></textarea></div>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Keywords (Comma separated)</label><input type="text" value={formData.siteKeywords || ''} onChange={e => setFormData({ ...formData, siteKeywords: e.target.value })} style={inputStyle} /></div>
                                </div>

                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2.5rem' }}>
                                    <SectionHeader icon={Shield} title="Maintenance Mode" description="Hide your site during major catalogue updates." />
                                    <div className="glass-card" style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <label className="flex-between" style={{ cursor: 'pointer' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#92400e' }}>ACTIVATE MAINTENANCE MODE</span>
                                            <input type="checkbox" checked={formData.maintenanceMode} onChange={e => setFormData({ ...formData, maintenanceMode: e.target.checked })} style={{ width: '1.5rem', height: '1.5rem', accentColor: '#92400e' }} />
                                        </label>
                                        <p style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>Guests will see a placeholder page. Admins still have full access.</p>
                                        <div style={fieldRowStyle}><label style={{ ...labelStyle, color: '#92400e' }}>Maintenance Message</label><input type="text" value={formData.maintenanceMessage || ''} onChange={e => setFormData({ ...formData, maintenanceMessage: e.target.value })} style={{ ...inputStyle, background: 'white' }} /></div>
                                    </div>
                                </div>

                                <div className="flex-column" style={{ gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2.5rem' }}>
                                    <SectionHeader icon={Code} title="Custom CSS & Integration" description="Inject custom styles or tracking scripts (G-Analytics)." />
                                    <div style={fieldRowStyle}><label style={labelStyle}>Custom CSS</label><textarea rows="5" value={formData.customCSS || ''} onChange={e => setFormData({ ...formData, customCSS: e.target.value })} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8rem' }} placeholder="/* Add your styles here */"></textarea></div>
                                    <div style={fieldRowStyle}><label style={labelStyle}>Head Scripts (JS)</label><textarea rows="5" value={formData.customJS || ''} onChange={e => setFormData({ ...formData, customJS: e.target.value })} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8rem' }} placeholder="<script>...</script>"></textarea></div>
                                </div>
                            </div>
                        )}

                        {/* OTHER TABS (About, Contact, Policies) RETAINED FROM PREVIOUS PHASE BIT UPDATED UI */}
                        {activeTab === 'about' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <SectionHeader icon={Info} title="About Page Editor" description="Manage your story, team and craftsmanship." />
                                <div style={fieldRowStyle}><label style={labelStyle}>About Hero Title</label><input type="text" value={formData.aboutHeroTitle || ''} onChange={e => setFormData({ ...formData, aboutHeroTitle: e.target.value })} style={inputStyle} /></div>
                                <div style={fieldRowStyle}><label style={labelStyle}>Main Welcome Text</label><textarea rows="4" value={formData.aboutText || ''} onChange={e => setFormData({ ...formData, aboutText: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }}></textarea></div>
                                <div style={fieldRowStyle}><label style={labelStyle}>Closing Quote</label><textarea rows="2" value={formData.aboutQuote || ''} onChange={e => setFormData({ ...formData, aboutQuote: e.target.value })} style={{ ...inputStyle, resize: 'none' }}></textarea></div>
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <SectionHeader icon={Phone} title="Contact Support" description="Let customers reach you easily." />
                                <div style={fieldRowStyle}><label style={labelStyle}>WhatsApp Number</label><input type="text" value={formData.whatsappNumber || ''} onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })} style={inputStyle} /></div>
                                <div style={fieldRowStyle}><label style={labelStyle}>Contact Phone</label><input type="text" value={formData.contactPhone || ''} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} style={inputStyle} /></div>
                                <div style={fieldRowStyle}><label style={labelStyle}>Public Email</label><input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} /></div>
                                <div style={fieldRowStyle}><label style={labelStyle}>Physical Address</label><textarea rows="2" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ ...inputStyle, resize: 'none' }}></textarea></div>
                                <div style={fieldRowStyle}><label style={labelStyle}>Map Location Link (Google Maps)</label><input type="text" value={formData.mapLink || ''} onChange={e => setFormData({ ...formData, mapLink: e.target.value })} style={inputStyle} placeholder="https://maps.google.com/..." /></div>
                            </div>
                        )}

                        {activeTab === 'policies' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <SectionHeader icon={Shield} title="Policies" description="Edit the legal fine print." />
                                <div style={fieldRowStyle}><label style={labelStyle}>Privacy Policy</label><textarea rows="10" value={formData.privacyPolicy || ''} onChange={e => setFormData({ ...formData, privacyPolicy: e.target.value })} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8rem' }}></textarea></div>
                                <div style={fieldRowStyle}><label style={labelStyle}>Return Policy</label><textarea rows="10" value={formData.returnPolicy || ''} onChange={e => setFormData({ ...formData, returnPolicy: e.target.value })} style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.8rem' }}></textarea></div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="flex-column" style={{ gap: '2rem' }}>
                                <SectionHeader icon={User} title="Account Management" description="Update your administrative credentials." />

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>Admin Email</label>
                                        <input type="email" value={accFormData.email} onChange={e => setAccFormData({ ...accFormData, email: e.target.value })} style={inputStyle} placeholder="new-email@aura.com" />
                                    </div>
                                    <div style={fieldRowStyle}>
                                        <label style={labelStyle}>New Password</label>
                                        <input type="password" value={accFormData.newPassword} onChange={e => setAccFormData({ ...accFormData, newPassword: e.target.value })} style={inputStyle} placeholder="Leave blank to keep current" />
                                    </div>
                                </div>

                                <button
                                    onClick={handleAccSubmit}
                                    disabled={accLoading}
                                    type="button"
                                    className="flex-center"
                                    style={{
                                        gap: '0.75rem',
                                        padding: '1rem 2rem',
                                        borderRadius: '1.1rem',
                                        background: 'var(--charcoal)',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        fontWeight: 900,
                                        border: 'none',
                                        cursor: accLoading ? 'not-allowed' : 'pointer',
                                        alignSelf: 'flex-start',
                                        marginTop: '1.5rem',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {accLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {accLoading ? 'UPDATING...' : 'UPDATE ACCOUNT CREDENTIALS'}
                                </button>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>

                {/* Fixed Action Bar */}
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', gap: '1rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        type="submit"
                        className="flex-center"
                        style={{
                            gap: '0.75rem',
                            padding: '1.25rem 3rem',
                            borderRadius: '1.5rem',
                            boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
                            background: 'var(--gold)',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 900,
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'SAVING CHANGES...' : 'SAVE ALL SETTINGS'}
                    </motion.button>
                </div>
            </form>

            <style dangerouslySetInnerHTML={{
                __html: `
                input:focus, textarea:focus, select:focus { 
                    border-color: var(--gold) !important; 
                    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.08);
                    background: white !important;
                }
                .admin-btn:active { transform: scale(0.98); }
            `}} />
        </div>
    );
};

export default AdminSettings;
