<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
>>>>>>> 482aabe962b5c854ef4da8fe5a3d3f3f33bf9d08
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Maintenance from './pages/Maintenance';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminSettings from './pages/admin/AdminSettings';

// Helper component to handle favicon and maintenance logic
const CustomerRoutes = () => {
<<<<<<< HEAD
  const { settings, loading } = useSettings();
=======
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.favicon?.url) {
      const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.href = settings.favicon.url;
      document.head.appendChild(link);
    }
    if (settings?.siteTitle) {
      document.title = settings.siteTitle;
    }
  }, [settings?.favicon, settings?.siteTitle]);

>>>>>>> 482aabe962b5c854ef4da8fe5a3d3f3f33bf9d08
  const isAdmin = localStorage.getItem('adminToken');

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!loading && settings?.maintenanceMode && !isAdmin ? (
        <Maintenance />
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<div className="flex-center flex-column" style={{ height: '60vh', gap: '2rem', textAlign: 'center' }}><h1 style={{ fontSize: '4rem', fontWeight: 900 }}>404</h1><p style={{ color: 'var(--stone)', fontSize: '1.2rem' }}>Page Not Found</p></div>} />
          </Routes>
        </Layout>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            {/* Admin Login - Separated from Main Layout */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Dashboard - Protected */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>
            </Route>

            {/* Customer Site */}
            <Route path="/*" element={<CustomerRoutes />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
