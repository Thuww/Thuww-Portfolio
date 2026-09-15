import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../audio/soundManager';
import { useLanguage } from '../context/LanguageContext';
import { SectionKey } from '../types';
import {
  Smartphone,
  MapPin,
  Compass,
  SlidersHorizontal,
  X,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Camera,
  Smile,
  Award,
  FileText,
  ShoppingBag,
  Sparkles,
  Bot,
  Wifi,
  BatteryCharging,
  Globe,
  Navigation,
  Layers,
  ChevronRight,
  Box,
} from 'lucide-react';

interface RightControlCenterProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenPhotoMode: () => void;
  onOpenEmotes: () => void;
  onOpenBadgesModal: () => void;
  onOpenHRQuickCV: () => void;
  onOpenAvatarStudio?: () => void;
  onNavigate: (section: SectionKey) => void;
  activeSection: SectionKey;
  isOpenControlled?: boolean;
  onCloseControlled?: () => void;
}

export const RightControlCenter: React.FC<RightControlCenterProps> = ({
  isDarkMode,
  onToggleDarkMode,
  isMusicPlaying,
  onToggleMusic,
  onOpenPhotoMode,
  onOpenEmotes,
  onOpenBadgesModal,
  onOpenHRQuickCV,
  onOpenAvatarStudio,
  onNavigate,
  activeSection,
  isOpenControlled,
  onCloseControlled,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalIsOpen;

  const setIsOpen = (val: boolean) => {
    if (onCloseControlled && !val) {
      onCloseControlled();
    }
    setInternalIsOpen(val);
  };

  const { language, setLanguage, t } = useLanguage();
  const phoneRef = useRef<HTMLDivElement>(null);

  // Active Tab inside the CyberPhone: 'map' | 'settings' | 'apps'
  const [activeTab, setActiveTab] = useState<'map' | 'settings' | 'apps'>('map');

  // Digital clock
  const [currentTime, setCurrentTime] = useState('10:24');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Global event listener to open phone from anywhere (header, dock, shortcut)
  useEffect(() => {
    const handleOpenPhone = (e?: Event) => {
      soundManager.playClickSound();
      setIsOpen(true);
      const customEvt = e as CustomEvent<{ tab?: 'map' | 'settings' | 'apps' }>;
      if (customEvt?.detail?.tab) {
        setActiveTab(customEvt.detail.tab);
      } else {
        setActiveTab('map');
      }
    };
    window.addEventListener('open-cyberphone', handleOpenPhone);
    return () => window.removeEventListener('open-cyberphone', handleOpenPhone);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard shortcut: 'M' for Map, 'P' for Phone, 'Escape' to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M' || e.key === 'p' || e.key === 'P') {
        soundManager.playClickSound();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // List of all islands in Aetheria with their visual identity
  const ISLANDS: {
    key: SectionKey;
    nameVi: string;
    nameEn: string;
    badgeVi: string;
    badgeEn: string;
    icon: string;
    color: string;
    glow: string;
    descVi: string;
    descEn: string;
  }[] = [
    {
      key: 'home',
      nameVi: 'Thế Giới Chính • Aetheria',
      nameEn: 'Main World • Aetheria',
      badgeVi: 'Thế giới mở 3D',
      badgeEn: '3D Open World',
      icon: '🌍',
      color: 'from-sky-400 to-blue-600',
      glow: 'shadow-sky-500/30',
      descVi: 'Khám phá thế giới đảo bay, thu thập tinh thể & điều khiển nhân vật',
      descEn: 'Explore floating archipelago, collect star crystals & roam freely',
    },
    {
      key: 'about',
      nameVi: 'Đảo 01: Vườn Sáng Tạo (Atelier)',
      nameEn: 'Island 01: Creative Garden (Atelier)',
      badgeVi: 'Hồ Sơ & Mindset',
      badgeEn: 'Profile & Mindset',
      icon: '🪪',
      color: 'from-pink-500 to-rose-600',
      glow: 'shadow-pink-500/30',
      descVi: 'Thẻ định danh ứng viên HCMUS, triết lý làm nghề & đổi class avatar',
      descEn: 'Candidate ID badge, development philosophy & class switch',
    },
    {
      key: 'projects',
      nameVi: 'Đảo 02: Khu Trò Chơi (Arcade)',
      nameEn: 'Island 02: Cyber Arcade',
      badgeVi: 'Dự Án & Live Dev',
      badgeEn: 'Projects & Live Dev',
      icon: '🕹️',
      color: 'from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/30',
      descVi: 'Studio phòng phát sóng 4K 60FPS, dự án Web & Deep Learning VTON',
      descEn: 'Live broadcast studio 4K 60FPS, Web and Deep Learning projects',
    },
    {
      key: 'skills',
      nameVi: 'Đảo 03: Hải Đăng Kỹ Năng (Spire)',
      nameEn: 'Island 03: Skills Spire',
      badgeVi: 'Radar & Ma Trận',
      badgeEn: 'Radar & Matrix',
      icon: '⚡',
      color: 'from-cyan-400 to-blue-500',
      glow: 'shadow-cyan-500/30',
      descVi: 'Ma trận trang bị công nghệ React/Next, Radar năng lực có Pin Map',
      descEn: 'Tech inventory matrix, competency radar with interactive pin maps',
    },
    {
      key: 'journal',
      nameVi: 'Đảo 04: Bản Đồ Hải Trình (Expedition)',
      nameEn: 'Island 04: Sea Chart Expedition',
      badgeVi: 'Dấu Mốc & Hoạt Động',
      badgeEn: 'Milestones & Impact',
      icon: '📜',
      color: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-500/30',
      descVi: 'Hải đồ cổ giấy da thuộc, thời tiết Cực quang & hoạt động VietHope',
      descEn: 'Ancient parchment sea chart, Aurora weather & VietHope impact',
    },
    {
      key: 'contact',
      nameVi: 'Đảo 05: Cổng Tín Hiệu (Stargate)',
      nameEn: 'Island 05: Signal Stargate',
      badgeVi: 'Báo Giá & Dịch Vụ',
      badgeEn: 'Pricing & Services',
      icon: '🛒',
      color: 'from-emerald-400 to-teal-600',
      glow: 'shadow-emerald-500/30',
      descVi: 'Bảng giá dịch vụ phát triển Web/AI, đặt lịch phỏng vấn & kết nối',
      descEn: 'Service pricing matrix, booking interview & collaboration hub',
    },
  ];

  const handleHopIsland = (target: SectionKey) => {
    soundManager.playClickSound();
    setIsOpen(false);
    onNavigate(target);
  };

  return (
    <>
      {/* ─── FLOATING SMARTPHONE HUD TRIGGER (Game-like Play Together HUD button) ─── */}
      <div
        id="cyberphone-header-fixed-trigger"
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 pointer-events-auto select-none"
      >
        <motion.button
          id="open-cyberphone-pill-btn"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            soundManager.playClickSound();
            if (!isOpen) {
              setActiveTab('map');
            }
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full liquid-glass border shadow-2xl transition-all cursor-pointer backdrop-blur-2xl ${
            isOpen
              ? 'bg-pink-500 text-white border-pink-400 shadow-pink-500/40 scale-105'
              : 'border-pink-500/40 dark:border-pink-500/50 text-slate-800 dark:text-slate-100 hover:border-pink-400 bg-slate-900/40'
          }`}
          title={t(
            'Mở Điện Thoại Play Together (Bản đồ dịch chuyển & Cài đặt)',
            'Open Play Together CyberPhone (Fast Travel Map & Settings)'
          )}
        >
          {/* Glowing Smartphone Icon */}
          <div
            className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${
              isOpen
                ? 'bg-white text-pink-600 shadow-sm'
                : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 shadow-md shadow-pink-500/50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight leading-none text-slate-900 dark:text-white group-hover:text-pink-400">
              {t('Bản Đồ Đảo', 'Island Map')}
            </span>
            <span className="text-[10px] font-mono text-pink-500 dark:text-pink-400 font-bold leading-tight mt-0.5">
              {t('Phím M / P', 'Press M / P')}
            </span>
          </div>

          {/* Mini Music Visualizer */}
          {isMusicPlaying && (
            <div className="flex items-center gap-0.5 ml-1" title="Lo-Fi On">
              <span className="w-0.5 h-3 bg-pink-500 rounded-full animate-pulse [animation-duration:600ms]" />
              <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-pulse [animation-duration:400ms]" />
              <span className="w-0.5 h-3.5 bg-rose-500 rounded-full animate-pulse [animation-duration:800ms]" />
            </div>
          )}
        </motion.button>
      </div>

      {/* ─── THE PLAY TOGETHER SMARTPHONE POPUP MODAL ─── */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="cyberphone-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md select-none"
          >
            <motion.div
              ref={phoneRef}
              id="playtogether-phone-device"
              initial={{ scale: 0.85, opacity: 0, y: 35 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 35, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="relative w-full max-w-[420px] max-h-[92vh] sm:max-h-[85vh] rounded-[44px] liquid-glass border-4 border-white/70 dark:border-pink-500/40 shadow-[0_25px_60px_-15px_rgba(236,72,153,0.3)] backdrop-blur-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 ring-1 ring-white/40"
            >
              {/* 1. SMARTPHONE STATUS BAR & DYNAMIC ISLAND */}
              <div className="relative pt-3 px-6 pb-2 flex items-center justify-between border-b border-white/20 dark:border-slate-800/80 bg-white/20 dark:bg-slate-900/30">
                {/* Time */}
                <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-tight text-slate-900 dark:text-white">
                  <span>{currentTime}</span>
                </div>

                {/* Dynamic Island / Notch */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-300">
                    AETHERIA OS
                  </span>
                </div>

                {/* Signal, WiFi, Battery & Close */}
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="flex items-center gap-0.5 font-mono text-[10px] font-bold">
                    <span>98%</span>
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setIsOpen(false);
                    }}
                    className="p-1 rounded-full hover:bg-white/40 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ml-1"
                    title={t('Đóng điện thoại', 'Close Phone')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. PHONE NAVIGATION TABS (Bản Đồ / Cài Đặt / Ứng Dụng) */}
              <div className="p-2 border-b border-white/20 dark:border-slate-800/80 bg-white/10 dark:bg-slate-900/20">
                <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white/30 dark:bg-slate-900/60 border border-white/20 dark:border-slate-800">
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setActiveTab('map');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'map'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-pink-500'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('Bản Đồ Đảo', 'Island Map')}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setActiveTab('settings');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-pink-500'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{t('Cài Đặt', 'Settings')}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setActiveTab('apps');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'apps'
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-pink-500'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t('Ứng Dụng', 'Apps')}</span>
                  </button>
                </div>
              </div>

              {/* 3. PHONE MAIN SCREEN CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar space-y-4">
                {/* ═══════════ TAB 1: BẢN ĐỒ VỆ TINH & DỊCH CHUYỂN NHANH ═══════════ */}
                {activeTab === 'map' && (
                  <motion.div
                    key="tab-map"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-pink-500 animate-spin-slow" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                          {t('Dịch Chuyển Tức Thời Đến Đảo', 'Instant Fast-Travel Map')}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-pink-500">
                        {t('Chạm để qua đảo ngay', 'Tap to jump instantly')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {ISLANDS.map((island) => {
                        const isCurrent = activeSection === island.key;
                        return (
                          <motion.button
                            key={island.key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleHopIsland(island.key)}
                            className={`w-full p-3 rounded-2xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer border ${
                              isCurrent
                                ? 'bg-pink-500/15 border-pink-400/70 shadow-md shadow-pink-500/15 ring-2 ring-pink-500/30'
                                : 'bg-white/40 dark:bg-slate-900/50 border-white/20 dark:border-slate-800 hover:border-pink-400/40 hover:bg-white/60 dark:hover:bg-slate-900/80'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Island Icon Orb */}
                              <div
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm bg-gradient-to-tr ${island.color} text-white shrink-0`}
                              >
                                <span>{island.icon}</span>
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                                    {language === 'vi' ? island.nameVi : island.nameEn}
                                  </span>
                                  {isCurrent && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black tracking-wide uppercase shadow-xs animate-pulse">
                                      {t('📍 ĐANG Ở ĐÂY', '📍 YOU ARE HERE')}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                                  {language === 'vi' ? island.descVi : island.descEn}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 text-slate-400 group-hover:text-pink-500">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ═══════════ TAB 2: CÀI ĐẶT HỆ THỐNG ═══════════ */}
                {activeTab === 'settings' && (
                  <motion.div
                    key="tab-settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-4"
                  >
                    {/* 1. Language Toggle */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t('Ngôn ngữ hệ thống', 'System Language')}
                      </span>
                      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/30 dark:bg-slate-900/60 border border-white/20 dark:border-slate-800">
                        <button
                          onClick={() => {
                            soundManager.playClickSound();
                            setLanguage('vi');
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            language === 'vi'
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                              : 'text-slate-600 dark:text-slate-300 hover:text-pink-500'
                          }`}
                        >
                          <span>🇻🇳</span>
                          <span>Tiếng Việt</span>
                        </button>
                        <button
                          onClick={() => {
                            soundManager.playClickSound();
                            setLanguage('en');
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            language === 'en'
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                              : 'text-slate-600 dark:text-slate-300 hover:text-pink-500'
                          }`}
                        >
                          <span>🇬🇧</span>
                          <span>English</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Audio & Theme Dual Cards */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Lofi Music Tile */}
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          onToggleMusic();
                        }}
                        className={`p-3.5 rounded-2xl flex flex-col justify-between items-start gap-2 border transition-all cursor-pointer text-left ${
                          isMusicPlaying
                            ? 'bg-pink-500/15 border-pink-400/50 shadow-md shadow-pink-500/10'
                            : 'bg-white/30 dark:bg-slate-900/50 border-white/20 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isMusicPlaying
                              ? 'bg-pink-500 text-white shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {isMusicPlaying ? (
                            <Volume2 className="w-4 h-4 animate-pulse" />
                          ) : (
                            <VolumeX className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-black block text-slate-900 dark:text-white">
                            {t('Nhạc Lofi', 'Lofi Beats')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {isMusicPlaying ? t('Đang phát', 'Playing') : t('Đang tắt', 'Muted')}
                          </span>
                        </div>
                      </button>

                      {/* Dark/Light Mode Tile */}
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          onToggleDarkMode();
                        }}
                        className="p-3.5 rounded-2xl flex flex-col justify-between items-start gap-2 bg-white/30 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer text-left"
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isDarkMode
                              ? 'bg-indigo-600 text-white'
                              : 'bg-amber-400 text-slate-950'
                          }`}
                        >
                          {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="text-xs font-black block text-slate-900 dark:text-white">
                            {isDarkMode ? t('Giao diện Đêm', 'Dark Mode') : t('Giao diện Ngày', 'Light Mode')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {t('Chạm để đổi', 'Tap to switch')}
                          </span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ═══════════ TAB 3: ỨNG DỤNG NHANH & TIỆN ÍCH ═══════════ */}
                {activeTab === 'apps' && (
                  <motion.div
                    key="tab-apps"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-3"
                  >
                    {/* Navi AI Chatbot Trigger */}
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        setIsOpen(false);
                        const chatBtn = document.getElementById('ai-chatbot-toggle-btn');
                        if (chatBtn) chatBtn.click();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-rose-500/15 border border-purple-400/40 hover:scale-102 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-purple-400 dark:text-purple-300 block">
                            {t('Trợ Lý AI Navi Guide', 'Navi AI Smart Guide')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {t('Hỏi đáp về kỹ năng, kinh nghiệm & liên hệ', 'Ask about skills & background')}
                          </span>
                        </div>
                      </div>
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </button>

                    {/* Fast-Track CV for Recruiters */}
                    <button
                      onClick={() => {
                        soundManager.playLevelUpSound();
                        setIsOpen(false);
                        onOpenHRQuickCV();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-400/40 hover:scale-102 transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-xs">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-cyan-400 block">
                            {t('Xem Nhanh CV 30 Giây', '30-Second Fast-Track CV')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {t('Dành cho HR & Nhà tuyển dụng', 'For HR & Recruiters')}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    </button>

                    {/* Avatar Studio / 3D Model Customizer */}
                    {onOpenAvatarStudio && (
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIsOpen(false);
                          onOpenAvatarStudio();
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-amber-500/15 border border-pink-400/40 hover:scale-102 transition-all cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                            <Box className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-pink-400 block">
                              {t('Avatar Studio (Đổi Model 3D)', 'Avatar Studio (Custom 3D Model)')}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {t('Tải file GLB Citizen 3, Poly Pizza, Mixamo...', 'Upload Citizen 3 GLB, Poly Pizza, Mixamo...')}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-pink-400" />
                      </button>
                    )}

                    {/* Grid of Photo, Emotes, Badges */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIsOpen(false);
                          onOpenPhotoMode();
                        }}
                        className="p-3 rounded-2xl bg-white/30 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800 hover:border-pink-400/40 hover:scale-102 flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center"
                      >
                        <Camera className="w-5 h-5 text-pink-500" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {t('Chụp ảnh', 'Photo')}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIsOpen(false);
                          onOpenEmotes();
                        }}
                        className="p-3 rounded-2xl bg-white/30 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800 hover:border-amber-400/40 hover:scale-102 flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center"
                      >
                        <Smile className="w-5 h-5 text-amber-500" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {t('Biểu cảm', 'Emotes')}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIsOpen(false);
                          onOpenBadgesModal();
                        }}
                        className="p-3 rounded-2xl bg-white/30 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800 hover:border-cyan-400/40 hover:scale-102 flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center"
                      >
                        <Award className="w-5 h-5 text-cyan-400" />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {t('Huy hiệu', 'Badges')}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 4. SMARTPHONE HOME INDICATOR BAR */}
              <div className="py-2.5 flex justify-center bg-white/10 dark:bg-slate-900/30 border-t border-white/10 dark:border-slate-800/60">
                <div
                  onClick={() => setIsOpen(false)}
                  className="w-28 h-1 bg-white/40 dark:bg-slate-600 rounded-full cursor-pointer hover:bg-pink-500 transition-colors"
                  title={t('Gạt lên để đóng điện thoại', 'Swipe up to close')}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
