import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ExternalLink,
    Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout = () => {
    const { settings } = useSettings();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const sidebarContent = (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Section */}
                <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', background: 'var(--gold)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Palette size={20} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>{(settings?.adminPanelTitle || settings?.brandName || 'STORE').replace('.', '').toUpperCase()}</h2>
                        <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '0.2em', marginTop: '0.3rem' }}>CONTROL PANEL</p>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-column" style={{ gap: '0.5rem', flexGrow: 1, padding: '2rem 1rem' }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={18} strokeWidth={2.5} />
                        <span style={{ flexGrow: 1 }}>{item.name}</span>
                        <ChevronRight className="chevron" size={14} style={{ opacity: 0.3 }} />
                    </NavLink>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="flex-column" style={{ padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', gap: '0.5rem' }}>
                <button
                    onClick={() => { window.open('/', '_blank'); setIsMobileMenuOpen(false); }}
                    className="admin-nav-link"
                    style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)' }}
                >
                    <ExternalLink size={18} />
                    <span>View Website</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="admin-nav-link"
                    style={{ background: 'transparent', color: '#ef4444' }}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--crease)', display: 'flex' }}>
            {/* Desktop Sidebar */}
            <aside className="desktop-only" style={{ background: 'var(--charcoal)', boxShadow: '10px 0 30px rgba(0,0,0,0.05)', zIndex: 100 }}>
                {sidebarContent}
            </aside>

            {/* Mobile Header */}
            <header className="mobile-only" style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                height: '70px', background: 'rgba(18,18,18,0.95)',
                backdropFilter: 'blur(10px)', zIndex: 1000,
                padding: '0 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2rem', height: '2rem', background: 'var(--gold)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Palette size={14} />
                    </div>
                    <span style={{ color: 'white', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.05em' }}>{(settings?.adminPanelTitle || settings?.brandName || 'STORE').replace('.', '').toUpperCase()}</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 1100 }}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '280px', background: 'var(--charcoal)', zIndex: 1200, boxShadow: '20px 0 50px rgba(0,0,0,0.2)' }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="admin-main" style={{ flexGrow: 1 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                .desktop-only { display: flex; width: 280px; flex-direction: column; height: 100vh; position: fixed; left: 0; top: 0; }
                .mobile-only { display: none; }
                
                /* Global admin main style with safe top padding */
                .admin-main { 
                    margin-left: 280px; 
                    width: calc(100% - 280px); 
                    padding: 4rem 4rem 3rem; /* Reduced slightly as standard desktop doesn't have top bar */
                    min-height: 100vh; 
                }
                
                .admin-nav-link { 
                    display: flex; 
                    align-items: center; 
                    gap: 1rem; 
                    padding: 0.9rem 1.25rem; 
                    border-radius: 1rem; 
                    text-decoration: none; 
                    font-weight: 700; 
                    font-size: 0.85rem; 
                    color: rgba(255,255,255,0.6);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                    border: 1px solid transparent;
                }
                .admin-nav-link span { display: block; }
                .admin-nav-link:hover { background: rgba(255,255,255,0.03); color: white; }
                .admin-nav-link.active { 
                    background: rgba(212, 175, 55, 0.1); 
                    color: var(--gold) !important; 
                    border-color: rgba(212, 175, 55, 0.2); 
                }
                .admin-nav-link.active .chevron { opacity: 1 !important; transform: translateX(3px); color: var(--gold); }
                
                @media (max-width: 1024px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { 
                        display: flex !important; 
                        align-items: center; 
                        justify-content: space-between; 
                    }
                    .admin-main { 
                        margin-left: 0 !important; 
                        width: 100%; 
                        padding: 8rem 1.5rem 3rem !important; 
                    }
                    /* Ensure mobile sidebar text is visible */
                    .admin-nav-link span { display: block; }
                }

                aside::-webkit-scrollbar { width: 4px; }
                aside::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}} />
        </div>
    );
};

export default AdminLayout;
