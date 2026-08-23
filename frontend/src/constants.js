export const API_BASE_URL = 'http://localhost:8000/api';
export const QUESTION_API_BASE_URL = 'http://localhost:8001/api';
export const NOTIFICATION_WS_BASE_URL =
  import.meta.env.VITE_NOTIFICATION_WS_BASE_URL ||
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:8003`;

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  JOIN: '/join',
  SESSION: (code) => `/session/${code}`,
};
