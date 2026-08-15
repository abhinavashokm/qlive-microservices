import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../constants';
import { sessionsApi } from '../api/sessionsApi';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    
    try {
      await sessionsApi.validateJoin(inviteCode);
      await sessionsApi.join(inviteCode);
      navigate(ROUTES.SESSION(inviteCode.toUpperCase()));
    } catch (err) {
      setError('Invalid or expired invite link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

      <Card className="w-full max-w-md text-center animate-slide-up z-10">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">QLive</span>
          </Link>
          <h2 className="text-3xl font-bold text-zinc-950 mt-8">Join a Session</h2>
          <p className="text-zinc-600 mt-2 text-sm">Enter the invite code to participate</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 animate-fade-in text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleJoin} className="space-y-6">
          <Input 
            required value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            disabled={isLoading} placeholder="INVITE CODE" maxLength={10}
            className="text-center text-2xl font-mono tracking-[0.3em] uppercase py-5"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="gradient" isLoading={isLoading} className="text-lg py-3 px-8">
              Enter Room
            </Button>
          </div>
        </form>
        
        <div className="mt-8">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors">
            &larr; Back to Dashboard
          </button>
        </div>
      </Card>
    </div>
  );
}
