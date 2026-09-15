import React from 'react';
import { SectionKey } from '../types';
import { soundManager } from '../audio/soundManager';
import { Sparkles, Sun, Moon, Camera, Smile, Gem } from 'lucide-react';

interface DynamicIslandBarProps {
  activeSection: SectionKey;
  isDarkMode: boolean;
  totalXp: number;
  crystalsCount: number;
  totalCrystals: number;
  onOpenPhotoMode: () => void;
  onOpenEmotes: () => void;
}

const SECTION_TITLES: Record<SectionKey, { name: string; icon: string }> = {
  home: { name: 'Thế Giới Chính', icon: '🏝️' },
  about: { name: 'Đảo 01: Vườn Thông Tin', icon: '🌸' },
  projects: { name: 'Đảo 02: Khu Dự Án', icon: '🕹️' },
  skills: { name: 'Đảo 03: Chòm Sao Kỹ Năng', icon: '🔮' },
  journal: { name: 'Đảo 04: Bản Đồ Kinh Nghiệm', icon: '📜' },
  contact: { name: 'Đảo 05: Cổng Liên Hệ', icon: '🛸' },
};

export const DynamicIslandBar: React.FC<DynamicIslandBarProps> = ({
  activeSection,
  isDarkMode,
  totalXp,
  crystalsCount,
  totalCrystals,
  onOpenPhotoMode,
  onOpenEmotes,
}) => {
  const currentIsland = SECTION_TITLES[activeSection] || SECTION_TITLES.home;
  const level = Math.floor(totalXp / 500) + 1;
  const levelProgress = ((totalXp % 500) / 500) * 100;

  return (
    <div
      id="dynamic-island-bar"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full liquid-glass liquid-specular-edge shadow-2xl select-none max-w-[95vw] transition-all"
    >
      {/* Island Indicator Pill */}
      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-white shrink-0">
        <span>{currentIsland.icon}</span>
        <span className="hidden sm:inline font-sans">{currentIsland.name}</span>
      </div>

      <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Level & XP Mini Bar */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950">
          LV.{level}
        </span>
        <div className="hidden xs:block w-14 sm:w-20 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
          <div
            style={{ width: `${levelProgress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-300"
          />
        </div>
      </div>

      <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Star Crystals Collected */}
      <div className="flex items-center gap-1 text-[11px] font-black text-sky-500 dark:text-sky-400">
        <Gem className="w-3.5 h-3.5 fill-current" />
        <span>
          {crystalsCount}/{totalCrystals}
        </span>
      </div>

      <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700" />

      {/* Photo Mode Shortcut Button */}
      <button
        onClick={() => {
          soundManager.playClickSound();
          onOpenPhotoMode();
        }}
        title="Chụp Ảnh Kỷ Niệm (Photo Mode)"
        className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 text-[11px] font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Camera className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Chụp Ảnh</span>
      </button>

      {/* Emotes Trigger Button */}
      <button
        onClick={() => {
          soundManager.playClickSound();
          onOpenEmotes();
        }}
        title="Biểu Cảm Emotes"
        className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 hover:scale-110 transition-transform cursor-pointer"
      >
        <Smile className="w-4 h-4" />
      </button>
    </div>
  );
};
