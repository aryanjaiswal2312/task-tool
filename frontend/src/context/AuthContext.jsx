import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('taskly_token');
    const savedUser = localStorage.getItem('taskly_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('taskly_token');
        localStorage.removeItem('taskly_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('taskly_token', token);
    localStorage.setItem('taskly_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await authAPI.signup({ name, email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('taskly_token', token);
    localStorage.setItem('taskly_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('taskly_token');
    localStorage.removeItem('taskly_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('taskly_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
