import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Hammer, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const Maintenance = () => {
    const { settings } = useSettings();

    return (
        <div className="flex-center flex-column" style={{
            minHeight: '100vh',
            background: 'var(--charcoal)',
            color: 'white',
            textAlign: 'center',
            padding: '2rem',
            gap: '2rem'
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-center flex-column"
            >
                <div style={{ width: '5rem', height: '5rem', background: 'var(--gold)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Hammer size={40} />
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Making Catalog Updates</h1>
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', fontWeight: 500 }}>
                    {settings?.maintenanceMessage || 'We are currently adding new luxury pieces to our collection. We will be back online shortly!'}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}
            >
                <p style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.3em', color: 'var(--gold)' }}>{(settings?.brandName || 'STORE').toUpperCase()} FURNITURE</p>
            </motion.div>
        </div>
    );
};

export default Maintenance;
