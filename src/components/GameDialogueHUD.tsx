import React, { useState, useEffect } from 'react';
import { SectionKey, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  PERSONAL_INFO,
  PROJECTS,
  SKILL_CATEGORIES,
  JOURNAL_POSTS,
} from '../data/portfolioData';
import { soundManager } from '../audio/soundManager';
import {
  X,
  ExternalLink,
  Github,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Gamepad2,
  Zap,
  Code2,
  BookOpen,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameDialogueHUDProps {
  activeSection: SectionKey;
  onClose: () => void;
  onFastTravel: (section: SectionKey) => void;
  onGainXP: (amount: number) => void;
}

export const GameDialogueHUD: React.FC<GameDialogueHUDProps> = ({
  activeSection,
  onClose,
  onFastTravel,
  onGainXP,
}) => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<number>(0);
  const [selectedJournalIndex, setSelectedJournalIndex] = useState<number>(0);

  // Contact form state
  const [senderName, setSenderName] = useState('');
  const [senderMsg, setSenderMsg] = useState('');
  const [isTransmitted, setIsTransmitted] = useState(false);

  // Reset mini-states when section changes
  useEffect(() => {
    setSelectedProjectIndex(0);
    setIsExpanded(false);
  }, [activeSection]);

  if (activeSection === 'home') return null;

  const handleTransmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderMsg.trim()) return;

    soundManager.playTeleportSound();
    setIsTransmitted(true);
    onGainXP(150);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
    });

    setTimeout(() => {
      setIsTransmitted(false);
      setSenderName('');
      setSenderMsg('');
    }, 4000);
  };

  const NEXT_ISLAND_MAP: Record<SectionKey, { next: SectionKey; name: string }> = {
    home: { next: 'about', name: '01 About' },
    about: { next: 'projects', name: '02 Projects' },
    projects: { next: 'skills', name: '03 Skills' },
    skills: { next: 'journal', name: '04 Journal' },
    journal: { next: 'contact', name: '05 Stargate' },
    contact: { next: 'about', name: '01 About' },
  };

  const currentProject = PROJECTS[selectedProjectIndex] || PROJECTS[0];
  const currentJournal = JOURNAL_POSTS[selectedJournalIndex] || JOURNAL_POSTS[0];

  return (
    <div
      id="game-dialogue-hud"
      className={`fixed z-30 transition-all duration-300 pointer-events-auto ${
        isExpanded
          ? 'inset-4 sm:inset-10 flex items-center justify-center'
          : 'bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95vw] sm:w-[680px] max-h-[85vh]'
      }`}
    >
      <div
        className={`w-full rounded-3xl glass-panel flex flex-col overflow-hidden border border-white/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-xl ${
          isExpanded ? 'h-full max-w-4xl' : 'max-h-[500px]'
        }`}
      >
        {/* Dialogue Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            {/* Animated Character Avatar Icon */}
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-md flex items-center justify-center text-white">
              <span className="text-base">👩‍💻</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {activeSection === 'about' && '🏰 Atelier of Dreams • 01 About'}
                  {activeSection === 'projects' && '🕹️ Cyber Arcade Plaza • 02 Projects'}
                  {activeSection === 'skills' && '⚡ Alchemical Tech Spire • 03 Skills'}
                  {activeSection === 'journal' && '📜 Chronicle Sanctuary • 04 Journal'}
                  {activeSection === 'contact' && '🌌 Starlight Portal Gate • 05 Contact'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-pink-500/20 text-rose-600 dark:text-rose-400">
                  Interactive Landmark
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Approach landmarks to unlock codex records & live interactive demos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playClickSound();
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? 'Collapse into Game HUD' : 'Expand full-screen'}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
              title="Close & Resume Free Roam [ESC]"
              className="p-1.5 rounded-xl hover:bg-rose-500 hover:text-white text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Content Body based on Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar text-xs">
          {/* SECTION 1: ABOUT ME */}
          {activeSection === 'about' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white shrink-0 text-xl shadow-md">
                  ✨
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Hi explorer! I'm Minh Thu.
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {PERSONAL_INFO.heroSubtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      Level 18 Engineer
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      3D World Creator
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700">
                  <div className="text-sm font-black text-rose-500">12+</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Games & WebGL</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700">
                  <div className="text-sm font-black text-purple-500">99.8%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Fluid 60 FPS</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700">
                  <div className="text-sm font-black text-emerald-500">4+</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Hackathon Wins</div>
                </div>
              </div>

              {/* Core Philosophy Quests */}
              <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-slate-700/40 space-y-1.5">
                <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-rose-500" />
                  Core Design Principles:
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  1. **Playful Joy**: Websites shouldn't be boring document scrolls. They should be living playgrounds.
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  2. **Mathematical Craft**: Precision physics, spring curves, and custom shaders that feel tactile.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: PROJECTS (CYBER ARCADE CABINETS) */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              {/* Arcade Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {PROJECTS.map((proj, idx) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedProjectIndex(idx);
                      onGainXP(25);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      selectedProjectIndex === idx
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105'
                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>{language === 'en' && proj.titleEn ? proj.titleEn : proj.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Arcade Cabinet Card */}
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/60 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-500/20 text-purple-600 dark:text-purple-300 uppercase">
                      {language === 'en' && currentProject.categoryEn ? currentProject.categoryEn : currentProject.category} • {currentProject.year}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                      {language === 'en' && currentProject.titleEn ? currentProject.titleEn : currentProject.title}
                    </h3>
                    <p className="text-xs font-semibold text-rose-500">
                      {language === 'en' && currentProject.taglineEn ? currentProject.taglineEn : currentProject.tagline}
                    </p>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                    {language === 'en' && currentProject.metricsEn ? currentProject.metricsEn : currentProject.metrics}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'en' && currentProject.descriptionEn ? currentProject.descriptionEn : currentProject.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {currentProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  {currentProject.demoUrl && (
                    <a
                      href={currentProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('Trải nghiệm Demo', 'Launch Live Experience')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {currentProject.githubUrl && (
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 text-slate-800 dark:text-white font-bold hover:bg-slate-300 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>{t('Xem Mã Nguồn', 'View Code')}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: SKILLS (ALCHEMICAL TREE) */}
          {activeSection === 'skills' && (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.title}
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedSkillCategory(idx);
                      onGainXP(15);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedSkillCategory === idx
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SKILL_CATEGORIES[selectedSkillCategory].skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700/50 space-y-1.5 hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span>{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-black text-blue-500">
                        {skill.level}% Mastery
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        style={{ width: `${skill.level}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      />
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold text-right">
                      {skill.xp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: JOURNAL & DEVLOGS */}
          {activeSection === 'journal' && (
            <div className="space-y-3">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {JOURNAL_POSTS.map((post, idx) => (
                  <button
                    key={post.id}
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedJournalIndex(idx);
                      onGainXP(20);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      selectedJournalIndex === idx
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {post.title.substring(0, 24)}...
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    {currentJournal.category} • {currentJournal.readTime}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{currentJournal.date}</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {currentJournal.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentJournal.summary}
                </p>

                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400 italic">
                  "{currentJournal.content.substring(0, 160)}..."
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: STARLIGHT PORTAL / TRANSMIT */}
          {activeSection === 'contact' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-indigo-500/15 border border-purple-500/30 flex items-center gap-3">
                <span className="text-2xl">🌌</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    Cosmic Stargate Transmitter
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Send a direct transmission packet to Minh Thu's frequency.
                  </p>
                </div>
              </div>

              {isTransmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                  <span className="text-3xl">🚀</span>
                  <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    Transmission Sent Through The Stargate!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Your packet has arrived safely at Minh Thu's terminal. +150 XP awarded!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTransmitMessage} className="space-y-2">
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your Adventurer Name / Email..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <textarea
                    required
                    rows={3}
                    value={senderMsg}
                    onChange={(e) => setSenderMsg(e.target.value)}
                    placeholder="Write your transmission (collaboration ideas, job offers, or say hello!)..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Message & Warp XP</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-4 py-2.5 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 transition-colors cursor-pointer"
          >
            ← Resume Roaming [ESC]
          </button>

          <button
            onClick={() => {
              const next = NEXT_ISLAND_MAP[activeSection];
              soundManager.playTeleportSound();
              onFastTravel(next.next);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-black shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <span>Glide to {NEXT_ISLAND_MAP[activeSection].name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
