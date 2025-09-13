import React from 'react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
          isUser 
            ? 'bg-white/10 backdrop-blur-sm border border-slate-700/50 text-white' 
            : 'bg-slate-700/30 backdrop-blur-sm text-white border border-slate-600/50'
        }`}>
          {message.imageUrl && (
            <img 
              src={message.imageUrl} 
              alt="Attached image" 
              className="max-w-full h-auto rounded-lg mb-2 border border-slate-600/30"
            />
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">{message.content}</p>
        </div>
        <p className={`text-xs text-slate-500 mt-2 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}