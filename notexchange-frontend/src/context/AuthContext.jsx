import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('notexchange_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('notexchange_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('notexchange_token');
      if (savedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('notexchange_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Failed to verify stored auth token, clearing session:', err.message);
          // If token expired or server error, retain cached user or reset token if 401
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      const userObj = userData || { email, name: email.split('@')[0] };

      setToken(newToken);
      setUser(userObj);
      localStorage.setItem('notexchange_token', newToken);
      localStorage.setItem('notexchange_user', JSON.stringify(userObj));
      setIsAuthModalOpen(false);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Login failed. Please check credentials.';
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      const userObj = userData || { name, email };

      setToken(newToken);
      setUser(userObj);
      localStorage.setItem('notexchange_token', newToken);
      localStorage.setItem('notexchange_user', JSON.stringify(userObj));
      setIsAuthModalOpen(false);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('notexchange_token');
    localStorage.removeItem('notexchange_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
