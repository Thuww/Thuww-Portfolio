import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Plane, Cloud } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface CloudTransitionProps {
  islandName: string;
  onWarpReached: () => void;
  onFinished: () => void;
}

export const CloudTransition: React.FC<CloudTransitionProps> = ({
  islandName,
  onWarpReached,
  onFinished,
}) => {
  // States for cloud animation phases: 'entering' | 'loading' | 'leaving'
  const [phase, setPhase] = useState<'entering' | 'loading' | 'leaving'>('entering');
  const [progress, setProgress] = useState(15);
  const onWarpReachedRef = useRef(onWarpReached);
  const onFinishedRef = useRef(onFinished);

  // Keep callback refs updated to avoid re-triggering timers
  useEffect(() => {
    onWarpReachedRef.current = onWarpReached;
    onFinishedRef.current = onFinished;
  }, [onWarpReached, onFinished]);

  useEffect(() => {
    soundManager.playTeleportSound();

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 18;
      });
    }, 100);

    // Phase 1 -> 2: Clouds close, switch island screen in background
    const timerMid = setTimeout(() => {
      setPhase('loading');
      onWarpReachedRef.current();
    }, 550);

    // Phase 2 -> 3: Clouds part away smoothly
    const timerLeaving = setTimeout(() => {
      setPhase('leaving');
      soundManager.playChimeSound();
    }, 950);

    // Phase 4: Finished, remove overlay
    const timerFinish = setTimeout(() => {
      clearInterval(progressInterval);
      onFinishedRef.current();
    }, 1450);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timerMid);
      clearTimeout(timerLeaving);
      clearTimeout(timerFinish);
    };
  }, []);

  return (
    <div
      id="cloud-transition-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* ─── LEFT CLOUD CURTAIN ───────────────────────────── */}
      <div
        className={`absolute inset-y-0 left-0 w-[58vw] bg-gradient-to-r from-sky-200 via-sky-100 to-white/95 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-800 shadow-2xl transition-transform duration-500 ease-in-out flex items-center justify-end pr-8 ${
          phase === 'entering' || phase === 'loading'
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
        style={{
          borderTopRightRadius: '120px',
          borderBottomRightRadius: '120px',
        }}
      >
        {/* Fluffy Cartoon Cloud Puffs Decor */}
        <div className="absolute -right-16 top-1/4 w-32 h-32 rounded-full bg-white dark:bg-slate-800 opacity-90 shadow-lg" />
        <div className="absolute -right-24 top-1/2 w-48 h-48 rounded-full bg-sky-100 dark:bg-indigo-900 opacity-90 shadow-xl" />
        <div className="absolute -right-16 bottom-1/4 w-36 h-36 rounded-full bg-white dark:bg-slate-800 opacity-90 shadow-lg" />
      </div>

      {/* ─── RIGHT CLOUD CURTAIN ──────────────────────────── */}
      <div
        className={`absolute inset-y-0 right-0 w-[58vw] bg-gradient-to-l from-rose-200 via-pink-100 to-white/95 dark:from-slate-900 dark:via-purple-950 dark:to-slate-800 shadow-2xl transition-transform duration-500 ease-in-out flex items-center justify-start pl-8 ${
          phase === 'entering' || phase === 'loading'
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
        style={{
          borderTopLeftRadius: '120px',
          borderBottomLeftRadius: '120px',
        }}
      >
        {/* Fluffy Cartoon Cloud Puffs Decor */}
        <div className="absolute -left-16 top-1/3 w-36 h-36 rounded-full bg-white dark:bg-slate-800 opacity-90 shadow-lg" />
        <div className="absolute -left-24 top-1/2 w-44 h-44 rounded-full bg-rose-100 dark:bg-purple-900 opacity-90 shadow-xl" />
        <div className="absolute -left-16 bottom-1/3 w-32 h-32 rounded-full bg-white dark:bg-slate-800 opacity-90 shadow-lg" />
      </div>

      {/* ─── CENTER CUTE AIRPLANE & LOADING BADGE ────────── */}
      <div
        className={`relative z-20 flex flex-col items-center gap-3 px-8 py-5 rounded-[32px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-pink-300 dark:border-pink-500/40 shadow-2xl shadow-pink-500/20 transition-all duration-300 ${
          phase === 'loading'
            ? 'scale-100 opacity-100'
            : phase === 'entering'
            ? 'scale-90 opacity-90'
            : 'scale-75 opacity-0'
        }`}
      >
        {/* Bouncing Airplane with Cloud Halo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-300 p-0.5 shadow-lg shadow-pink-500/30 animate-bounce">
            <div className="w-full h-full rounded-[22px] bg-white dark:bg-slate-950 flex items-center justify-center">
              <Plane className="w-8 h-8 text-pink-500 transform -rotate-12" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500" />
          </span>
        </div>

        {/* Text & Destination */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-pink-500 dark:text-pink-400">
            <Cloud className="w-4 h-4 animate-pulse" />
            <span>ĐANG BAY TỚI HÒN ĐẢO...</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-0.5 drop-shadow-sm">
            {islandName}
          </h2>
        </div>

        {/* Cute Pastel Progress Bar */}
        <div className="w-48 sm:w-64 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-pink-200 dark:border-pink-500/30 overflow-hidden p-0.5 mt-1">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-pink-500 to-amber-400 transition-all duration-200 shadow-sm"
          />
        </div>

        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          Chuyến bay Aetheria Airways • 60 FPS Locked ✨
        </span>
      </div>
    </div>
  );
};
