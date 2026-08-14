import { apiClient } from './client';
import { ANSWER_API_BASE_URL } from '../constants';

export const answersApi = {
  submit: (questionId, text) => apiClient(`${ANSWER_API_BASE_URL}/questions/${questionId}/answer/`, {
    method: 'POST',
    body: JSON.stringify({ text })
  }),
  
  get: (questionId) => apiClient(`${ANSWER_API_BASE_URL}/questions/${questionId}/answer/`),
};
