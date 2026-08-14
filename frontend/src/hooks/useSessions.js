import { useState, useCallback } from 'react';
import { sessionsApi } from '../api/sessionsApi';

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMySessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sessionsApi.getMySessions();
      setSessions(data);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSession = async (title) => {
    const data = await sessionsApi.create(title);
    await fetchMySessions();
    return data;
  };

  return { sessions, isLoading, error, fetchMySessions, createSession };
}
