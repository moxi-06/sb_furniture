import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAdmin = localStorage.getItem('adminInfo');
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        setAdmin(data);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        localStorage.setItem('adminToken', data.token);
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminToken');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
