import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedImagePreview) {
      onSendMessage(message.trim(), selectedImagePreview || undefined);
      setMessage('');
      setSelectedImagePreview(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImagePreview(null);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  return (
    <div className="p-6">
      {/* Image Preview */}
      {selectedImagePreview && (
        <div className="mb-4 relative inline-block">
          <img 
            src={selectedImagePreview} 
            alt="Preview" 
            className="max-w-32 max-h-32 rounded-lg border border-slate-600"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Voice Recording Button */}
        <button
          type="button"
          onClick={toggleRecording}
          className={`p-3 rounded-lg transition-colors ${
            isRecording 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
          title={isRecording ? 'Stop recording' : 'Start voice recording'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled || isLoading}
            rows={1}
            className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 max-h-32 overflow-y-auto text-white placeholder-slate-400 transition-all font-mono"
            className="w-full px-4 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 max-h-32 overflow-y-auto !text-white placeholder-slate-400 transition-all font-mono"
            style={{ minHeight: '48px' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={disabled || isLoading || (!message.trim() && !selectedImagePreview)}
          className="flex-shrink-0 bg-blue-500 text-white p-3 rounded-2xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-blue-500 flex items-center justify-center hover:shadow-lg hover:scale-105 group"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}