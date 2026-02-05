import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Ideally call an endpoint to get full user details, but email from token is a start
                setUser({ email: decoded.sub });
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/token', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        const decoded = jwtDecode(access_token);
        setUser({ email: decoded.sub });
    };

    const register = async (email, password) => {
        await api.post('/users/', { email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
