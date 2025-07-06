import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = (userData) => {
    const userInfo = {
      role: userData.role,
      name: userData.name,
      instrument: userData.instrument,
    };
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('userRole', userData.role); // Keep for backward compatibility
    navigate(userData.role === 'admin' ? '/admin' : '/player');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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

export default AuthContext;
