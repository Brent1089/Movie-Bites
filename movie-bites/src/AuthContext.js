import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';
import { apiBaseUrl } from './apiConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const { showToast } = useToast();

    const getErrorMessage = (error, fallback) => {
        return error.response?.data?.error || error.response?.data?.status || error.message || fallback;
    };

    useEffect(() => {
        checkCurrentUser();
    }, []);


    const checkCurrentUser = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/me`, {
                withCredentials: true
            });

            setIsLoggedIn(true);
            setUser(response.data.user);
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    const handleLogin = async (formData) => {
        try {
            const response = await axios.post(`${apiBaseUrl}/login`, formData, {
                withCredentials: true
            });
            console.log('Login successful:', response.data);
            setIsLoggedIn(true);
            setUser(response.data.user);
            showToast('Login successful.', 'success');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            showToast(getErrorMessage(error, 'Login failed.'), 'error');
            return { success: false, error: error.response?.data || 'Login failed' };
        }
    };

    const handleRegister = async (formData) => {
        try {
            const response = await axios.post(`${apiBaseUrl}/register`, formData, {
                withCredentials: true
            });
            console.log('Registration successful:', response.data);
            setIsLoggedIn(true);
            setUser(response.data.user);
            showToast('Registration successful.', 'success');
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            showToast(getErrorMessage(error, 'Registration failed.'), 'error');
            return { success: false, error: error.response?.data || 'Registration failed' };
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${apiBaseUrl}/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
            showToast(getErrorMessage(error, 'Logout failed.'), 'error');
        } finally {
            setIsLoggedIn(false);
            setUser(null);
            showToast('Logged out.', 'info');
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, handleLogin, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
