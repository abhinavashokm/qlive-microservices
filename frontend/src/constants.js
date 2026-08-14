export const API_BASE_URL = 'http://localhost:8000/api';
export const QUESTION_API_BASE_URL = 'http://localhost:8001/api';
export const ANSWER_API_BASE_URL = 'http://localhost:8002/api';

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  JOIN: '/join',
  SESSION: (code) => `/session/${code}`,
};
