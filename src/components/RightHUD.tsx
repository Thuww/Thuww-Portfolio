import React, { useState } from 'react';
import { PERSONAL_INFO, BADGES, INSPIRATIONAL_NOTES, WAYPOINTS } from '../data/portfolioData';
import { SectionKey, Waypoint } from '../types';
import { soundManager } from '../audio/soundManager';
import { useLanguage } from '../context/LanguageContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Sliders,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';

interface RightHUDProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  activeSection: SectionKey;
  onSelectSection: (section: SectionKey) => void;
  onOpenBadgesModal: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const RightHUD: React.FC<RightHUDProps> = ({
  isMusicPlaying,
  onToggleMusic,
  activeSection,
  onSelectSection,
  onOpenBadgesModal,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [likedVibe, setLikedVibe] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const [minimapZoom, setMinimapZoom] = useState(1);

  const dailyXpPercent = Math.round((PERSONAL_INFO.dailyXp / PERSONAL_INFO.dailyMaxXp) * 100);

  const handleNextNote = () => {
    soundManager.playClickSound();
    setNoteIndex((prev) => (prev + 1) % INSPIRATIONAL_NOTES.length);
  };

  // If collapsed, display a sleek floating pill button on the right edge
  if (isCollapsed) {
    return (
      <div className="fixed right-2 top-20 sm:top-24 z-40 pointer-events-auto select-none">
        <button
          id="expand-righthud-btn"
          onClick={() => {
            soundManager.playClickSound();
            setIsCollapsed(false);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-l-2xl liquid-glass border-l border-y border-white/60 dark:border-slate-700 shadow-2xl hover:scale-105 active:scale-95 text-xs font-black text-slate-800 dark:text-white transition-all cursor-pointer group"
          title={t('Mở menu cài đặt & tiện ích âm nhạc', 'Expand HUD & Settings')}
        >
          <ChevronLeft className="w-4 h-4 text-pink-500 group-hover:-translate-x-0.5 transition-transform" />
          <Sliders className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-[11px] font-bold">HUD</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      id="right-hud-panel"
      className="pointer-events-none fixed top-16 right-3 sm:right-6 z-40 w-[92vw] sm:w-[320px] max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar flex flex-col gap-3 pb-6 animate-in fade-in slide-in-from-right-4 duration-300"
    >
      {/* 0. Top Bar: Collapse & Quick Audio / Lang Switcher */}
      <div className="pointer-events-auto liquid-glass px-3.5 py-2 rounded-2xl flex items-center justify-between shadow-lg border border-white/50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
            {t('TIỆN ÍCH & HUD', 'HUD & CONTROLS')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language Switch */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              setLanguage(language === 'vi' ? 'en' : 'vi');
            }}
            className="px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold text-[10px] cursor-pointer hover:bg-pink-500/25 transition-all"
            title={t('Đổi ngôn ngữ', 'Toggle language')}
          >
            {language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
          </button>

          {/* Collapse Button */}
          <button
            id="collapse-righthud-btn"
            onClick={() => {
              soundManager.playClickSound();
              setIsCollapsed(true);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg liquid-glass-pill text-[10px] font-black text-slate-700 dark:text-slate-300 hover:text-pink-500 transition-all cursor-pointer"
            title={t('Thu gọn thanh menu để không che nội dung', 'Collapse HUD')}
          >
            <span>{t('Thu gọn', 'Hide')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Character Mini Profile & Daily XP */}
      <div className="pointer-events-auto glass-panel p-4 rounded-3xl flex flex-col gap-3 shadow-xl">
        {/* Profile Card */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 p-0.5 shadow-md shadow-pink-500/20 shrink-0">
            <div className="w-full h-full rounded-2xl bg-slate-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt={PERSONAL_INFO.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-800 dark:text-white">
                {PERSONAL_INFO.name}
              </span>
              <span className="text-xs">🌸</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate leading-snug">
              {t(
                'Cử nhân HCMUS • Frontend Dev & AI',
                'HCMUS Graduate • Frontend Dev & AI'
              )}
            </p>
          </div>
        </div>

        {/* Daily XP */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase">
            <span className="text-slate-500 dark:text-slate-400">{t('ĐIỂM KHÁM PHÁ (DAILY XP)', 'DAILY EXPLORATION XP')}</span>
            <span className="text-rose-500 font-extrabold">
              {PERSONAL_INFO.dailyXp} / {PERSONAL_INFO.dailyMaxXp}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5">
            <div
              style={{ width: `${dailyXpPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 rounded-full transition-all duration-700"
            />
          </div>
        </div>

        {/* Badges Preview */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('HUY HIỆU', 'BADGES')}
            </span>
            <div className="flex items-center gap-1">
              {BADGES.slice(0, 4).map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => {
                    soundManager.playClickSound();
                    onOpenBadgesModal();
                  }}
                  title={badge.title}
                  className="w-6 h-6 rounded-lg glass-pill flex items-center justify-center text-xs hover:scale-110 transition-transform cursor-pointer"
                >
                  {badge.icon}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpenBadgesModal();
            }}
            className="flex items-center text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <span>{t('XEM TẤT CẢ', 'VIEW ALL')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Current Vibe Music Player */}
      <div className="pointer-events-auto glass-panel p-4 rounded-3xl flex flex-col gap-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('NHẠC VIBE CHILL', 'CURRENT VIBE')}
          </span>
          <button
            onClick={() => {
              soundManager.playClickSound();
              setLikedVibe(!likedVibe);
            }}
            className="text-pink-500 hover:scale-110 transition-transform cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${likedVibe ? 'fill-pink-500' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-purple-900 shadow-md shrink-0">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80"
              alt="Lofi Track"
              className="w-full h-full object-cover"
            />
            {isMusicPlaying && (
              <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {t('Chế độ Tập Trung', 'Focus Mode')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              lofi procedural beats
            </div>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => soundManager.playClickSound()}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            id="play-pause-vibe-btn"
            onClick={() => {
              soundManager.playClickSound();
              onToggleMusic();
            }}
            className="p-2.5 rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            {isMusicPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={() => soundManager.playClickSound()}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Interactive World Map / Minimap */}
      <div className="pointer-events-auto glass-panel p-3.5 rounded-3xl flex flex-col gap-2 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('RADAR BẢN ĐỒ 3D', '3D WORLD RADAR')}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimapZoom((z) => Math.min(1.4, z + 0.1))}
              className="p-1 rounded-md glass-pill text-slate-600 dark:text-slate-300 hover:scale-110 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMinimapZoom((z) => Math.max(0.8, z - 0.1))}
              className="p-1 rounded-md glass-pill text-slate-600 dark:text-slate-300 hover:scale-110 cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Minimap Viewport */}
        <div
          id="minimap-canvas"
          className="relative h-28 w-full rounded-2xl overflow-hidden bg-sky-300/40 dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 flex items-center justify-center"
        >
          <div
            style={{ transform: `scale(${minimapZoom})` }}
            className="relative w-full h-full transition-transform duration-300"
          >
            {/* Stylized Island Outlines on Minimap */}
            <div className="absolute top-4 left-6 w-16 h-12 rounded-full bg-emerald-500/30 dark:bg-emerald-600/30 blur-xs" />
            <div className="absolute top-8 right-6 w-20 h-14 rounded-full bg-emerald-500/40 dark:bg-emerald-600/40 blur-xs" />
            <div className="absolute bottom-2 left-12 w-24 h-10 rounded-full bg-emerald-500/35 dark:bg-emerald-600/35 blur-xs" />

            {/* Interactive Pins on Minimap */}
            {WAYPOINTS.map((wp) => {
              const isActive = activeSection === wp.sectionKey;
              const posX = ((wp.position[0] + 16) / 32) * 100;
              const posY = ((-wp.position[2] + 16) / 32) * 100;

              return (
                <button
                  key={wp.id}
                  id={`minimap-pin-${wp.id}`}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  onClick={() => {
                    soundManager.playChimeSound();
                    onSelectSection(wp.sectionKey);
                  }}
                  title={`${wp.number} ${wp.title}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer ${
                    isActive ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                >
                  <span
                    style={{ backgroundColor: wp.color }}
                    className={`block w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-md ${
                      isActive ? 'animate-ping' : ''
                    }`}
                  />
                  <span
                    style={{ backgroundColor: wp.color }}
                    className="absolute inset-1 rounded-full"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Handwritten "NOTE TO SELF" Sticky Note */}
      <div
        id="sticky-note-card"
        onClick={handleNextNote}
        title={t('Nhấp để đổi thông điệp tiếp theo!', 'Click for next inspiration!')}
        className="pointer-events-auto relative p-4 rounded-2xl bg-amber-100 dark:bg-amber-200 text-amber-900 shadow-xl shadow-amber-900/10 rotate-1 hover:rotate-0 hover:scale-102 transition-all cursor-pointer select-none"
      >
        {/* Sticky note tape at top */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/70 backdrop-blur-xs rounded-sm rotate-2 shadow-xs" />

        <div className="flex items-center justify-between text-[11px] font-bold text-amber-800/80 mb-1">
          <span className="flex items-center gap-1 font-caveat text-sm font-black">
            NOTE TO SELF 💖
          </span>
          <span className="text-[9px] uppercase tracking-wider text-amber-700/60">
            {t('Chạm để đổi', 'Tap to cycle')}
          </span>
        </div>

        <p className="font-caveat text-xl sm:text-2xl font-bold leading-snug text-amber-950">
          "{INSPIRATIONAL_NOTES[noteIndex]}"
        </p>
      </div>
    </aside>
  );
};
