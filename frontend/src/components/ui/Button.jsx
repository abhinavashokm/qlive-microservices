import React from 'react';

export default function Button({ children, variant = 'primary', isLoading, className = '', ...props }) {
  const baseClasses = "font-medium py-3 px-5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 flex justify-center items-center w-full sm:w-auto relative overflow-hidden group";
  
  const variants = {
    primary: "bg-zinc-900 hover:bg-white text-zinc-100 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] focus:ring-black/30",
    gradient: "bg-gradient-to-r from-violet-600 via-brand-500 to-cyan-500 hover:from-violet-500 hover:via-brand-400 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] focus:ring-brand-500/40 border border-black/10",
    secondary: "glass hover:bg-black/10 text-zinc-800 focus:ring-zinc-500/30",
    destructive: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 focus:ring-red-500/30",
    ghost: "hover:bg-black/5 text-zinc-700 hover:text-zinc-950 focus:ring-zinc-500/30"
  };

  const disabledClasses = isLoading || props.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Subtle shine effect on gradient buttons */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none" />
      )}
      
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current opacity-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
}
