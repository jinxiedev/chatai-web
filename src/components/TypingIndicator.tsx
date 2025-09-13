import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="max-w-[80%]">
        <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}