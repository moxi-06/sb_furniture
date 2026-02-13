import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

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

// Helper component to handle maintenance logic
const CustomerRoutes = () => {
  const { settings } = useSettings();
  const isAdmin = localStorage.getItem('adminToken');

  if (settings?.maintenanceMode && !isAdmin) {
    return <Maintenance />;
  }

  return (
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
