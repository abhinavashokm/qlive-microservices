import { apiClient } from './client';
import { API_BASE_URL } from '../constants';

export const authApi = {
  login: (credentials) => apiClient(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  signup: (userData) => apiClient(`${API_BASE_URL}/auth/signup/`, {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  getMe: () => apiClient(`${API_BASE_URL}/auth/me/`)
};
