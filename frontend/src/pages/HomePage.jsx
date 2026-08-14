import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { createSession, getSessionByInviteCode, joinSession, getMySessions } from '../api/sessions';
import Navbar from '../components/Navbar';

export default function HomePage({ token, setToken }) {
  const [user, setUser] = useState(null);
  const [mySessions, setMySessions] = useState([]);
  
  // Create state
  const [createTitle, setCreateTitle] = useState('');
  const [createdSession, setCreatedSession] = useState(null);
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Join state
  const { inviteCode } = useParams();
  const [joinCode, setJoinCode] = useState(inviteCode || '');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchUserAndSessions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setToken(null);
          navigate('/login');
          return;
        }

        const sessions = await getMySessions(token);
        setMySessions(sessions);
      } catch (err) {
        setToken(null);
        navigate('/login');
      }
    };

    fetchUserAndSessions();
  }, [token, navigate, setToken]);

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createTitle.trim()) return;
    setCreateError('');
    setCreatedSession(null);
    setIsCreating(true);
    try {
      const data = await createSession(createTitle, token);
      setCreatedSession(data);
      setCreateTitle('');
      // Refresh list
      const sessions = await getMySessions(token);
      setMySessions(sessions);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (code) => {
    const link = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(link);
    alert('Invite link copied to clipboard!');
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setJoinError('');
    if (!joinCode.trim()) return;
    setIsJoining(true);
    try {
      await getSessionByInviteCode(joinCode);
      await joinSession(joinCode, token);
      navigate(`/session/${joinCode}`);
    } catch (err) {
      setJoinError('Invalid or expired invite link');
    } finally {
      setIsJoining(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {/* Create Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Create a Session</h2>
            {createError && <p className="text-red-600 text-sm mb-4 font-medium">{createError}</p>}
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  required 
                  value={createTitle} 
                  onChange={(e) => setCreateTitle(e.target.value)}
                  disabled={isCreating}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50"
                  placeholder="Session Title"
                />
              </div>
              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow focus:outline-none focus:ring-4 focus:ring-indigo-500/30 flex justify-center disabled:bg-indigo-400"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </form>

            {createdSession && (
              <div className="mt-6 p-5 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
                <p className="text-sm text-indigo-800 font-medium mb-1">Invite Code</p>
                <p className="text-3xl font-mono font-extrabold tracking-widest text-indigo-900 mb-4">{createdSession.invite_code}</p>
                <div className="space-y-3">
                  <button onClick={() => copyToClipboard(createdSession.invite_code)} className="w-full bg-white text-indigo-700 font-semibold py-2.5 px-4 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm shadow-sm">
                    Copy Invite Link
                  </button>
                  <button onClick={() => navigate(`/session/${createdSession.invite_code}`)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm">
                    Go to Session
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Join Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Join a Session</h2>
            {joinError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2 border border-red-100">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                {joinError}
              </div>
            )}
            
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  required 
                  value={joinCode} 
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  disabled={isJoining}
                  className="w-full px-4 py-3 text-center font-mono tracking-widest text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase disabled:bg-gray-50"
                  placeholder="INVITE CODE"
                  maxLength={10}
                />
              </div>
              <button 
                type="submit" 
                disabled={isJoining}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow focus:outline-none focus:ring-4 focus:ring-gray-900/30 flex justify-center disabled:bg-gray-500"
              >
                {isJoining ? 'Joining...' : 'Join'}
              </button>
            </form>
          </div>
        </div>

        {/* My Sessions List */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">My Sessions</h2>
          {mySessions.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No sessions created</h3>
              <p className="text-gray-500">Get started by creating your first session above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySessions.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => navigate(`/session/${s.invite_code}`)} 
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-colors shadow-sm hover:shadow group"
                >
                  <div className="mb-2 sm:mb-0">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{s.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-sm text-gray-500 flex items-center">
                        Code: <span className="font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded ml-1.5 text-xs font-semibold">{s.invite_code}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full self-start sm:self-auto border border-gray-100">
                    {new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
