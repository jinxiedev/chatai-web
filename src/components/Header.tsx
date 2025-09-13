import React, { useState, useEffect } from 'react';
import { MessageCircle, User, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

interface HeaderProps {
  onAboutClick: () => void;
  onHomeClick: () => void;
  onProjectsClick: () => void;
  user: any;
  onAuthClick: () => void;
}

export function Header({ onAboutClick, onHomeClick, onProjectsClick, user, onAuthClick }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(`Jakarta ${timeString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div 
          className="font-mono text-lg font-medium text-white cursor-pointer hover:text-slate-300 transition-colors"
          onClick={onHomeClick}
        >
          jinshi
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={onHomeClick}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={onAboutClick}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={onProjectsClick}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Projects
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {currentTime}
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 hidden sm:block font-mono">
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors font-mono"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}