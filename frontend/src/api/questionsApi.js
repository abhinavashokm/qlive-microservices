import { apiClient } from './client';
import { QUESTION_API_BASE_URL } from '../constants';

export const questionsApi = {
  create: (inviteCode, text) => apiClient(`${QUESTION_API_BASE_URL}/sessions/${inviteCode}/questions/`, {
    method: 'POST',
    body: JSON.stringify({ text })
  }),
  
  list: (inviteCode) => apiClient(`${QUESTION_API_BASE_URL}/sessions/${inviteCode}/questions/`),
  
  markAnswered: (inviteCode, questionId) => apiClient(`${QUESTION_API_BASE_URL}/sessions/${inviteCode}/questions/${questionId}/answered/`, {
    method: 'PATCH'
  }),
};
