import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../services/Api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password });
      const { token, role } = response.data;

      await AsyncStorage.setItem('token', token);
      setUser({ username, role });
      
      return { role };  // Return role to handle redirection
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Validate token and set user if valid
        const userRole = 'admin'; // Replace with actual role decoding logic from token
        setUser({ username: 'admin_user', role: userRole });
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
