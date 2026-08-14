import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage({ token }) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Ask questions live. Get them answered.
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          The simplest way to host Q&A sessions and interact with your audience in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={token ? "/sessions/new" : "/login"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition shadow-md"
          >
            Create a Session
          </Link>
          <Link
            to="/join"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg transition shadow-sm border border-gray-200"
          >
            Join a Session
          </Link>
        </div>
      </div>
    </div>
  );
}
