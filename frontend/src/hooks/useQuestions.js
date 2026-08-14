import { useState, useCallback } from 'react';
import { questionsApi } from '../api/questionsApi';

export function useQuestions(inviteCode) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!inviteCode) return;
    setIsLoading(true);
    try {
      const data = await questionsApi.list(inviteCode);
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [inviteCode]);

  const askQuestion = async (text) => {
    const data = await questionsApi.create(inviteCode, text);
    setQuestions(prev => [...prev, data]);
    return data;
  };

  const markAnswered = async (questionId) => {
    await questionsApi.markAnswered(inviteCode, questionId);
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, is_answered: true } : q));
  };

  return { questions, setQuestions, isLoading, error, fetchQuestions, askQuestion, markAnswered };
}
