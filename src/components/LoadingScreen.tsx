import React, { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Change loading text at different stages
    const textTimeout1 = setTimeout(() => setLoadingText('Loading modules...'), 1000);
    const textTimeout2 = setTimeout(() => setLoadingText('Connecting to AI...'), 2000);
    const textTimeout3 = setTimeout(() => setLoadingText('Almost ready...'), 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(textTimeout1);
      clearTimeout(textTimeout2);
      clearTimeout(textTimeout3);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Background pattern similar to main app */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-4 h-4 border border-slate-600 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 border border-slate-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-slate-600 rotate-45 animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 right-40 w-5 h-5 border border-slate-600 animate-spin" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Main jinshi text with glow effect */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 font-mono text-glow">
          jinshi
          <span className="animate-pulse">_</span>
        </h1>
        
        {/* Loading Experience text */}
        <p className="text-xl text-slate-300 mb-12 font-mono">
          Loading Experience...
        </p>
        
        {/* Progress bar container */}
        <div className="w-80 mx-auto mb-6">
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Dynamic loading text */}
        <p className="text-sm text-slate-500 font-mono animate-pulse">
          {loadingText}
        </p>
        
        {/* Progress percentage */}
        <p className="text-xs text-slate-600 font-mono mt-2">
          {progress}%
        </p>
      </div>
    </div>
  );
}