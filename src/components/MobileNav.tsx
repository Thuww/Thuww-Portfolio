import React from 'react';
import { SectionKey } from '../types';
import { soundManager } from '../audio/soundManager';
import { Home, User, Laptop, Wrench, BookOpen, Send, Sparkles } from 'lucide-react';

interface MobileNavProps {
  activeSection: SectionKey;
  onNavigate: (section: SectionKey) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeSection, onNavigate }) => {
  const items: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { key: 'about', label: 'About', icon: <User className="w-4 h-4" /> },
    { key: 'projects', label: 'Projects', icon: <Laptop className="w-4 h-4" /> },
    { key: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" /> },
    { key: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'contact', label: 'Contact', icon: <Send className="w-4 h-4" /> },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden pointer-events-auto fixed bottom-3 inset-x-3 z-30 glass-panel p-2 rounded-2xl flex items-center justify-around shadow-2xl border border-white/60 dark:border-slate-800"
    >
      {items.map((item) => {
        const isActive = activeSection === item.key;
        return (
          <button
            key={item.key}
            id={`mobile-nav-${item.key}`}
            onClick={() => {
              soundManager.playClickSound();
              onNavigate(item.key);
            }}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              isActive
                ? 'text-rose-500 bg-rose-500/15 scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
