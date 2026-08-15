import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`glass rounded-3xl p-6 sm:p-8 relative overflow-hidden group ${className}`} {...props}>
      {/* Subtle internal glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
