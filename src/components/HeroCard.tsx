import React from 'react';
import { PERSONAL_INFO, TECH_STACK } from '../data/portfolioData';
import { SectionKey } from '../types';
import { soundManager } from '../audio/soundManager';
import {
  Download,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Phone,
  FileText,
  Plus,
  Sparkles,
  Cloud,
  Star,
  Code2,
  Heart,
  Repeat
} from 'lucide-react';

interface HeroCardProps {
  onExploreWorld: () => void;
  onSelectSection: (section: SectionKey) => void;
  onOpenCVModal: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  onExploreWorld,
  onSelectSection,
  onOpenCVModal,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const xpPercent = Math.round((PERSONAL_INFO.currentXp / PERSONAL_INFO.maxXp) * 100);

  const signpostItems = [
    { label: 'Dream', icon: <Cloud className="w-3.5 h-3.5 text-sky-400" /> },
    { label: 'Plan', icon: <Star className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Code', icon: <Code2 className="w-3.5 h-3.5 text-purple-400" /> },
    { label: 'Create', icon: <Heart className="w-3.5 h-3.5 text-pink-400" /> },
    { label: 'Repeat', icon: <Repeat className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  if (isCollapsed) {
    return (
      <aside className="pointer-events-none absolute top-16 left-3 sm:left-6 z-20">
        <button
          onClick={() => {
            soundManager.playClickSound();
            setIsCollapsed(false);
          }}
          className="pointer-events-auto glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xl hover:scale-105 transition-transform cursor-pointer border border-white/60 dark:border-slate-700"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <span className="text-xs font-black text-slate-800 dark:text-white">
            🌸 {PERSONAL_INFO.name} • Lv. {PERSONAL_INFO.level} [Expand HUD]
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      id="hero-left-panel"
      className="pointer-events-none absolute top-16 left-3 sm:left-6 z-20 w-[92vw] sm:w-[380px] max-h-[calc(100vh-80px)] overflow-y-auto no-scrollbar flex flex-col gap-3 pb-6"
    >
      {/* 1. Main Intro Hero Card */}
      <div className="pointer-events-auto glass-panel p-5 sm:p-6 rounded-3xl flex flex-col gap-3 relative">
        <button
          onClick={() => {
            soundManager.playClickSound();
            setIsCollapsed(true);
          }}
          title="Minimize HUD"
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold"
        >
          Hide ✕
        </button>
        {/* Eyebrow */}
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rose-500">
          <span>HEY, I'M {PERSONAL_INFO.name.toUpperCase()}</span>
          <span className="text-sm">🌸</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          I design & build <br />
          <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
            digital experiences
          </span>{' '}
          that inspire.{' '}
          <span className="inline-block text-pink-500 animate-pulse">💖</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {PERSONAL_INFO.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            id="explore-world-btn"
            onClick={() => {
              soundManager.playClickSound();
              onExploreWorld();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <span>Explore My World</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="download-cv-btn"
            onClick={() => {
              soundManager.playClickSound();
              onOpenCVModal();
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 glass-pill hover:bg-white dark:hover:bg-slate-800 hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <span>Download CV</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Current Quest Card */}
      <div className="pointer-events-auto glass-panel p-4 rounded-3xl flex flex-col gap-2.5 relative overflow-hidden">
        {/* Quest Title & Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1">
              CURRENT QUEST <Sparkles className="w-3 h-3" />
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-[10px] font-black text-rose-600 dark:text-rose-400">
            Lv. {PERSONAL_INFO.level}
          </span>
        </div>

        {/* Quest Objective and Character Avatar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">
              Level up by building cool things with code & creativity ✦
            </p>

            {/* EXP Progress bar */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>EXP • {PERSONAL_INFO.currentXp.toLocaleString()} / {PERSONAL_INFO.maxXp.toLocaleString()}</span>
                <span className="text-rose-500 font-extrabold">{xpPercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5">
                <div
                  style={{ width: `${xpPercent}%` }}
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000"
                />
              </div>
            </div>
          </div>

          {/* Avatar Graphic with glowing border */}
          <div className="relative shrink-0">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 p-0.5 shadow-lg shadow-pink-500/25">
              <div className="w-full h-full rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Minh Thu Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>
        </div>
      </div>

      {/* 3. Tech Stack Tags Card */}
      <div className="pointer-events-auto glass-panel p-4 rounded-3xl flex flex-col gap-2">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          TECH STACK
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TECH_STACK.map((tech) => (
            <button
              key={tech.name}
              id={`tech-badge-${tech.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
              onClick={() => {
                soundManager.playClickSound();
                onSelectSection('skills');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer ${tech.color}`}
            >
              <span>{tech.icon}</span>
              <span>{tech.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Let's Connect Socials Card */}
      <div className="pointer-events-auto glass-panel p-4 rounded-3xl flex flex-col gap-2">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          LET'S CONNECT
        </div>
        <div className="flex items-center gap-2">
          <a
            href={PERSONAL_INFO.socials.github}
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            className="p-2.5 rounded-xl glass-pill hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all cursor-pointer"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn Profile"
            className="p-2.5 rounded-xl glass-pill hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.portfolioCanva}
            target="_blank"
            rel="noreferrer"
            title="Visual Portfolio (Canva)"
            className="p-2.5 rounded-xl glass-pill hover:bg-teal-600 hover:text-white transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.email}
            title="Gửi Email trực tiếp"
            className="p-2.5 rounded-xl glass-pill hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.socials.phone}
            title="Hotline / Zalo: 0888 392 122"
            className="p-2.5 rounded-xl glass-pill hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => {
              soundManager.playClickSound();
              onSelectSection('contact');
            }}
            title="More Options"
            className="p-2.5 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-all cursor-pointer shadow-md shadow-pink-500/20"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Ticker pill */}
      <div className="pointer-events-auto glass-pill px-4 py-2 rounded-full flex items-center justify-center gap-2 text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300">
        <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
        <span>Crafting • Coding • Creating • Growing</span>
        <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
      </div>

      {/* 6. Wooden Signpost Guide (as shown in the visual reference) */}
      <div className="pointer-events-auto flex flex-col gap-1 w-28 select-none">
        {signpostItems.map((item, idx) => (
          <div
            key={item.label}
            style={{ marginLeft: `${(idx % 2) * 6}px` }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/80 text-amber-100 border border-amber-700/60 shadow-md backdrop-blur-sm text-[11px] font-black tracking-wider hover:translate-x-1 transition-transform"
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
