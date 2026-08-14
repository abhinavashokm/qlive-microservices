import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage({ token }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 sm:p-8">
      <div className="max-w-3xl text-center space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Ask questions live. <br className="hidden sm:block" />
            <span className="text-indigo-600">Get them answered.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The simplest way to host Q&A sessions and interact with your audience in real-time. No complicated setup required.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            to={token ? "/home" : "/login"}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/30 text-center"
          >
            Create a Session
          </Link>
          <Link
            to="/join"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-8 rounded-xl transition-all shadow-sm border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 text-center"
          >
            Join a Session
          </Link>
        </div>
      </div>
    </div>
  );
}
