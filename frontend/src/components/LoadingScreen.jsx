import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const LoadingScreen = () => {
    const { settings } = useSettings();

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'var(--charcoal)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem'
            }}
        >
            <div style={{ position: 'relative' }}>
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: '2px solid rgba(212, 175, 55, 0.1)',
                        borderTop: '2px solid var(--gold)'
                    }}
                />

                {/* Logo/Text in center */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            fontSize: '1.2rem',
                            fontWeight: 900,
                            color: 'var(--gold)',
                            letterSpacing: '0.1em'
                        }}
                    >
                        {settings?.brandName?.[0] || 'F'}
                    </motion.span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ textAlign: 'center' }}
            >
                <h2 style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                }}>
                    {settings?.brandName || 'FURNITURE.'}
                </h2>
                <div style={{
                    width: '40px',
                    height: '1px',
                    background: 'var(--gold)',
                    margin: '0 auto',
                    opacity: 0.5
                }} />
            </motion.div>
        </motion.div>
    );
};

export default LoadingScreen;
