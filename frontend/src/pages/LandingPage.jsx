import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-end z-20">
        {!isLoading && (
          user ? (
            <Link to={ROUTES.HOME}>
              <Button variant="secondary">Go to Home</Button>
            </Link>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary">Sign In</Button>
            </Link>
          )
        )}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-brand-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 animate-fade-in">
        
        <div className="mb-8 p-3 bg-black/5 backdrop-blur-md rounded-2xl border border-black/10 shadow-2xl inline-flex animate-slide-up">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
            <svg className="w-8 h-8 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-center tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Welcome to <span className="text-gradient">QLive</span>
        </h1>
        
        <p className="mt-4 text-lg sm:text-xl text-zinc-600 max-w-2xl text-center mx-auto mb-12 font-light leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          The premium platform for interactive live Q&A sessions. Gather questions, upvote the best ones, and answer them in real-time with zero friction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link to={ROUTES.HOME} className="w-full sm:w-auto">
            <Button variant="gradient" className="w-full sm:w-auto text-lg py-4 px-8 rounded-2xl">
              Create a Session
            </Button>
          </Link>
          <Link to={ROUTES.JOIN} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto text-lg py-4 px-8 rounded-2xl">
              Join a Room
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
