import React, { useEffect, useState } from 'react';
import {
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { SectionKey } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ControlsOverlayProps {
  onTriggerMove: (key: string) => void;
  nearbyLandmark: { sectionKey: SectionKey; title: string } | null;
  onInteract: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  onTriggerMove,
  nearbyLandmark,
  onInteract,
}) => {
  const { t } = useLanguage();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (['W', 'A', 'S', 'D', ' ', 'E'].includes(k)) {
        setActiveKey(k);
      }
      if (k === 'E' && nearbyLandmark) {
        onInteract();
      }
    };
    const handleKeyUp = () => {
      setActiveKey(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyLandmark, onInteract]);

  const handleVirtualKey = (key: string) => {
    setActiveKey(key);
    onTriggerMove(key);
    setTimeout(() => setActiveKey(null), 150);
  };

  return (
    <div
      id="game-controls-overlay"
      className="pointer-events-none absolute bottom-4 sm:bottom-6 inset-x-0 z-20 flex flex-col items-center justify-center gap-2 select-none px-3"
    >
      {/* 1. Proximity Landmark Interactive Action Bar */}
      {nearbyLandmark && (
        <div className="pointer-events-auto animate-bounce mb-1">
          <button
            onClick={() => {
              soundManager.playChimeSound();
              onInteract();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-black text-xs shadow-2xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-pink-500/40"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>[E] {t('Khám phá', 'Inspect')} {nearbyLandmark.title}</span>
          </button>
        </div>
      )}

      {/* 2. On-screen Movement Keys (WASD + Jump) */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Directional pad */}
        <div className="flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl border border-white/60 dark:border-slate-800 shadow-xl">
          {(['W', 'A', 'S', 'D'] as const).map((key) => {
            const isPressed = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => handleVirtualKey(key)}
                className={`w-11 h-11 sm:w-9 sm:h-9 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center ${
                  isPressed
                    ? 'bg-rose-500 text-white shadow-inner scale-95'
                    : 'glass-pill text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Jump Button */}
        <button
          onClick={() => handleVirtualKey(' ')}
          className={`px-4 h-11 sm:h-9 rounded-2xl font-black text-xs glass-panel border border-white/60 dark:border-slate-800 shadow-xl flex items-center gap-1.5 transition-all cursor-pointer ${
            activeKey === ' '
              ? 'bg-rose-500 text-white scale-95'
              : 'text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-700'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Space ({t('Nhảy', 'Jump')})</span>
        </button>
      </div>

      {/* Exploration hint */}
      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 drop-shadow-sm flex items-center gap-2">
        <span>
          {t(
            'Nhấp đất để đi • Kéo chuột xoay góc nhìn • Cuộn phóng to',
            'Click ground to walk • Drag to orbit • Scroll to zoom'
          )}
        </span>
      </div>
    </div>
  );
};
