import React from 'react';
import { motion } from 'motion/react';
import { SectionKey } from '../types';
import { soundManager } from '../audio/soundManager';
import { useLanguage } from '../context/LanguageContext';
import {
  Gem,
  Smartphone,
  Box,
} from 'lucide-react';

interface NavbarProps {
  activeSection: SectionKey;
  onNavigate: (section: SectionKey) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenConnect: () => void;
  onOpenHRQuickCV?: () => void;
  totalXp?: number;
  crystalsCount?: number;
  totalCrystals?: number;
  onOpenPhotoMode?: () => void;
  onOpenEmotes?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  isMusicPlaying,
  onToggleMusic,
  onOpenConnect,
  onOpenHRQuickCV,
  totalXp = 12850,
  crystalsCount = 0,
  totalCrystals = 5,
  onOpenPhotoMode,
  onOpenEmotes,
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const level = Math.floor(totalXp / 500) + 1;
  const levelProgress = ((totalXp % 500) / 500) * 100;

  const navItems: { key: SectionKey; label: string; icon: string }[] = [
    { key: 'about', label: t('Hồ Sơ', 'Profile'), icon: '🪪' },
    { key: 'projects', label: t('Dự Án', 'Projects'), icon: '🕹️' },
    { key: 'skills', label: t('Kỹ Năng', 'Skills'), icon: '⚡' },
    { key: 'journal', label: t('Hải Trình', 'Journey'), icon: '📜' },
    { key: 'contact', label: t('Dịch Vụ', 'Services'), icon: '🛒' },
  ];

  return (
    <motion.header
      id="main-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="absolute top-3 inset-x-0 z-30 px-3 sm:px-6 pointer-events-none flex items-center justify-between gap-2 max-w-7xl mx-auto"
    >
      {/* Brand & Gamer Level Status (Left) - Clicking returns to 3D World */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        <motion.button
          id="brand-logo-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClickSound();
            onNavigate('home');
          }}
          title={t('Về Bản Đồ 3D Aetheria', 'Return to 3D World')}
          className="flex items-center gap-1.5 group text-left cursor-pointer liquid-glass px-3.5 py-1.5 rounded-full shadow-lg border border-white/50 dark:border-slate-700/60 transition-all"
        >
          <span className="text-lg sm:text-xl font-black font-caveat text-pink-600 dark:text-pink-400">
            Thuww.
          </span>
          <span className="text-xs">💖</span>
        </motion.button>

        {/* Level & Crystal Mini Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass shadow-md text-xs border border-white/40 dark:border-slate-700/50">
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950">
            LV.{level}
          </span>
          <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              style={{ width: `${levelProgress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-1 font-mono font-black text-sky-500 text-[11px] ml-1">
            <Gem className="w-3 h-3 fill-current" />
            <span>
              {crystalsCount}/{totalCrystals}
            </span>
          </div>
        </div>
      </div>

      {/* Center Navigation Pill (Bỏ tab "Bản đồ 3D", cụm các đảo độc lập sang trọng) */}
      <nav
        id="navbar-center-pill"
        className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-full liquid-glass shadow-xl border border-white/50 dark:border-slate-700/60"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.key;
          return (
            <motion.button
              key={item.key}
              id={`nav-${item.key}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.playClickSound();
                onNavigate(item.key);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/40'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Right Area: Dedicated CyberPhone & Setting fast trigger button */}
      <div className="pointer-events-auto flex items-center gap-2 pl-2 sm:pl-4">
        <motion.button
          id="navbar-avatar-studio-btn"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClickSound();
            window.dispatchEvent(new CustomEvent('open-avatar-studio'));
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide text-pink-600 dark:text-pink-300 liquid-glass shadow-md border border-pink-400/50 hover:border-pink-400 transition-all cursor-pointer hover:bg-pink-500/10"
          title={t('Đổi Model 3D Nhân Vật (Citizen 3, Poly Pizza)', 'Custom 3D Character Model (Poly Pizza)')}
        >
          <div className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center">
            <Box className="w-3 h-3" />
          </div>
          <span className="hidden sm:inline">{t('Model 3D', '3D Model')}</span>
        </motion.button>

        <motion.button
          id="navbar-cyberphone-btn"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundManager.playClickSound();
            window.dispatchEvent(new CustomEvent('open-cyberphone'));
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide text-slate-800 dark:text-white liquid-glass shadow-md border border-white/60 dark:border-pink-500/30 transition-all cursor-pointer hover:border-pink-400/80"
          title={t(
            'Mở Điện Thoại Play Together (Bản đồ các đảo & Cài đặt)',
            'Open Play Together CyberPhone (Island Fast Travel & Settings)'
          )}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
            <Smartphone className="w-3 h-3" />
          </div>
          <span className="hidden sm:inline">{t('Điện Thoại', 'CyberPhone')}</span>
        </motion.button>
      </div>
    </motion.header>
  );
};
