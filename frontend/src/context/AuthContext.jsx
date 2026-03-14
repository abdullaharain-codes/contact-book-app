import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user,      setUser]      = useState(null);
  const [token,     setToken]     = useState(() => localStorage.getItem('token'));
  const [loading,   setLoading]   = useState(true);
  const [authError, setAuthError] = useState('');

  const saveToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // ── Verify token on mount ──────────────────────────────
  useEffect(() => {
    const verifyToken = async () => {
      const stored = localStorage.getItem('token');
      if (!stored) { setLoading(false); return; }
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` }
        });
        setUser(res.data.user);
        setToken(stored);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  // ── Register ───────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setAuthError('');
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
      saveToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // ── Login ──────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setAuthError('');
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      saveToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.error || 'Invalid email or password';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────
  const logout = useCallback(() => { clearAuth(); }, []);

  return (
    <AuthContext.Provider value={{
      user, token, loading, authError, setAuthError,
      register, login, logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;