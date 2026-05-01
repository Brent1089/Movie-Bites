import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const api_url = "http://localhost:5000";

    const handleLogin = async (formData) => {
        try {
            const response = await axios.post(`${api_url}/login`, formData, {
                withCredentials: true
            });
            console.log('Login successful:', response.data);
            setIsLoggedIn(true);
            setUser(response.data.user);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            return { success: false, error: error.response?.data || 'Login failed' };
        }
    };

    const handleRegister = async (formData) => {
        try {
            const response = await axios.post(`${api_url}/register`, formData, {
                withCredentials: true
            });
            console.log('Registration successful:', response.data);
            setIsLoggedIn(true);
            setUser(response.data.user);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            return { success: false, error: error.response?.data || 'Registration failed' };
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${api_url}/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        } finally {
            setIsLoggedIn(false);
            setUser(null);
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

