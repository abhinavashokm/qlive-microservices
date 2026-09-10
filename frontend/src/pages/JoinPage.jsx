import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinSession } from '../api/sessions';
import { useCallback } from 'react';

export default function JoinPage({ token }) {
  const { inviteCode } = useParams();
  const [code, setCode] = useState(inviteCode || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = useCallback(async (e) => {
    e?.preventDefault();

    setError('');

    if (!code) return;

    try {
      if (!token) {
        navigate('/login', {
          state: { returnTo: `/join/${code}` }
        });
        return;
      }

      await joinSession(code, token);
      navigate(`/session/${code}`);

    } catch (err) {
      setError(err.message);
    }
  }, [code, navigate, token]);

  // Auto-join attempt if URL has a code and we are logged in
  useEffect(() => {
    if (!inviteCode || !token) {
      return;
    }

    const join = async () => {
      setError('');

      try {
        await joinSession(inviteCode, token);
        navigate(`/session/${inviteCode}`);
      } catch (err) {
        setError(err.message);
      }
    };

    join();
  }, [inviteCode, token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join a Session</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleJoin}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 text-center">Enter Invite Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="e.g. A1B2C3"
              maxLength={10}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition"
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
}
