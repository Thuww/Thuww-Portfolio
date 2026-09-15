import React from 'react';
import { SectionKey } from '../types';
import { soundManager } from '../audio/soundManager';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Send, Sparkles } from 'lucide-react';

interface HomeQuickDockProps {
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
  onSelectSection: (section: SectionKey) => void;
  onOpenBadgesModal?: () => void;
  onOpenPhotoMode?: () => void;
  onOpenEmotes?: () => void;
  onOpenHRQuickCV?: () => void;
}

export const HomeQuickDock: React.FC<HomeQuickDockProps> = ({
  onSelectSection,
  onOpenHRQuickCV,
}) => {
  const { t } = useLanguage();

  return (
    <div
      id="home-candidate-status-dock"
      className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-20 pointer-events-auto flex items-center select-none"
    >
      {/* Candidate Identity Status Pill (Bottom-Left) */}
      <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-full liquid-glass border border-white/50 dark:border-slate-800 shadow-2xl backdrop-blur-xl hover:border-pink-400/50 transition-all">
        {/* Avatar with glowing ring */}
        <button
          onClick={() => {
            soundManager.playClickSound();
            onSelectSection('about');
          }}
          title={t('Xem chi tiết Hồ Sơ Ứng Viên', 'View Candidate Profile')}
          className="relative group cursor-pointer focus:outline-hidden"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-pink-400/80 p-0.5 shadow-md group-hover:scale-105 transition-transform bg-gradient-to-tr from-pink-500 to-rose-400">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Lê Thị Minh Thu"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {/* Online green indicator */}
          <span
            className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"
            title={t('Sẵn sàng làm việc', 'Open to work')}
          />
        </button>

        {/* Candidate Summary Information */}
        <div
          onClick={() => {
            soundManager.playClickSound();
            onSelectSection('about');
          }}
          className="flex flex-col text-left cursor-pointer group pr-1"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">
              Lê Thị Minh Thu
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold hidden sm:inline-flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {t('Sẵn sàng làm việc', 'Open to Work')}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
            Frontend Dev • Cử nhân HCMUS (GPA 8.35)
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-white/20 dark:border-slate-700/60">
          {/* HR Fast-Track CV Button */}
          {onOpenHRQuickCV && (
            <button
              onClick={() => {
                soundManager.playLevelUpSound();
                onOpenHRQuickCV();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black text-cyan-500 dark:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              title={t('Xem nhanh CV 30s dành cho HR', '30s Fast-Track CV for Recruiters')}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold hidden md:inline">
                {t('Hồ Sơ HR', 'HR CV')}
              </span>
            </button>
          )}

          {/* Quick Contact Button */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onSelectSection('contact');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-pink-500/20"
            title={t('Liên hệ / Gửi lời nhắn', 'Contact / Message')}
          >
            <Send className="w-3 h-3" />
            <span className="text-[11px] font-bold hidden sm:inline">
              {t('Liên Hệ', 'Contact')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
