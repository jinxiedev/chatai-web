import React, { useEffect, useState } from 'react';

interface HeroSectionProps {
  onStartChat: () => void;
}

export function HeroSection({ onStartChat }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
      <div className="text-left max-w-4xl mx-auto relative z-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Hello, I'm{' '}
            <span className="relative text-glow">
              jinshi
              <span className="absolute -right-4 top-0 w-1 h-full bg-white animate-pulse"></span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-8 font-light max-w-2xl">
            AI Chat Assistant & Interactive Experience
          </p>
          
          <p className="text-lg text-slate-300 mb-12 max-w-2xl leading-relaxed">
            I create clean, minimal, and functional AI chat experiences with{' '}
            <span className="text-white font-medium">attention to detail</span>{' '}
            and a focus on user-centered design.
          </p>
          
          <button
            onClick={onStartChat}
            className="group inline-flex items-center px-8 py-4 bg-white text-black font-medium rounded-full transition-all duration-300 hover:bg-slate-200 hover:shadow-lg hover:scale-105"
          >
            Start Chat
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-slate-500 text-sm mb-2">Scroll Down</p>
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}