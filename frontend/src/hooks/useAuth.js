import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../api/authApi';
import { ROUTES } from '../constants';

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState(null);

  // If a token exists, we need to check whether it is valid.
  // If no token exists, we don't need a loading state.
  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem('token')
  );

  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // No token
    if (!token) {
      if (requireAuth) {
        navigate(ROUTES.LOGIN);
      }
      return;
    }

    // Token exists, verify it with the backend
    authApi.getMe()
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [requireAuth, navigate, logout]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);

    localStorage.setItem('token', data.access);

    const u = await authApi.getMe();
    setUser(u);

    return data;
  };

  const signup = async (userData) => {
    const data = await authApi.signup(userData);

    localStorage.setItem('token', data.access);

    const u = await authApi.getMe();
    setUser(u);

    return data;
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout
  };
}