import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function SignupPage() {
  const [formData, setFormData] = useState({ full_name: '', username: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signup(formData);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Ambient background */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <Card className="w-full max-w-md animate-slide-up z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">QLive</span>
          </Link>
          <h2 className="text-3xl font-bold text-zinc-950 mt-6">Create an account</h2>
          <p className="text-zinc-600 mt-2 text-sm">Join to host your own sessions</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 animate-fade-in text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="full_name" type="text" required value={formData.full_name} onChange={handleChange} disabled={isLoading} />
          <Input label="Username" name="username" type="text" required value={formData.username} onChange={handleChange} disabled={isLoading} />
          <Input label="Password" name="password" type="password" required value={formData.password} onChange={handleChange} disabled={isLoading} />
          
          <div className="mt-8 flex justify-end">
            <Button type="submit" variant="gradient" isLoading={isLoading} className="px-8 text-base">
              Sign Up
            </Button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
          Already have an account? <Link to={ROUTES.LOGIN} className="text-brand-400 hover:text-brand-300 transition-colors">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
