import { apiClient } from './client';
import { QUESTION_API_BASE_URL } from '../constants';

export const questionsApi = {
  create: (inviteCode, text) => apiClient(`${QUESTION_API_BASE_URL}/sessions/${inviteCode}/questions/`, {
    method: 'POST',
    body: JSON.stringify({ text })
  }),
  
  list: (inviteCode) => apiClient(`${QUESTION_API_BASE_URL}/sessions/${inviteCode}/questions/`),
  
  search: (inviteCode, query) => apiClient(`${QUESTION_API_BASE_URL}/sessions/${inviteCode}/questions/search/?q=${encodeURIComponent(query)}`),

  vote: (questionId) => apiClient(`${QUESTION_API_BASE_URL}/questions/${questionId}/vote/`, {
    method: 'POST'
  }),
};
