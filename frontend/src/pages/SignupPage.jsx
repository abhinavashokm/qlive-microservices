import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

export default function SignupPage({ setToken }) {
  const [formData, setFormData] = useState({ full_name: '', username: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.username ? 'Username already taken' : 'Signup failed. Check your inputs.');
      }
      setToken(data.access);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">QLive</Link>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-4">Create your account</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 border border-red-100">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
            <input 
              name="full_name" type="text" required value={formData.full_name} onChange={handleChange}
              disabled={isLoading}
              className="appearance-none border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500" 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
            <input 
              name="username" type="text" required value={formData.username} onChange={handleChange}
              disabled={isLoading}
              className="appearance-none border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500" 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input 
              name="password" type="password" required value={formData.password} onChange={handleChange}
              disabled={isLoading}
              className="appearance-none border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-md mt-2 flex justify-center items-center ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign Up'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
}
