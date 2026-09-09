export const API_BASE_URL = 'http://q-live.local/api';
export const QUESTION_API_BASE_URL = 'http://q-live.local/api';
export const NOTIFICATION_WS_BASE_URL =
  import.meta.env.VITE_NOTIFICATION_WS_BASE_URL || 'ws://q-live.local';

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  JOIN: '/join',
  SESSION: (code) => `/session/${code}`,
};
