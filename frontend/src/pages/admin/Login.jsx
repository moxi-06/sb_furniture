import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Unauthorized Access Point');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Ambient Background Elements */}
            <div style={{ position: 'absolute', top: '20%', left: '10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '3.5rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    borderRadius: '2.5rem',
                    zIndex: 10,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    position: 'relative'
                }}
            >
                {/* Brand Identity */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            width: '4.5rem',
                            height: '4.5rem',
                            borderRadius: '1.25rem',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #AF8F2C 100%)',
                            margin: '0 auto 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
                        }}
                    >
                        <ShieldCheck size={32} color="white" strokeWidth={1.5} />
                    </motion.div>
                    <h2 style={{ fontSize: '2.2rem', color: 'white', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Control Center</h2>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Aura Inventory Management</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#f87171',
                                padding: '1rem 1.25rem',
                                borderRadius: '1rem',
                                marginBottom: '2rem',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', paddingLeft: '0.2rem' }}>IDENTIFIER</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    color: 'white',
                                    padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '1.1rem',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                placeholder="admin@aura.com"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', paddingLeft: '0.2rem' }}>SECURITY KEY</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    color: 'white',
                                    padding: '1.1rem 1.1rem 1.1rem 3.5rem',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '1.1rem',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1.1rem',
                            fontSize: '0.9rem',
                            fontWeight: 900,
                            borderRadius: '1.1rem',
                            marginTop: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            background: '#D4AF37',
                            color: 'white',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <>ACCESS VAULT <ArrowRight size={20} /></>}
                    </motion.button>
                </form>

                {/* Footer Security Note */}
                <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.3 }}>
                    <p style={{ fontSize: '0.65rem', color: 'white', fontWeight: 600, letterSpacing: '0.05em' }}>
                        SECURE AES-256 ENCRYPTED TRANSACTION
                    </p>
                </div>
            </motion.div>

            {/* Global Styles for animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}} />
        </div>
    );
};

export default AdminLogin;
