import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-zinc-400 text-sm font-medium mb-2 ml-1">{label}</label>}
      <input 
        className={`appearance-none bg-zinc-900/50 border rounded-xl w-full py-3.5 px-4 text-zinc-100 placeholder-zinc-600 leading-tight focus:outline-none focus:ring-2 transition-all shadow-inner disabled:bg-zinc-900/80 disabled:text-zinc-500 backdrop-blur-sm ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-white/10 hover:border-white/20 focus:ring-brand-500/30 focus:border-brand-500/50'} ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-400 ml-1 font-medium">{error}</p>}
    </div>
  );
}
