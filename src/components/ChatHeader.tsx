import React from 'react';
import { Bot, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export function ChatHeader({ onClearChat, messageCount }: ChatHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="text-white" size={20} />
        </div>
        <div>
          <h1 className="font-semibold text-gray-800">AI Chat Assistant</h1>
          <p className="text-sm text-gray-500">
            {messageCount > 0 ? `${messageCount} pesan` : 'Mulai percakapan baru'}
          </p>
        </div>
      </div>
      
      {messageCount > 0 && (
        <button
          onClick={onClearChat}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus semua pesan"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}