import React from 'react';
import { SectionKey } from '../types';
import { soundManager } from '../audio/soundManager';
import { Compass, User, Gamepad2, Sparkles, BookOpen, Send, Map } from 'lucide-react';

interface IslandTravelDockProps {
  activeSection: SectionKey;
  onWarpToSection: (section: SectionKey) => void;
}

interface IslandItem {
  key: SectionKey;
  label: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
}

const ISLANDS: IslandItem[] = [
  {
    key: 'home',
    label: 'Thế Giới Chính (World Map)',
    shortName: 'Bản Đồ',
    icon: <Map className="w-4 h-4" />,
    color: 'from-amber-400 to-orange-500',
  },
  {
    key: 'about',
    label: 'Đảo 01: Hồ Sơ Nhân Vật',
    shortName: 'Hồ Sơ',
    icon: <User className="w-4 h-4" />,
    color: 'from-pink-400 to-rose-500',
  },
  {
    key: 'projects',
    label: 'Đảo 02: Arcade Triển Lãm',
    shortName: 'Dự Án',
    icon: <Gamepad2 className="w-4 h-4" />,
    color: 'from-cyan-400 to-blue-500',
  },
  {
    key: 'skills',
    label: 'Đảo 03: Chòm Sao Kỹ Năng',
    shortName: 'Kỹ Năng',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'from-purple-400 to-indigo-500',
  },
  {
    key: 'journal',
    label: 'Đảo 04: Bản Đồ Hải Trình',
    shortName: 'Hải Trình',
    icon: <BookOpen className="w-4 h-4" />,
    color: 'from-amber-500 to-yellow-600',
  },
  {
    key: 'contact',
    label: 'Đảo 05: Cổng Tín Hiệu Stargate',
    shortName: 'Liên Hệ',
    icon: <Send className="w-4 h-4" />,
    color: 'from-emerald-400 to-teal-500',
  },
];

export const IslandTravelDock: React.FC<IslandTravelDockProps> = ({
  activeSection,
  onWarpToSection,
}) => {
  return (
    <div
      id="island-travel-dock"
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full liquid-glass liquid-specular-edge shadow-2xl select-none max-w-[95vw] overflow-x-auto no-scrollbar transition-all"
    >
      {ISLANDS.map((island) => {
        const isActive = activeSection === island.key;

        return (
          <button
            key={island.key}
            onClick={() => {
              if (activeSection !== island.key) {
                soundManager.playClickSound();
                onWarpToSection(island.key);
              }
            }}
            title={island.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-black transition-all duration-300 cursor-pointer shrink-0 ${
              isActive
                ? `bg-gradient-to-r ${island.color} text-white shadow-lg scale-105 ring-2 ring-white/60 dark:ring-white/20`
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            {island.icon}
            <span className="hidden xs:inline sm:inline">{island.shortName}</span>
          </button>
        );
      })}
    </div>
  );
};
