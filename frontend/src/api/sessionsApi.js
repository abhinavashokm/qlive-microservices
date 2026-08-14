import { apiClient } from './client';
import { QUESTION_API_BASE_URL } from '../constants';

const BASE = `${QUESTION_API_BASE_URL}/sessions`;

export const sessionsApi = {
  create: (title) => apiClient(`${BASE}/`, {
    method: 'POST',
    body: JSON.stringify({ title })
  }),
  
  getMySessions: () => apiClient(`${BASE}/my/`),
  
  validateJoin: (code) => apiClient(`${BASE}/join/${code}/`),
  
  join: (code) => apiClient(`${BASE}/${code}/join/`, {
    method: 'POST'
  }),
};
