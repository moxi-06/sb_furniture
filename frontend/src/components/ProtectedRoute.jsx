import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { admin, loading } = useAuth();

    if (loading) return <div>Auth Loading...</div>;

    return admin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
