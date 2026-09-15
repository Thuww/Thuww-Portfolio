import React, { useState, useEffect } from 'react';
import { Smile, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface EmotesWheelProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export const EmotesWheel: React.FC<EmotesWheelProps> = ({
  isOpen: externalIsOpen,
  onClose,
  onToggle,
}) => {
  const { t } = useLanguage();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [floatingEmotes, setFloatingEmotes] = useState<{ id: number; emoji: string }[]>([]);

  // Sync with external control if provided
  const isMenuOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const emotes = [
    {
      emoji: '❤️',
      labelVi: 'Thả Tim Yêu Thương',
      labelEn: 'Love Heart',
      sound: () => soundManager.playChimeSound(),
    },
    {
      emoji: '🎉',
      labelVi: 'Ăn Mừng Thành Tựu',
      labelEn: 'Celebrate!',
      sound: () => {
        soundManager.playLevelUpSound();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      },
    },
    {
      emoji: '✨',
      labelVi: 'Phép Thuật Ma Thuật',
      labelEn: 'Sparkles Magic',
      sound: () => soundManager.playCoinSound(),
    },
    {
      emoji: '👏',
      labelVi: 'Vỗ Tay Khen Ngợi',
      labelEn: 'Applause',
      sound: () => soundManager.playClickSound(),
    },
    {
      emoji: '💃',
      labelVi: 'Nhảy Múa Vui Vẻ',
      labelEn: 'Dance Happy',
      sound: () => soundManager.playJumpSound(),
    },
    {
      emoji: '🚀',
      labelVi: 'Cất Cánh Sáng Tạo',
      labelEn: 'Rocket Launch',
      sound: () => soundManager.playCoinSound(),
    },
  ];

  const triggerEmote = (emote: (typeof emotes)[0]) => {
    emote.sound();
    const newId = Date.now() + Math.random();
    setFloatingEmotes((prev) => [...prev, { id: newId, emoji: emote.emoji }]);
    setTimeout(() => {
      setFloatingEmotes((prev) => prev.filter((e) => e.id !== newId));
    }, 1800);

    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleToggle = () => {
    soundManager.playClickSound();
    if (onToggle) {
      onToggle();
    } else if (onClose && isMenuOpen) {
      onClose();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div id="playtogether-emotes-hub" className="fixed bottom-20 left-4 z-30 select-none">
      {/* Floating animated emojis over screen */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {floatingEmotes.map((e) => (
          <div
            key={e.id}
            style={{
              left: `${35 + Math.random() * 30}%`,
              bottom: '30%',
            }}
            className="absolute text-5xl animate-bounce duration-1000 filter drop-shadow-lg"
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Emotes Wheel Menu Popup */}
      {isMenuOpen && (
        <div className="absolute bottom-14 left-0 p-2.5 rounded-3xl liquid-glass border border-white/40 dark:border-slate-700/80 shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-75 duration-200 backdrop-blur-2xl">
          {emotes.map((e, i) => (
            <button
              key={i}
              onClick={() => triggerEmote(e)}
              title={t(e.labelVi, e.labelEn)}
              className="w-11 h-11 rounded-2xl bg-white/30 dark:bg-slate-800/60 hover:bg-white/60 dark:hover:bg-slate-700/80 hover:scale-120 active:scale-95 transition-all text-2xl flex items-center justify-center cursor-pointer shadow-sm border border-white/30"
            >
              {e.emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main Emote Wheel Toggle Button */}
      <button
        id="emotes-trigger-btn"
        onClick={handleToggle}
        title={t('Biểu cảm / Emotes nhân vật', 'Character Emotes Wheel')}
        className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-xl shadow-pink-500/30 border border-white/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
      >
        <Smile className="w-5 h-5" />
      </button>
    </div>
  );
};
