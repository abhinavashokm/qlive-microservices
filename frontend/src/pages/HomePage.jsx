import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSessions } from '../hooks/useSessions';
import { ROUTES } from '../constants';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { sessionsApi } from '../api/sessionsApi';

export default function HomePage() {
  const { user, logout } = useAuth(true);
  const { sessions, isLoading: loadingSessions, fetchMySessions, createSession } = useSessions();
  
  const [createTitle, setCreateTitle] = useState('');
  const [createdSession, setCreatedSession] = useState(null);
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchMySessions();
  }, [user, fetchMySessions]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createTitle.trim()) return;
    setCreateError('');
    setCreatedSession(null);
    setIsCreating(true);
    try {
      const data = await createSession(createTitle);
      setCreatedSession(data);
      setCreateTitle('');
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
      await sessionsApi.validateJoin(joinCode);
      await sessionsApi.join(joinCode);
      navigate(ROUTES.SESSION(joinCode));
    } catch (err) {
      setJoinError('Invalid or expired invite link');
    } finally {
      setIsJoining(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-outfit">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[150px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full mix-blend-screen filter blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar user={user} onLogout={logout} />
        
        <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
            
            <Card className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-zinc-950">Create a Session</h2>
              </div>
              
              {createError && <p className="text-red-400 text-sm mb-4 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{createError}</p>}
              
              <form onSubmit={handleCreate} className="space-y-4 mt-auto">
                <Input 
                  required value={createTitle} onChange={(e) => setCreateTitle(e.target.value)}
                  disabled={isCreating} placeholder="e.g., Engineering All Hands Q&A"
                />
                <div className="flex justify-end mt-4">
                  <Button type="submit" variant="gradient" isLoading={isCreating} className="px-6">Create</Button>
                </div>
              </form>

              {createdSession && (
                <div className="mt-6 p-6 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-center animate-slide-up">
                  <p className="text-sm text-brand-300 font-medium mb-2 uppercase tracking-widest">Share this invite code</p>
                  <p className="text-4xl font-mono font-extrabold tracking-[0.2em] text-zinc-950 mb-6 drop-shadow-lg">{createdSession.invite_code}</p>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="secondary" onClick={() => copyToClipboard(createdSession.invite_code)} className="text-sm py-2 px-6">
                      Copy Link
                    </Button>
                    <Button variant="gradient" onClick={() => navigate(ROUTES.SESSION(createdSession.invite_code))} className="text-sm py-2 px-6">
                      Enter Room
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-zinc-950">Join a Session</h2>
              </div>
              
              {joinError && <p className="text-red-400 text-sm mb-4 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{joinError}</p>}
              
              <form onSubmit={handleJoin} className="space-y-4 mt-auto">
                <Input 
                  required value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  disabled={isJoining} placeholder="INVITE CODE" maxLength={10}
                  className="text-center font-mono tracking-widest text-xl uppercase"
                />
                <div className="flex justify-end mt-4">
                  <Button type="submit" variant="secondary" isLoading={isJoining} className="px-6">Join Room</Button>
                </div>
              </form>
            </Card>
          </div>

          <Card>
            <h2 className="text-xl font-bold text-zinc-950 mb-6">My Sessions</h2>
            {loadingSessions ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-16 px-4 border-2 border-dashed border-black/10 rounded-2xl bg-zinc-100/30">
                <p className="text-zinc-500">You haven't created any sessions yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map(s => (
                  <div 
                    key={s.id} onClick={() => navigate(ROUTES.SESSION(s.invite_code))}
                    className="flex flex-col justify-center p-5 bg-zinc-100/50 border border-black/5 rounded-2xl hover:bg-zinc-200/80 hover:border-brand-500/30 cursor-pointer transition-all shadow-lg group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <h3 className="font-bold text-zinc-900 text-lg group-hover:text-zinc-950 mb-3 truncate relative z-10">{s.title}</h3>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-sm text-zinc-500">Code</span>
                      <Badge variant="info" className="font-mono">{s.invite_code}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
