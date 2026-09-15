import React, { useState } from 'react';
import { Sparkles, HelpCircle, Check, Award } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface MiniGameProps {
  collectedCrystals: boolean[];
  onHintRequested: (hintText: string) => void;
}

export const MiniGame: React.FC<MiniGameProps> = ({
  collectedCrystals,
  onHintRequested,
}) => {
  const { t } = useLanguage();
  const [showHintModal, setShowHintModal] = useState(false);
  const collectedCount = collectedCrystals.filter(Boolean).length;
  const isCompleted = collectedCount === 5;

  const HINTS_VI = [
    'Gần đỉnh tháp lâu đài màu hồng cao nhất trên hòn đảo bên trái.',
    'Phía trên mái vòm công nghệ ba chiều phát sáng của tòa nhà Dự Án.',
    'Tại đỉnh trụ đá trên hòn đảo xa nhất bên phải.',
    'Ẩn mình gần mỏm đá vách đứng cạnh khu vực Nhật Ký.',
    'Nằm ngay trên gờ cỏ phía trước gần nhân vật thám hiểm.',
  ];

  const HINTS_EN = [
    'Near the tall pink castle spire on the left island.',
    'Over the glowing holographic roof of the Projects Tech building.',
    'At the apex of the citadel pillars on the far-right island.',
    'Perched near the rocky cliffside by the Journal archive.',
    'Resting on the grassy foreground ledge right near the explorer character.',
  ];

  const handleShowHint = () => {
    soundManager.playClickSound();
    const nextUncollectedIndex = collectedCrystals.findIndex((c) => !c);
    if (nextUncollectedIndex !== -1) {
      onHintRequested(
        `💎 ${t('Gợi ý:', 'Hint:')} ${t(
          HINTS_VI[nextUncollectedIndex],
          HINTS_EN[nextUncollectedIndex]
        )}`
      );
    } else {
      onHintRequested(
        t(
          '🎉 Bạn đã thu thập đủ 5 Viên Ngọc Tinh Tú! Bạn xứng danh Bậc Thầy Thám Hiểm Đảo!',
          '🎉 You have gathered all 5 Star Crystals! You are a certified Island Master!'
        )
      );
    }
  };

  return (
    <div
      id="mini-game-quest-tracker"
      className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-pink-500/30 shadow-lg text-xs"
    >
      <span className="font-black text-rose-500 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        {t('Tìm Ngọc Tinh Tú:', 'Crystal Quest:')}
      </span>

      <div className="flex items-center gap-1">
        {collectedCrystals.map((isCollected, idx) => (
          <span
            key={idx}
            title={
              isCollected
                ? t(`Đã tìm thấy ngọc #${idx + 1}!`, `Crystal #${idx + 1} Found!`)
                : t(`Ngọc #${idx + 1} đang ẩn giấu`, `Crystal #${idx + 1} Hidden`)
            }
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
              isCollected
                ? 'bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-xs'
                : 'bg-slate-300/50 dark:bg-slate-700/50 text-slate-400'
            }`}
          >
            {isCollected ? <Check className="w-2.5 h-2.5" /> : idx + 1}
          </span>
        ))}
      </div>

      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
        ({collectedCount}/5)
      </span>

      <button
        onClick={handleShowHint}
        title={t('Xem gợi ý viên ngọc tiếp theo', 'Get a hint for the next crystal')}
        className="ml-1 p-1 rounded-full text-slate-500 hover:text-rose-500 hover:scale-110 transition-transform cursor-pointer"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isCompleted && (
        <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black animate-pulse">
          {t('HOÀN THÀNH NHIỆM VỤ!', 'QUEST COMPLETE!')}
        </span>
      )}
    </div>
  );
};
