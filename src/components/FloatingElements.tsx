import React from 'react';

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-4 h-4 border border-slate-600 rotate-45 animate-pulse opacity-30"></div>
      <div className="absolute top-40 right-20 w-6 h-6 border border-slate-500 rounded-full animate-bounce opacity-20" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-slate-600 rotate-45 animate-ping opacity-25" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-60 right-40 w-5 h-5 border border-slate-600 animate-spin opacity-20" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-60 right-10 w-2 h-2 bg-slate-500 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Large background circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-slate-800 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-slate-700 rounded-full opacity-15 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
    </div>
  );
}