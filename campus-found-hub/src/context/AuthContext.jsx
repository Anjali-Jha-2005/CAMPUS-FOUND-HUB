import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          
          // Initialize Socket.IO connection
          const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            auth: { token }
          });
          setSocket(newSocket);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    
    if (res.data.token) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token: res.data.token }
      });
      setSocket(newSocket);
    }
    return res.data;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    
    if (res.data.token) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token: res.data.token }
      });
      setSocket(newSocket);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (socket) socket.disconnect();
    setSocket(null);
  };

  const updateProfile = async (userData) => {
    const res = await api.put('/auth/updatedetails', userData);
    setUser(res.data.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, socket, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
