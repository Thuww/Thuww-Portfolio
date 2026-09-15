import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface WarpTransitionProps {
  islandName: string;
  onComplete: () => void;
}

export const WarpTransition: React.FC<WarpTransitionProps> = ({ islandName, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      id="warp-transition-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Hyperdrive warp tunnels and speed lines */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/80 via-purple-900/80 to-pink-900/80 backdrop-blur-md animate-in fade-in zoom-in-50 duration-300" />

      {/* Speed lines radiating outward */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            style={{
              transform: `rotate(${i * 22.5}deg) translateY(-50%)`,
              animationDelay: `${(i % 4) * 0.1}s`,
            }}
            className="absolute w-[2px] h-[150vh] bg-gradient-to-t from-transparent via-cyan-400 to-transparent opacity-70 animate-pulse"
          />
        ))}
      </div>

      {/* Center Warp Portal Badge */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-8 py-4 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/40 shadow-2xl animate-in zoom-in-75 duration-300">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 p-0.5 animate-spin">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-300" />
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-black uppercase tracking-widest text-pink-400">
            DỊCH CHUYỂN KHÔNG GIAN • WARPING
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider drop-shadow-lg">
            {islandName}
          </h2>
        </div>
      </div>
    </div>
  );
};
