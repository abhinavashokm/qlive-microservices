import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../api/sessions';

export default function CreateSessionPage({ token }) {
  const [title, setTitle] = useState('');
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await createSession(title, token);
      setSession(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const inviteLink = session ? `${window.location.origin}/join/${session.invite_code}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Session</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
        
        {!session ? (
          <form onSubmit={handleCreate}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Session Title</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Weekly AMA"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Create
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-800">
              <p className="font-semibold mb-2">Session created successfully!</p>
              <p className="text-sm mb-1">Invite Code:</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{session.invite_code}</p>
            </div>
            <button 
              onClick={copyToClipboard}
              className="w-full mb-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded border transition"
            >
              Copy Invite Link
            </button>
            <button 
              onClick={() => navigate(`/session/${session.invite_code}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Go to Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
