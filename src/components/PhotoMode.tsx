import React, { useState, useRef } from 'react';
import { Camera, X, Sparkles, Download, Check, RefreshCw, Share2, Image as ImageIcon } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';

interface PhotoModeProps {
  isOpen: boolean;
  onClose: () => void;
  onGainXP: (amount: number) => void;
}

interface FilterOption {
  id: string;
  name: string;
  cssFilter: string;
  colorName: string;
}

const FILTERS: FilterOption[] = [
  { id: 'normal', name: 'Tự Nhiên', cssFilter: 'none', colorName: 'from-slate-400 to-slate-500' },
  { id: 'cyber', name: 'Cyber Neon', cssFilter: 'contrast(1.25) saturate(1.8) hue-rotate(180deg)', colorName: 'from-cyan-400 to-fuchsia-500' },
  { id: 'sunset', name: 'Hoàng Hôn Vàng', cssFilter: 'sepia(0.4) saturate(1.5) contrast(1.1) brightness(1.05)', colorName: 'from-amber-400 to-rose-500' },
  { id: 'anime', name: 'Anime Pastel', cssFilter: 'saturate(1.5) contrast(0.95) brightness(1.15) hue-rotate(15deg)', colorName: 'from-pink-300 to-sky-400' },
  { id: 'vintage', name: 'Vintage Phim', cssFilter: 'sepia(0.25) contrast(1.15) saturate(0.85) brightness(0.95)', colorName: 'from-emerald-400 to-amber-600' },
  { id: 'noir', name: 'Noir B&W', cssFilter: 'grayscale(1) contrast(1.4) brightness(0.95)', colorName: 'from-gray-700 to-black' },
];

const STICKERS = ['💖', '⭐', '🌸', '👑', '🎉', '🐾', '✨', '🎮', '🕊️', '💎'];

