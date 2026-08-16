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
    setQuestions(prev => {
      if (prev.some(q => q.id === data.id)) return prev;
      return [...prev, data];
    });
    return data;
  };



  const upvoteQuestion = async (questionId) => {
    try {
      const data = await questionsApi.vote(questionId);
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, vote_count: data.vote_count, has_voted: true } : q));
    } catch (err) {
      if (err.message && err.message.includes('Already voted')) {
         setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, has_voted: true } : q));
      } else {
         console.error("Upvote failed", err);
      }
    }
  };

  return { questions, setQuestions, isLoading, error, fetchQuestions, askQuestion, upvoteQuestion };
}
