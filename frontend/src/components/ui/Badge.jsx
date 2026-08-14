import React from 'react';

export default function Badge({ children, variant = 'success', className = '' }) {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    info: 'bg-brand-500/10 text-brand-300 border-brand-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]',
    gray: 'bg-zinc-800 text-zinc-300 border-white/5',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <span className={`shrink-0 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border backdrop-blur-md ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
