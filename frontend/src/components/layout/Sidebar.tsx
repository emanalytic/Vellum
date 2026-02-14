import React from 'react';
import { LogOut, LayoutDashboard, Settings, ChevronLeft, Smile, Calendar, BarChart3, Archive } from 'lucide-react';
import Logo from '../common/Logo';

interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  activeTab: string;
  onTabChange: (tab: 'journal' | 'calendar' | 'analysis' | 'archive') => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  onSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onTabChange, isOpen, onToggle, onLogout, onSettings }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`fixed left-0 top-0 h-full w-[280px] sm:w-72 bg-white border-r-4 border-ink z-40 transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Tape effect on top */}
        <div className="absolute top-4 -left-2 w-20 h-8 bg-highlighter-pink/30 -rotate-12 pointer-events-none" />
        <div className="absolute top-2 right-4 w-16 h-6 bg-highlighter-yellow/30 rotate-6 pointer-events-none" />

        <div className="flex flex-col h-full p-6 sm:p-8 relative">
          <button 
            onClick={onToggle}
            className="absolute -right-12 top-6 sketch-border bg-white p-2 hover:bg-highlighter-yellow transition-colors"
          >
            <ChevronLeft size={24} className={isOpen ? '' : 'rotate-180'} />
          </button>

          <div className="mb-10">
            <div className="flex items-center gap-3">
              <Logo size={32} />
              <h1 className="font-marker text-2xl sm:text-4xl -rotate-2">
                Vellum
              </h1>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-16 h-16 sketch-border overflow-hidden bg-white mx-auto flex items-center justify-center">
              <Smile className="w-10 h-10 text-highlighter-pink" />
            </div>
            <div className="text-center">
              <h2 className="font-hand text-xl leading-none">
                {user.name}
              </h2>
              <p className="font-sketch text-xs text-ink-light italic mt-1 truncate px-2">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2 pt-6 font-hand text-lg">
            <button 
              onClick={() => { onTabChange('journal'); if (window.innerWidth < 1024) onToggle(); }}
              className={`flex items-center gap-3 w-full text-left p-2 rounded transition-colors group ${activeTab === 'journal' ? 'bg-highlighter-yellow/30 font-bold underline px-3' : 'hover:bg-highlighter-yellow/20'}`}
            >
              <LayoutDashboard size={20} className="group-hover:rotate-6 transition-transform" />
              <span>Tasks</span>
            </button>
            <button 
              onClick={() => { onTabChange('calendar'); if (window.innerWidth < 1024) onToggle(); }}
              className={`flex items-center gap-3 w-full text-left p-2 rounded transition-colors group ${activeTab === 'calendar' ? 'bg-highlighter-yellow/30 font-bold underline px-3' : 'hover:bg-highlighter-yellow/20'}`}
            >
              <Calendar size={20} className="group-hover:-rotate-6 transition-transform" />
              <span>Calendar</span>
            </button>
            <button 
              onClick={() => { onTabChange('analysis'); if (window.innerWidth < 1024) onToggle(); }}
              className={`flex items-center gap-3 w-full text-left p-2 rounded transition-colors group ${activeTab === 'analysis' ? 'bg-highlighter-yellow/30 font-bold underline px-3' : 'hover:bg-highlighter-yellow/20'}`}
            >
              <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
              <span>Analytics</span>
            </button>
             <button 
              onClick={() => { onTabChange('archive'); if (window.innerWidth < 1024) onToggle(); }}
              className={`flex items-center gap-3 w-full text-left p-2 rounded transition-colors group ${activeTab === 'archive' ? 'bg-highlighter-yellow/30 font-bold underline px-3' : 'hover:bg-highlighter-yellow/20'}`}
            >
              <Archive size={20} className="group-hover:animate-bounce transition-transform" />
              <span>Archive</span>
            </button>
          </nav>

          <div className="mt-auto space-y-4 pt-8 border-t border-ink/5">
            <button 
              onClick={() => { onSettings(); if (window.innerWidth < 1024) onToggle(); }}
              className="flex items-center gap-3 w-full text-left p-2 font-hand text-lg hover:bg-paper-bg transition-colors opacity-60 hover:opacity-100"
            >
              <Settings size={20} />
              <span> Settings</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 w-full text-left p-3 font-marker text-xl bg-ink text-white hover:bg-highlighter-pink hover:text-ink transition-all sketch-border"
            >
              <LogOut size={20} />
              <span>Bye</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