export const PhotoMode: React.FC<PhotoModeProps> = ({ isOpen, onClose, onGainXP }) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>(FILTERS[0]);
  const [placedStickers, setPlacedStickers] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleAddSticker = (emoji: string) => {
    soundManager.playCoinSound();
    const newSticker = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const handleClearStickers = () => {
    soundManager.playClickSound();
    setPlacedStickers([]);
  };

  const handleCapturePhoto = () => {
    soundManager.playClickSound();
    setIsFlashing(true);

    try {
      // 1. Locate the WebGL Canvas rendered by Three.js
      const webglCanvas = document.querySelector('#three-world-container canvas') as HTMLCanvasElement ||
                          document.querySelector('canvas') as HTMLCanvasElement;

      if (webglCanvas) {
        // Create an offscreen 2D canvas with high resolution
        const offCanvas = document.createElement('canvas');
        const width = webglCanvas.width || 1920;
        const height = webglCanvas.height || 1080;
        offCanvas.width = width;
        offCanvas.height = height;
        const ctx = offCanvas.getContext('2d');

        if (ctx) {
          // Draw with filter
          if (activeFilter.cssFilter !== 'none') {
            ctx.filter = activeFilter.cssFilter;
          }
          ctx.drawImage(webglCanvas, 0, 0, width, height);
          ctx.filter = 'none'; // reset filter for overlays

          // Draw cute stickers
          placedStickers.forEach((st) => {
            const posX = (st.x / 100) * width;
            const posY = (st.y / 100) * height;
            ctx.font = `${Math.floor(width * 0.045)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(st.emoji, posX, posY);
          });

          // Draw Aesthetic Polaroid / Cyber Watermark Frame
          const bannerHeight = Math.floor(height * 0.08);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
          ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

          // Watermark text
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(bannerHeight * 0.35)}px sans-serif`;
          ctx.textAlign = 'left';
          ctx.fillText('✦ AETHERIA 3D WORLD • LE THI MINH THU (THUWW)', width * 0.03, height - bannerHeight * 0.4);

          ctx.fillStyle = '#f43f5e';
          ctx.textAlign = 'right';
          const dateStr = new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
          ctx.fillText(`FILTER: ${activeFilter.name.toUpperCase()} • ${dateStr}`, width * 0.97, height - bannerHeight * 0.4);

          const dataUrl = offCanvas.toDataURL('image/png');
          setCapturedPhotoUrl(dataUrl);
        }
      }
    } catch (err) {
      console.warn('Canvas capture fallback:', err);
    }

    setTimeout(() => {
      setIsFlashing(false);
      soundManager.playLevelUpSound();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
      });
      onGainXP(150);
    }, 280);
  };

  const handleDownload = () => {
    if (!capturedPhotoUrl) return;
    soundManager.playCoinSound();
    const link = document.createElement('a');
    link.download = `Aetheria-Shot-${Date.now()}.png`;
    link.href = capturedPhotoUrl;
    link.click();
  };

  const handleShare = () => {
    soundManager.playClickSound();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      id="game-photo-mode"
      className="fixed inset-0 z-50 pointer-events-auto flex flex-col justify-between p-4 sm:p-6 select-none"
    >
      {/* Dynamic Live Filter Applied to Viewport */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-300 -z-10"
        style={{
          backdropFilter: activeFilter.cssFilter !== 'none' ? activeFilter.cssFilter : undefined,
          WebkitBackdropFilter: activeFilter.cssFilter !== 'none' ? activeFilter.cssFilter : undefined,
        }}
      />

      {/* Flash overlay */}
      {isFlashing && (
        <div className="fixed inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
      )}

      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/70 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
          <Camera className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider">
            Chế Độ Máy Ảnh 3D Kỷ Niệm • Photo Mode
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <button
          onClick={() => {
            soundManager.playClickSound();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Camera Viewfinder Grid Frame */}
      <div className="relative flex-1 w-full my-3 rounded-[32px] border-2 border-white/40 border-dashed pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Rule of thirds grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Viewfinder Corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-pink-400" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-pink-400" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-pink-400" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-pink-400" />

        {/* Center Target Focus Ring */}
        <div className="w-16 h-16 rounded-full border border-white/40 flex items-center justify-center animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-lg shadow-pink-500/80" />
        </div>

        {/* Current Active Filter Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase text-pink-300">
          FILTER: {activeFilter.name}
        </div>

        {/* Placed Stickers on Viewfinder */}
        {placedStickers.map((st) => (
          <div
            key={st.id}
            style={{ left: `${st.x}%`, top: `${st.y}%` }}
            className="absolute text-4xl pointer-events-none animate-bounce duration-1000 select-none drop-shadow-lg -translate-x-1/2 -translate-y-1/2"
          >
            {st.emoji}
          </div>
        ))}
      </div>

      {/* Bottom Controls Bar: Filters, Stickers & Shutter */}
      <div className="flex flex-col gap-3 p-3 sm:p-4 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/20 shadow-2xl z-20">
        {/* Row 1: Filter Presets */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0 hidden sm:inline">
            Filters:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  soundManager.playClickSound();
                  setActiveFilter(f);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                  activeFilter.id === f.id
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg border-pink-400 scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 border-transparent'
                }`}
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${f.colorName}`} />
                <span>{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Stickers & Capture Action */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10 flex-wrap">
          {/* Stickers Tray */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl overflow-x-auto max-w-full">
            <span className="text-[10px] font-bold text-slate-400 px-2 hidden sm:inline">
              Stickers:
            </span>
            {STICKERS.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleAddSticker(emoji)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl hover:bg-white/20 hover:scale-120 active:scale-95 transition-transform flex items-center justify-center text-sm sm:text-base cursor-pointer"
                title={`Thêm sticker ${emoji}`}
              >
                {emoji}
              </button>
            ))}
            {placedStickers.length > 0 && (
              <button
                onClick={handleClearStickers}
                className="px-2 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-[10px] font-bold hover:bg-rose-500/30 cursor-pointer ml-1"
              >
                Xóa hết
              </button>
            )}
          </div>

          {/* Shutter Capture Button */}
          <button
            onClick={handleCapturePhoto}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:scale-105 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/40 border border-white/40 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 animate-pulse" />
            <span>Chụp Kỷ Niệm (+150 XP)</span>
          </button>
        </div>
      </div>

      {/* ─── MODAL PREVIEW AFTER CAPTURE ─── */}
      {capturedPhotoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[32px] bg-slate-900 border border-white/30 p-5 shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-black uppercase">Ảnh Kỷ Niệm Đã Chụp!</h3>
              </div>
              <button
                onClick={() => setCapturedPhotoUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Output Preview */}
            <div className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black">
              <img
                src={capturedPhotoUrl}
                alt="Captured Snapshot"
                className="w-full h-auto object-cover max-h-[55vh]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setCapturedPhotoUrl(null)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Chụp Lại</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>{copiedLink ? 'Đã Sao Chép!' : 'Chia Sẻ'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs shadow-lg shadow-pink-500/30 cursor-pointer hover:scale-105 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Về Máy (PNG)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

