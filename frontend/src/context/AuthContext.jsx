import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
      const userData = response.data;
      // Ensure the user object in state has the token
      const userWithToken = { ...(userData.user || userData), token: userData.token };
      setUser(userWithToken);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    return response.data;
  };

  const register = async (userData, type = 'citizen') => {
    const endpoint = type === 'citizen' ? '/auth/register/citizen' : '/auth/register/official';
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, userData);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
