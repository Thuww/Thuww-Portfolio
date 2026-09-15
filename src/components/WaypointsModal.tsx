import React, { useState } from 'react';
import { SectionKey, Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  PERSONAL_INFO,
  PROJECTS,
  SKILL_CATEGORIES,
  JOURNAL_POSTS,
  BADGES
} from '../data/portfolioData';
import { soundManager } from '../audio/soundManager';
import {
  X,
  ExternalLink,
  Github,
  Mail,
  Send,
  Heart,
  Award,
  Sparkles,
  Download,
  BookOpen,
  Code2,
  Boxes,
  CheckCircle2,
  Calendar,
  Clock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaypointsModalProps {
  activeSection: SectionKey;
  onClose: () => void;
  onNavigate: (section: SectionKey) => void;
  showBadgesModal: boolean;
  onCloseBadgesModal: () => void;
  showCVModal: boolean;
  onCloseCVModal: () => void;
}

export const WaypointsModal: React.FC<WaypointsModalProps> = ({
  activeSection,
  onClose,
  onNavigate,
  showBadgesModal,
  onCloseBadgesModal,
  showCVModal,
  onCloseCVModal,
}) => {
  const { language, t } = useLanguage();
  // Projects filter state
  const [projectCategory, setProjectCategory] = useState<string>('All');
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  // Selected project modal detail
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playLevelUpSound();
    setIsSent(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setIsSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  // Render Badges Modal
  if (showBadgesModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
        <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 flex flex-col gap-5 relative border border-white/40 dark:border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Explorer Badges & Achievements
              </h2>
            </div>
            <button
              onClick={() => {
                soundManager.playClickSound();
                onCloseBadgesModal();
              }}
              className="p-2 rounded-full glass-pill hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Earn badges by exploring the 3D island, discovering secret crystals, and testing WebGL demos!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  b.unlocked
                    ? 'bg-white/80 dark:bg-slate-800/80 border-rose-500/40 shadow-md'
                    : 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md bg-gradient-to-tr ${b.color} shrink-0`}
                >
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">
                      {b.title}
                    </h3>
                    {b.unlocked && (
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render CV Modal
  if (showCVModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
        <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col gap-5 relative border border-white/40 dark:border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📄</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Resume / Curriculum Vitae
              </h2>
            </div>
            <button
              onClick={() => {
                soundManager.playClickSound();
                onCloseCVModal();
              }}
              className="p-2 rounded-full glass-pill hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col gap-4 max-h-[60vh] overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {PERSONAL_INFO.fullName}
              </h3>
              <p className="text-rose-500 font-bold">{PERSONAL_INFO.role}</p>
              <p className="text-slate-500 text-[11px] mt-1">
                San Francisco, CA • Open to Remote & Relocation
              </p>
            </div>

            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                Executive Summary
              </h4>
              <p className="leading-relaxed">
                Creative Frontend Engineer & Game Designer with 4+ years bridging WebGL, Three.js, React, and GSAP. Proven track record building high-performance 60 FPS interactive 3D web experiences, gamified design systems, and responsive applications.
              </p>
            </div>

            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                Work Experience
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Senior Creative Developer — Studio Aether</span>
                    <span className="text-slate-500">2023 - Present</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Spearheaded WebGL 3D microsites, fluid shaders, and interactive campaigns for global brands, increasing engagement duration by 180%.
                  </p>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Frontend & Game Developer — PixelForge Games</span>
                    <span className="text-slate-500">2021 - 2023</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Engineered WebXR client mechanics, physics loops via Rapier, and audio synthesizers via Web Audio API.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                Key Skills
              </h4>
              <p>
                TypeScript, React 19, Three.js, WebGL/GLSL, GSAP, Tailwind CSS, Blender, Node.js, Web Audio API, Game Loops.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playLevelUpSound();
                confetti({ particleCount: 50, spread: 50 });
                // Trigger quick simulated resume print/download
                window.print();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Resume</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If section is 'home', no main modal is open
  if (activeSection === 'home') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="waypoint-modal-container"
        className="glass-panel w-full max-w-4xl rounded-3xl p-5 sm:p-8 flex flex-col gap-5 relative max-h-[88vh] overflow-hidden border border-white/50 dark:border-slate-700 shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 font-black text-xs">
              ZONE 0{['about', 'projects', 'skills', 'journal', 'contact'].indexOf(activeSection) + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {activeSection === 'about' && '👤 About Me'}
              {activeSection === 'projects' && '💻 Projects & Creations'}
              {activeSection === 'skills' && '🛠️ Skills & Mastery'}
              {activeSection === 'journal' && '📖 Journal & Devlogs'}
              {activeSection === 'contact' && "🚀 Let's Connect"}
            </h2>
          </div>

          <button
            id="close-modal-btn"
            onClick={() => {
              soundManager.playClickSound();
              onClose();
            }}
            className="p-2 rounded-full glass-pill hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with smooth scrolling */}
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-5">
          {/* SECTION 01: ABOUT ME */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                <div className="relative group">
                  <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-xl bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                      alt="Lê Thị Minh Thu"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-2 glass-pill px-3 py-1.5 rounded-full text-xs font-black text-rose-500 shadow-lg">
                    Level 18 Architect ✦
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Kết nối trải nghiệm Web hiện đại cùng sức mạnh AI & Thị giác Máy tính.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Xin chào! Mình là Lê Thị Minh Thu (Thuww), tốt nghiệp Cử nhân chuyên ngành Thị giác Máy tính tại Đại học Khoa học Tự nhiên - ĐHQG-HCM (GPA 8.35/10, thuộc diện được tuyển thẳng Thạc sĩ). Mình đam mê phát triển sản phẩm công nghệ với giao diện trực quan, mượt mà và tối ưu trải nghiệm người dùng.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Mình có kinh nghiệm thực chiến tại Ortho Fashion xây dựng UI đăng nhập và Chatbot AI, nghiên cứu mô hình Deep Learning Virtual Try-On (CatVTON), và hơn 3 năm đồng hành cùng các tổ chức giáo dục phi lợi nhuận (VietHope, Kidspire) trong vai trò thiết kế và điều phối STEM & SEL.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-2xl glass-pill flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500">KINH NGHIỆM</span>
                      <span className="text-base font-black text-rose-500">1.5+ Năm</span>
                    </div>
                    <div className="p-3 rounded-2xl glass-pill flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500">SẢN PHẨM & DỰ ÁN</span>
                      <span className="text-base font-black text-purple-500">10+ Dự Án</span>
                    </div>
                    <div className="p-3 rounded-2xl glass-pill flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500">GPA ĐẠI HỌC</span>
                      <span className="text-base font-black text-emerald-500">8.35 / 10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Philosophy Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="p-4 rounded-2xl border border-white/50 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center text-sm font-black mb-2">
                    01
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                    Tactile Game-Feel
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Buttons that compress, spring physics, and subtle audio feedback turn mundane clicks into satisfying interactions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-white/50 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center text-sm font-black mb-2">
                    02
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                    Fluid Liquid Aesthetics
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Organic glass dispersion and procedural GLSL noise shaders that react to pointer velocities in real time.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-white/50 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center text-sm font-black mb-2">
                    03
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                    Lightweight & Accessible
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    High FPS on mobile devices with sub-second bundle load times, semantic HTML, and full keyboard navigation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 02: PROJECTS */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'WebGL & 3D', 'Liquid UI', 'Game Dev', 'Frontend'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundManager.playClickSound();
                      setProjectCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      projectCategory === cat
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                        : 'glass-pill text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECTS.filter(
                  (p) => projectCategory === 'All' || p.category === projectCategory
                ).map((project) => (
                  <div
                    key={project.id}
                    className="glass-panel p-5 rounded-3xl flex flex-col justify-between gap-4 border border-white/60 dark:border-slate-700/60 hover:scale-101 transition-all"
                  >
                    <div className="space-y-2">
                       {/* Category and Year */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md bg-rose-500/15 text-[10px] font-black text-rose-600 dark:text-rose-400">
                          {language === 'en' && project.categoryEn ? project.categoryEn : project.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {project.year}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {language === 'en' && project.titleEn ? project.titleEn : project.title}
                      </h3>
                      <p className="text-xs font-semibold text-rose-500">
                        {language === 'en' && project.taglineEn ? project.taglineEn : project.tagline}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {language === 'en' && project.descriptionEn ? project.descriptionEn : project.description}
                      </p>

                      {/* Key features bullets */}
                      <ul className="space-y-1 pt-1">
                        {(language === 'en' && project.featuresEn ? project.featuresEn : project.features).slice(0, 2).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-emerald-500">
                          {language === 'en' && project.metricsEn ? project.metricsEn : project.metrics}
                        </span>
                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg glass-pill text-slate-700 dark:text-slate-200 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                              title="View Source"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {project.demoUrl ? (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                soundManager.playLevelUpSound();
                                confetti({ particleCount: 40, spread: 45 });
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer shadow-md shadow-rose-500/20"
                            >
                              <span>{t('Trải nghiệm Demo', 'Live Demo')}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                soundManager.playLevelUpSound();
                                confetti({ particleCount: 40, spread: 45 });
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer shadow-md shadow-rose-500/20"
                            >
                              <span>{t('Trải nghiệm Demo', 'Live Demo')}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 03: SKILLS */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Skills calibrated through production web apps, WebGL engine experiments, and global hackathons.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {SKILL_CATEGORIES.map((category) => (
                  <div
                    key={category.title}
                    className="glass-panel p-5 rounded-3xl flex flex-col gap-4 border border-white/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-rose-500/15 text-rose-500">
                        {category.title.includes('Sorcery') && <Code2 className="w-4 h-4" />}
                        {category.title.includes('3D') && <Boxes className="w-4 h-4" />}
                        {category.title.includes('Motion') && <Layers className="w-4 h-4" />}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {category.title}
                      </h3>
                    </div>

                    <div className="space-y-3.5">
                      {category.skills.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                            <span className="flex items-center gap-1.5">
                              <span>{skill.icon}</span>
                              <span>{skill.name}</span>
                            </span>
                            <span className="text-[10px] text-rose-500 font-extrabold">
                              {skill.level}%
                            </span>
                          </div>

                          <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5">
                            <div
                              style={{ width: `${skill.level}%` }}
                              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000"
                            />
                          </div>

                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {skill.xp}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 04: JOURNAL */}
          {activeSection === 'journal' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Articles, technical deep-dives, and devlogs exploring WebGL, game feel, and next-gen frontend engineering.
              </p>

              <div className="space-y-4">
                {JOURNAL_POSTS.map((post) => (
                  <article
                    key={post.id}
                    className="glass-panel p-5 sm:p-6 rounded-3xl flex flex-col gap-3 border border-white/60 dark:border-slate-700/60 hover:scale-101 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-500/15 text-[10px] font-black text-purple-600 dark:text-purple-400">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-pink-500 font-bold text-xs">
                        <Heart className="w-3 h-3 fill-pink-500" /> {post.likes}
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {post.summary}
                    </p>
                    <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/50">
                      💡 {post.content}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 05: CONTACT */}
          {activeSection === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info & Socials */}
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Let's craft something legendary together! 🚀
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Have a game, 3D WebGL project, or innovative frontend role in mind? Send a message through the island portal or reach out directly.
                </p>

                <div className="space-y-2.5 pt-2">
                  <a
                    href={PERSONAL_INFO.socials.email}
                    className="flex items-center gap-3 p-3.5 rounded-2xl glass-pill hover:bg-rose-500 hover:text-white transition-all group cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-rose-500/15 group-hover:bg-white/20 text-rose-500 group-hover:text-white">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 group-hover:text-white/80">
                        DIRECT EMAIL
                      </div>
                      <div className="text-xs font-black">
                        minhthu2k33@gmail.com
                      </div>
                    </div>
                  </a>

                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={PERSONAL_INFO.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl glass-pill hover:bg-slate-900 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={PERSONAL_INFO.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl glass-pill hover:bg-blue-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Terminal Form */}
              <form
                onSubmit={handleSendMessage}
                className="glass-panel p-5 rounded-3xl flex flex-col gap-3 border border-white/60 dark:border-slate-700/60"
              >
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-500">
                  PORTAL TRANSMISSION TERMINAL
                </span>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Name / Player Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Satoshi Adventurer"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Email Coordinates
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Quest Brief / Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell me about your project, idea, or role..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-extrabold shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-700 transition-all cursor-pointer"
                >
                  {isSent ? (
                    <span className="flex items-center gap-1.5 text-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> Message Sent Into Orbit!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" /> Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
