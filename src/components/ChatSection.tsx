import React, { useState, useEffect, useRef } from 'react';
import { LogOut } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ModelSelector } from './ModelSelector';
import { AuthModal } from './AuthModal';
import { chatWithAI, getAvailableModels } from '../services/aiService';
import { authService, AuthUser } from '../services/authService';
import { firestoreChatService } from '../services/firestoreChatService';
import { Message } from '../types/chat';

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const unsubscribeMessages = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribeAuth = authService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // User is logged in, listen to their messages
        if (unsubscribeMessages.current) {
          unsubscribeMessages.current();
        }
        
        unsubscribeMessages.current = firestoreChatService.onMessagesChange(
          authUser.uid,
          (messages) => {
            setMessages(messages);
            prevMessageCountRef.current = messages.length;
          }
        );
      } else {
        // User is logged out, clear messages and show auth modal
        setMessages([]);
        prevMessageCountRef.current = 0;
        setShowAuthModal(true);
        
        if (unsubscribeMessages.current) {
          unsubscribeMessages.current();
          unsubscribeMessages.current = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMessages.current) {
        unsubscribeMessages.current();
      }
    };
  }, []);

  useEffect(() => {
    // Only scroll if new messages were added AND user is near bottom
    if (messages.length > prevMessageCountRef.current) {
      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        const { scrollHeight, scrollTop, clientHeight } = chatContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        // Only auto-scroll if user is near the bottom (within 100px)
        if (isNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (isLoading || (!content.trim() && !imageUrl) || !user) return;

    // Clear any previous API errors
    setApiError(null);
    setIsLoading(true);

    try {
      // Add user message to Firestore
      await firestoreChatService.addMessage(user.uid, {
        role: 'user',
        content,
        imageUrl: imageUrl ?? null
      });

      const response = await chatWithAI(content, {
        selectedModel,
        imageUrl,
        chatId: user.uid,
        senderId: user.uid
      });

      // Add AI response to Firestore
      await firestoreChatService.addMessage(user.uid, {
        role: 'assistant',
        content: response
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle rate limit errors specifically
      if (error.isRateLimitError) {
        const modelInfo = error.modelUsed ? ` (${error.modelUsed})` : '';
        setApiError(
          `API usage limit reached${modelInfo}. Please wait a few minutes before trying again, or try switching to a different model.`
        );
      } else {
        // Handle other errors
        setApiError(
          `Failed to send message: ${error.message}. Please try again or switch to a different model.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (user) {
      firestoreChatService.clearMessages(user.uid);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <section id="chat" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="border-b border-slate-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white font-mono">
                    Chat with Jinshi AI
                  </h2>
                  <p className="text-sm text-slate-400 font-mono">
                    {user ? (
                      messages.length > 0 ? `${messages.length} messages` : 'Start a new conversation'
                    ) : (
                      'Please sign in to continue'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {user && (
                  <>
                    <span className="text-sm text-slate-400 font-mono mr-2">
                      {user.email}
                    </span>
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 font-mono"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Chat
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 font-mono"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {user && (
              <ModelSelector
                models={getAvailableModels()}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            )}
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="h-96 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
          >
            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-red-400 text-sm font-mono leading-relaxed">
                      {apiError}
                    </p>
                    <button
                      onClick={() => setApiError(null)}
                      className="mt-2 text-xs text-red-300 hover:text-red-200 transition-colors font-mono underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!user ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full mx-auto mb-4 flex items-center justify-center border border-slate-700">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg font-mono mb-2">
                  Sign in to start chatting
                </p>
                <p className="text-slate-500 text-sm font-mono mb-6">
                  Your conversations will be saved securely
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-all duration-200 border border-slate-700"
                >
                  Sign In / Sign Up
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full mx-auto mb-4 flex items-center justify-center border border-slate-700">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg font-mono">
                  Start a conversation with AI
                </p>
                <p className="text-slate-500 text-sm mt-2 font-mono">
                  Ask me anything, I'm here to help!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
            
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-800/50">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              disabled={!user}
            />
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </section>
  );
}