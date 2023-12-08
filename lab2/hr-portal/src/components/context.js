import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // Используем !!token для преобразования в булево значение

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [token]); // Используем token в зависимости

  const updateAuth = () => {
    setToken(localStorage.getItem('token') || '');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isLoggedIn, updateAuth }}>
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