import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function JoinSessionPage() {
  const { inviteCode: routeInviteCode } = useParams();
  const [inviteCode, setInviteCode] = useState(routeInviteCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!inviteCode.trim()) return;

    setIsLoading(true);
    
    // MOCK API CALL
    // TODO: Call GET /api/sessions/join/<invite_code>/ to validate
    // TODO: Call POST /api/sessions/<invite_code>/join/ to join
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock failure condition for testing
      if (inviteCode === 'INVALID') {
        setError('Invalid or expired invite link');
      } else {
        // Mock success
        navigate(`/session/${inviteCode.toUpperCase()}`);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        <div className="mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">QLive</Link>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-4">Join a Session</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium flex items-center justify-center gap-2 border border-red-100">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleJoin} className="space-y-6">
          <div>
            <input 
              type="text" 
              required 
              value={inviteCode} 
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="appearance-none border border-gray-300 rounded-xl w-full py-4 px-4 text-center text-xl font-mono tracking-widest text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase disabled:bg-gray-50"
              placeholder="INVITE CODE"
              maxLength={10}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md focus:outline-none focus:ring-4 flex justify-center items-center ${isLoading ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-400/30' : 'bg-gray-900 hover:bg-black hover:shadow-lg focus:ring-gray-900/30'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </>
            ) : 'Join Room'}
          </button>
        </form>
        
        <div className="mt-8">
          <button 
            onClick={() => navigate('/home')} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
