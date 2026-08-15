import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from './ui/Button';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 glass-panel border-b-0 border-x-0 border-t-0 border-black/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 transition-all">QLive</span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-600 hidden sm:block">
                Hi, <span className="text-zinc-900">{user.full_name || user.username}</span>
              </span>
              <Button variant="ghost" onClick={onLogout} className="px-3 py-1.5 text-sm h-9">
                Log Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
