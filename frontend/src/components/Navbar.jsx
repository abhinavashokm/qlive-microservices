import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="text-xl font-bold text-indigo-600 tracking-tight">
              QLive
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.full_name}
              </span>
            )}
            
            {onLogout && (
              <button 
                onClick={onLogout}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
