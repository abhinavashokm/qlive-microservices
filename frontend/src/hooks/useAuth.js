import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { ROUTES } from '../constants';

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token && requireAuth) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (token) {
      authApi.getMe()
        .then(data => setUser(data))
        .catch(() => {
          logout();
          if (requireAuth) navigate(ROUTES.LOGIN);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [requireAuth, navigate]);

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

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate(ROUTES.LOGIN);
  };

  return { user, isLoading, login, signup, logout };
}
