import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../audio/soundManager';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Layers,
  Code2,
  Palette,
  CheckCircle2,
  Award,
  BookOpen,
  Users,
  Compass,
  TrendingUp,
} from 'lucide-react';

interface SkillsConstellationViewProps {
  onBackToWorld: () => void;
  onGainXP: (amount: number) => void;
}

export type SkillCategory = 'all' | 'frontend' | 'ai_cv' | 'systems' | 'creative';

export interface TechSkill {
  id: string;
  name: string;
  category: 'frontend' | 'ai_cv' | 'systems' | 'creative';
  categoryNameVi: string;
  categoryNameEn: string;
  level: number;
  gradeVi: string;
  gradeEn: string;
  color: string;
  icon: string;
  benchmarkVi: string;
  benchmarkEn: string;
  summaryVi: string;
  summaryEn: string;
  highlightsVi: string[];
  highlightsEn: string[];
  metrics: { labelVi: string; labelEn: string; value: string }[];
  productionUse: string;
}

const TECH_SKILLS: TechSkill[] = [
  {
    id: 'react_next',
    name: 'React.js & Next.js Ecosystem',
    category: 'frontend',
    categoryNameVi: 'Frontend & Kiến Trúc Web',
    categoryNameEn: 'Frontend & Web Architecture',
    level: 95,
    gradeVi: 'Thành thạo cao cấp',
    gradeEn: 'Senior / Advanced',
    color: 'from-cyan-400 to-blue-500 text-cyan-300 border-cyan-400/40',
    icon: '⚛️',
    benchmarkVi: 'Sản phẩm E-Commerce & Web3',
    benchmarkEn: 'Production E-Commerce & Web3',
    summaryVi: 'Xây dựng ứng dụng web hiện đại với React, Next.js, responsive Tailwind CSS, tích hợp Chatbot AI và Web3 MetaMask.',
    summaryEn: 'Building modern web applications with React, Next.js, responsive Tailwind CSS, integrating AI Chatbots and Web3 MetaMask.',
    highlightsVi: [
      'Phát triển UI Login, navigation và Chatbot AI phong cách thời trang tại Ortho Fashion',
      'Tối ưu re-render và componentization cho ứng dụng Taskify (React + TS)',
      'Quản lý trạng thái phân tầng, Context API và RESTful client hooks',
      'Thiết kế responsive layout tối ưu cho mobile lẫn màn hình độ phân giải cao',
    ],
    highlightsEn: [
      'Engineered Login UI, navigation and AI Fashion Chatbot at Ortho Fashion',
      'Optimized re-renders and component architecture for Taskify app (React + TS)',
      'Hierarchical state management, Context API and custom RESTful hooks',
      'Mobile-first responsive layouts optimized for high-density displays',
    ],
    metrics: [
      { labelVi: 'Dự án thực tế', labelEn: 'Production Project', value: 'Ortho Fashion' },
      { labelVi: 'Tái sử dụng Component', labelEn: 'Component Reusability', value: '95%' },
      { labelVi: 'Độ phản hồi', labelEn: 'Responsiveness', value: 'Mobile-First' },
    ],
    productionUse: 'Ortho Fashion (ortho.fashion) & Taskify App',
  },
  {
    id: 'typescript',
    name: 'TypeScript & Component Architecture',
    category: 'frontend',
    categoryNameVi: 'Kiểu Dữ Liệu & Chuẩn Web',
    categoryNameEn: 'Type Safety & Web Standards',
    level: 92,
    gradeVi: 'Nâng cao',
    gradeEn: 'Advanced',
    color: 'from-blue-400 to-indigo-500 text-blue-300 border-blue-400/40',
    icon: '📘',
    benchmarkVi: '100% Strict Type Coverage',
    benchmarkEn: '100% Strict Type Coverage',
    summaryVi: 'Sử dụng TypeScript nghiêm ngặt trong dự án Taskify và Ortho, định nghĩa interface, generics và model chuẩn xác.',
    summaryEn: 'Strict TypeScript usage in Taskify and Ortho, defining rock-solid interfaces, generics and scalable data models.',
    highlightsVi: [
      'Định nghĩa type-safe props và state cho components tương tác kéo thả',
      'Tương thích mượt mà với react-beautiful-dnd và Web APIs',
      'Giảm thiểu tối đa lỗi runtime qua strict typing',
      'Tổ chức cấu trúc thư mục module hóa sạch sẽ, dễ bảo trì',
    ],
    highlightsEn: [
      'Type-safe props and state definition for interactive drag-and-drop components',
      'Seamless integration with react-beautiful-dnd and native Web APIs',
      'Eliminated runtime exceptions through strict type-checking',
      'Clean, modular file architecture structured for maintainability',
    ],
    metrics: [
      { labelVi: 'Type Safety', labelEn: 'Type Safety', value: '100%' },
      { labelVi: 'Strict Mode', labelEn: 'Strict Mode', value: 'Enabled' },
      { labelVi: 'Bắt lỗi runtime', labelEn: 'Runtime Errors Prevented', value: '99%' },
    ],
    productionUse: 'Taskify App & Ortho Fashion Codebase',
  },
  {
    id: 'ai_vton',
    name: 'Computer Vision & Deep Learning (VTON)',
    category: 'ai_cv',
    categoryNameVi: 'Trí Tuệ Nhân Tạo & Thị Giác',
    categoryNameEn: 'AI & Computer Vision',
    level: 96,
    gradeVi: 'Chuyên gia nghiên cứu',
    gradeEn: 'Master / Specialist',
    color: 'from-purple-400 to-pink-500 text-purple-300 border-purple-400/40',
    icon: '🧠',
    benchmarkVi: 'Tối ưu kiến trúc CatVTON',
    benchmarkEn: 'CatVTON Architecture Optimization',
    summaryVi: 'Nghiên cứu và triển khai mô hình Thử đồ ảo (Virtual Try-On), tối ưu kiến trúc CatVTON, phân đoạn DeepLabV3 và NLP.',
    summaryEn: 'Research and deployment of Virtual Try-On diffusion models, optimizing CatVTON, DeepLabV3 segmentation and NLP color steering.',
    highlightsVi: [
      'Tối ưu hóa tài nguyên phần cứng cho mô hình khuếch tán thử đồ CatVTON',
      'Ứng dụng DeepLabV3 và trích xuất đặc trưng trang phục với độ chi tiết cao',
      'Tích hợp câu lệnh ngôn ngữ tự nhiên (NLP) cho phép người dùng đổi màu trang phục tùy ý',
      'Đánh giá trên bộ dữ liệu chuẩn quốc tế DressCode và VITON-HD',
    ],
    highlightsEn: [
      'Hardware resource optimization for CatVTON diffusion try-on pipeline',
      'High-detail garment feature extraction using DeepLabV3 segmentation',
      'Integrated NLP natural language prompts for custom garment recoloring',
      'Benchmarked against international DressCode and VITON-HD datasets',
    ],
    metrics: [
      { labelVi: 'Khóa luận HCMUS', labelEn: 'HCMUS Thesis', value: 'Điểm Xuất Sắc' },
      { labelVi: 'Benchmark', labelEn: 'Benchmark Dataset', value: 'DressCode / VITON' },
      { labelVi: 'Nền tảng', labelEn: 'Tech Stack', value: 'PyTorch / OpenCV' },
    ],
    productionUse: 'Khóa luận Tốt nghiệp Cử nhân Thị giác Máy tính - HCMUS',
  },
  {
    id: 'systems_prog',
    name: 'Software Engineering (Java, C++, Python)',
    category: 'systems',
    categoryNameVi: 'Kỹ Thuật Phần Mềm & Hệ Thống',
    categoryNameEn: 'Software & Systems Engineering',
    level: 90,
    gradeVi: 'Vững chắc',
    gradeEn: 'Solid / Advanced',
    color: 'from-emerald-400 to-teal-500 text-emerald-300 border-emerald-400/40',
    icon: '⚡',
    benchmarkVi: 'Socket TCP/IP & Game Loop C++',
    benchmarkEn: 'Socket TCP/IP & SFML Game Loop',
    summaryVi: 'Lập trình mạng Socket TCP/IP từ xa trên Java, thuật toán tìm kiếm AI và hướng đối tượng C++ với SFML.',
    summaryEn: 'TCP/IP socket network programming in Java, core AI search algorithms and C++ object-oriented game architecture with SFML.',
    highlightsVi: [
      'Ứng dụng Điều khiển máy tính từ xa qua Java Socket: chụp màn hình, quản lý tiến trình',
      'Thiết kế Game Cờ Vua C++ theo chuẩn OOP, state pattern và đồ họa SFML',
      'Cài đặt thuật toán tìm kiếm A*, BFS, DFS, UCS, Minimax giải quyết bài toán AI',
      'Kỹ năng phân tích thuật toán và tối ưu độ phức tạp thời gian/bộ nhớ',
    ],
    highlightsEn: [
      'Remote Desktop Controller via Java Socket: screen streaming and process control',
      'C++ Chess Engine adhering to OOP, state patterns and SFML graphics',
      'Implemented A*, BFS, DFS, UCS, Minimax search algorithms for AI problems',
      'In-depth algorithmic analysis and time/space complexity optimization',
    ],
    metrics: [
      { labelVi: 'Giao thức', labelEn: 'Protocol', value: 'TCP/IP Socket' },
      { labelVi: 'Kiến trúc OOP', labelEn: 'Architecture', value: 'C++ Chuẩn mực' },
      { labelVi: 'Thuật toán AI', labelEn: 'AI Search', value: 'A* / Minimax' },
    ],
    productionUse: 'Remote Control Java App, Chess Game SFML & AI Search Projects',
  },
  {
    id: 'stem_media',
    name: 'Media Design, UI/UX & STEM/SEL',
    category: 'creative',
    categoryNameVi: 'Thiết Kế, Truyền Thông & Tác Động Xã Hội',
    categoryNameEn: 'Design, Communication & Social Impact',
    level: 94,
    gradeVi: 'Năng lực cốt lõi',
    gradeEn: 'Core Competency',
    color: 'from-rose-400 to-amber-500 text-rose-300 border-rose-400/40',
    icon: '🌱',
    benchmarkVi: '740+ Học sinh & 3+ Năm VietHope',
    benchmarkEn: '740+ Students & 3+ Yrs VietHope',
    summaryVi: 'Điều phối chương trình STEM & SEL cho thanh thiếu niên; sản xuất video, thiết kế ấn phẩm và quản trị web WordPress.',
    summaryEn: 'STEM & SEL youth curriculum facilitation; media production, graphic design and WordPress web administration.',
    highlightsVi: [
      'Điều phối đào tạo STEM tích hợp Kỹ năng Cảm xúc Xã hội (SEL) tại Kidspire Vietnam',
      'Thiết kế ấn phẩm truyền thông, poster, banner và dựng video cho VietHope Marketing Team',
      'Hỗ trợ nâng cấp và duy trì website VietHope trên WordPress',
      'Thiết kế website học thuật hội chợ game INFIKEY trên WiX',
    ],
    highlightsEn: [
      'Facilitated STEM & Social-Emotional Learning (SEL) training at Kidspire Vietnam',
      'Designed branding kits, marketing banners and video productions for VietHope',
      'Supported WordPress maintenance and enhancements for VietHope website',
      'Engineered INFIKEY game store website on WiX',
    ],
    metrics: [
      { labelVi: 'Học sinh đào tạo', labelEn: 'Trained Students', value: '740+ Em' },
      { labelVi: 'Phụ huynh tham gia', labelEn: 'Parents Engaged', value: '200+ Người' },
      { labelVi: 'Truyền thông VietHope', labelEn: 'VietHope Media', value: '3+ Năm gắn bó' },
    ],
    productionUse: 'Kidspire Vietnam, VietHope Marketing Team & INFIKEY Store',
  },
];

interface RadarAxis {
  labelVi: string;
  labelEn: string;
  score: number;
  icon: string;
  descVi: string;
  descEn: string;
  keyProjects: string;
}

const RADAR_AXES: RadarAxis[] = [
  {
    labelVi: 'Kỹ Thuật Frontend',
    labelEn: 'Frontend Engineering',
    score: 95,
    icon: '⚛️',
    descVi: 'React, Next.js, Tailwind CSS, TypeScript, Web3 MetaMask, tối ưu render và component hóa.',
    descEn: 'React, Next.js, Tailwind CSS, TypeScript, Web3 integration, render optimization.',
    keyProjects: 'Ortho Fashion, Taskify',
  },
  {
    labelVi: 'Thị Giác Máy Tính & AI',
    labelEn: 'Computer Vision & AI',
    score: 96,
    icon: '🧠',
    descVi: 'Deep Learning, mô hình thử đồ ảo CatVTON, DeepLabV3 segmentation, NLP color steering, PyTorch.',
    descEn: 'Deep Learning, CatVTON diffusion, DeepLabV3 segmentation, NLP color steering, PyTorch.',
    keyProjects: 'Khóa Luận Tốt Nghiệp HCMUS',
  },
  {
    labelVi: 'Khoa Học Máy Tính & Hệ Thống',
    labelEn: 'Computer Science & Systems',
    score: 90,
    icon: '⚡',
    descVi: 'Java Socket TCP/IP từ xa, C++ OOP và Game Engine SFML, giải thuật tìm kiếm A*, BFS, Minimax.',
    descEn: 'Java Socket TCP/IP, C++ OOP, SFML game engine, A* / Minimax algorithms.',
    keyProjects: 'Java Remote Control, SFML Chess',
  },
  {
    labelVi: 'Thiết Kế UI/UX & Media',
    labelEn: 'UI/UX & Media Design',
    score: 94,
    icon: '🎨',
    descVi: 'Thiết kế giao diện Figma, dựng video CapCut/Premiere, banner Canva, trực giác thẩm mỹ hài hòa.',
    descEn: 'Figma UI design, video editing, Canva media assets, intuitive visual hierarchy.',
    keyProjects: 'VietHope Media (3+ Năm), INFIKEY',
  },
  {
    labelVi: 'Giáo Dục STEM & Thấu Cảm',
    labelEn: 'STEM Education & Empathy',
    score: 92,
    icon: '🌱',
    descVi: 'Kỹ năng lắng nghe, thấu cảm người dùng (SEL), giảng dạy STEM cho 740+ học sinh và 200+ phụ huynh.',
    descEn: 'Empathy, active listening (SEL), STEM teaching for 740+ students and 200+ parents.',
    keyProjects: 'Kidspire Vietnam, VietHope',
  },
];

export const SkillsConstellationView: React.FC<SkillsConstellationViewProps> = ({
  onBackToWorld,
  onGainXP,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('all');
  const [selectedSkill, setSelectedSkill] = useState<TechSkill>(TECH_SKILLS[0]);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'radar'>('matrix');
  const [hoveredRadarIndex, setHoveredRadarIndex] = useState<number>(0);

  // Filter skills
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') return TECH_SKILLS;
    return TECH_SKILLS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelectSkill = (skill: TechSkill) => {
    soundManager.playBubblePop();
    setSelectedSkill(skill);
    setIsInspectModalOpen(true);
    onGainXP(15);
  };

  // Compute SVG Radar Polygon Coordinates
  const cx = 230;
  const cy = 230;
  const maxR = 155;
  const count = RADAR_AXES.length;

  const radarPolygonPoints = useMemo(() => {
    return RADAR_AXES.map((axis, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const r = (axis.score / 100) * maxR;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      return `${x},${y}`;
    }).join(' ');
  }, [count, cx, cy, maxR]);

  return (
    <div
      id="skills-constellation-view"
      className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-start select-none overflow-hidden"
    >
      {/* ─── 1. TOP HEADER BAR ─── */}
      <header className="pointer-events-auto fixed top-3 inset-x-3 sm:inset-x-6 z-40 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full liquid-glass shadow-2xl border border-white/40 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onBackToWorld();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 text-slate-800 dark:text-white font-black text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('Về Thế Giới 3D', '3D World')}</span>
          </button>
          <div className="h-4 w-px bg-white/30 dark:bg-slate-700 hidden sm:block" />
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent hidden md:inline-block">
            ⚡ {t('Đảo 03: Bản Đồ Năng Lực Kỹ Thuật • Tech Radar & Skills Matrix', 'Island 03: Skills Matrix & Radar')}
          </span>
        </div>

        {/* Mode Selector: Matrix vs Radar (Đã bỏ Live Shader Lab) */}
        <div className="flex items-center gap-1.5 p-1 rounded-full liquid-glass border border-white/30 dark:border-slate-700">
          <button
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('matrix');
            }}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-400'
            }`}
          >
            {t('Ma Trận Kỹ Năng', 'Skills Matrix')}
          </button>
          <button
            onClick={() => {
              soundManager.playClickSound();
              setActiveTab('radar');
            }}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-400'
            }`}
          >
            {t('Biểu Đồ Radar Năng Lực', 'Competency Radar')}
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN SCROLLABLE CONTENT ─── */}
      <main className="pointer-events-auto w-full h-full pt-18 sm:pt-22 pb-24 px-3 sm:px-6 overflow-y-auto no-scrollbar flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col gap-4">
          {/* TAB 1: TECH SKILL MATRIX - RPG ITEM CARDS GRID */}
          {activeTab === 'matrix' && (
            <div className="flex flex-col gap-5 w-full">
              {/* Category Filter Chips & Summary Header */}
              <div className="rounded-3xl liquid-glass p-4 sm:p-5 border border-white/40 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedCategory('all');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 scale-105'
                        : 'liquid-glass-pill text-slate-700 dark:text-slate-300 hover:text-cyan-400'
                    }`}
                  >
                    {t('Tất Cả Kho Trang Bị', 'All Inventory')} ({TECH_SKILLS.length})
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedCategory('frontend');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      selectedCategory === 'frontend'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 scale-105'
                        : 'liquid-glass-pill text-slate-700 dark:text-slate-300 hover:text-cyan-400'
                    }`}
                  >
                    ⚛️ Frontend & React/Next
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedCategory('ai_cv');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      selectedCategory === 'ai_cv'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 scale-105'
                        : 'liquid-glass-pill text-slate-700 dark:text-slate-300 hover:text-purple-400'
                    }`}
                  >
                    🧠 AI & Computer Vision
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedCategory('systems');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      selectedCategory === 'systems'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-105'
                        : 'liquid-glass-pill text-slate-700 dark:text-slate-300 hover:text-blue-400'
                    }`}
                  >
                    ⚡ Systems & CS
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedCategory('creative');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      selectedCategory === 'creative'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/20 scale-105'
                        : 'liquid-glass-pill text-slate-700 dark:text-slate-300 hover:text-amber-400'
                    }`}
                  >
                    🎨 Design & SEL
                  </button>
                </div>

                <div className="text-xs font-mono text-cyan-400 font-bold hidden md:block">
                  {t('⚡ Nhấp thẻ để xem thuộc tính chi tiết', '⚡ Click card to inspect attributes')}
                </div>
              </div>

              {/* RPG ITEM CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {filteredSkills.map((skill) => {
                  // Rarity definition
                  const isMythic = skill.level >= 95;
                  const isLegendary = skill.level >= 90 && skill.level < 95;
                  const rarityName = isMythic
                    ? t('Huyền Thoại • Mythic', 'Mythic')
                    : isLegendary
                    ? t('Thượng Thừa • Legendary', 'Legendary')
                    : t('Tinh Hoa • Epic', 'Epic');
                  const rarityColor = isMythic
                    ? 'from-purple-500 via-pink-500 to-cyan-400 text-pink-400 border-pink-400/40'
                    : isLegendary
                    ? 'from-cyan-400 to-blue-500 text-cyan-400 border-cyan-400/40'
                    : 'from-amber-400 to-rose-500 text-amber-400 border-amber-400/40';

                  return (
                    <div
                      key={skill.id}
                      onClick={() => handleSelectSkill(skill)}
                      className="group relative rounded-[28px] liquid-glass p-5 border border-white/40 dark:border-slate-700/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                      {/* Top Rarity Glow Beam */}
                      <div
                        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${rarityColor} opacity-70 group-hover:opacity-100 transition-opacity`}
                      />

                      {/* Card Header: Rarity & Level Badge */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/20 dark:border-slate-800">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 dark:bg-slate-900/60 border ${
                            isMythic
                              ? 'text-pink-400 border-pink-400/30'
                              : isLegendary
                              ? 'text-cyan-400 border-cyan-400/30'
                              : 'text-amber-400 border-amber-400/30'
                          }`}
                        >
                          {rarityName}
                        </span>

                        <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-white/30 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-white/30 dark:border-slate-700 shadow-sm">
                          LV. {skill.level}
                        </span>
                      </div>

                      {/* Item Icon Capsule & Name */}
                      <div className="my-4 flex flex-col items-center text-center gap-2.5">
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-white/30 to-white/10 dark:from-slate-800/80 dark:to-slate-900/80 border border-white/40 dark:border-slate-700 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <span>{skill.icon}</span>
                          {/* Inner glow */}
                          <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-sm pointer-events-none" />
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                            {skill.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {language === 'vi' ? skill.categoryNameVi : skill.categoryNameEn}
                          </span>
                        </div>
                      </div>

                      {/* Power / Energy Meter */}
                      <div className="flex flex-col gap-1.5 my-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-400">{t('Độ thuần thục', 'Mastery')}</span>
                          <span className="font-mono font-black text-cyan-400">{skill.level}% PWR</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-white/20 dark:border-slate-700">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              isMythic
                                ? 'from-purple-500 to-pink-500'
                                : isLegendary
                                ? 'from-cyan-400 to-blue-500'
                                : 'from-amber-400 to-orange-500'
                            } transition-all duration-700`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>

                      {/* Item Quick Attribute Tag */}
                      <div className="mt-3 pt-3 border-t border-white/20 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="truncate max-w-[140px] font-mono">
                          {language === 'vi' ? skill.metrics[0].labelVi : skill.metrics[0].labelEn}:{' '}
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {skill.metrics[0].value}
                          </span>
                        </span>
                        <span className="text-cyan-400 font-bold group-hover:underline flex items-center gap-0.5">
                          {t('Chi tiết', 'Inspect')} →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ITEM INSPECT MODAL (HIỂN THỊ THUỘC TÍNH CHI TIẾT TRANG BỊ KHI CLICK) */}
              {isInspectModalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
                  onClick={() => setIsInspectModalOpen(false)}
                >
                  <div
                    className="relative w-full max-w-lg rounded-[36px] liquid-glass p-6 sm:p-8 shadow-2xl border border-white/60 dark:border-slate-700 text-slate-900 dark:text-white flex flex-col gap-5 animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Close Button */}
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        setIsInspectModalOpen(false);
                      }}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/30 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700 flex items-center justify-center text-sm font-black hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      ✕
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3.5 pr-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400/30 to-blue-500/30 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-lg">
                        {selectedSkill.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            LV. {selectedSkill.level} • {selectedSkill.gradeVi}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                          {selectedSkill.name}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {language === 'vi' ? selectedSkill.categoryNameVi : selectedSkill.categoryNameEn}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/20 dark:bg-slate-900/50 p-4 rounded-2xl border border-white/20 dark:border-slate-800">
                      {language === 'vi' ? selectedSkill.summaryVi : selectedSkill.summaryEn}
                    </p>

                    {/* Metrics Breakdown */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {selectedSkill.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-white/30 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700 text-center flex flex-col justify-center"
                        >
                          <span className="text-sm font-black text-cyan-400 font-mono">{m.value}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                            {language === 'vi' ? m.labelVi : m.labelEn}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {t('Kiến Trúc & Tối Ưu Tiêu Biểu:', 'Key Architectural Highlights:')}
                      </span>
                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                        {(language === 'vi' ? selectedSkill.highlightsVi : selectedSkill.highlightsEn).map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{h}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Production Use Case Tag */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        {t('Dự án áp dụng:', 'Production:')}
                      </span>
                      <span className="text-xs font-black text-pink-400">{selectedSkill.productionUse}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FULL RADAR STATION WITH INTERACTIVE HOVER TARGET READOUT */}
          {activeTab === 'radar' && (
            <div className="flex flex-col gap-5 w-full items-center">
              {/* Top Banner Explaining the Full Radar Chart */}
              <div className="w-full rounded-3xl liquid-glass p-4 sm:p-5 border border-white/40 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {t(
                        'Trạm Radar Quét Năng Lực 5 Chiều • T-Shaped Competency Radar',
                        '5-Dimensional Competency Radar Station'
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t(
                        'Rê chuột hoặc nhấp vào bất kỳ điểm nào trên vòng radar để quét dữ liệu phân tích chi tiết.',
                        'Hover or tap any node on the radar sweep to inspect real-time competency analytics.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-500 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('Điểm trung bình: 93.4 / 100', 'Average Score: 93.4 / 100')}</span>
                </div>
              </div>

              {/* FULL RADAR SCREEN CONTAINER */}
              <div className="w-full rounded-[38px] liquid-glass p-6 sm:p-8 shadow-2xl border border-white/50 dark:border-slate-700/80 flex flex-col items-center relative overflow-hidden">
                {/* Radar Rotating Scan Beam Effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-30">
                  <div className="w-[380px] h-[380px] rounded-full border border-cyan-500/40 relative animate-spin [animation-duration:10s]">
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(6,182,212,0.4)_360deg)]" />
                  </div>
                </div>

                {/* SVG Radar Visualization */}
                <div className="relative w-full max-w-[440px] aspect-square my-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 460 460">
                    {/* Concentric Reference Rings (25%, 50%, 75%, 100%) */}
                    {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => (
                      <g key={sIdx}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={maxR * scale}
                          fill="none"
                          stroke="rgba(148, 163, 184, 0.25)"
                          strokeDasharray={scale === 1 ? 'none' : '4 4'}
                          strokeWidth="1.2"
                        />
                        <text
                          x={cx + 6}
                          y={cy - maxR * scale + 12}
                          className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500 font-bold select-none pointer-events-none"
                        >
                          {scale * 100}%
                        </text>
                      </g>
                    ))}

                    {/* Radial Spoke Lines and Labels */}
                    {RADAR_AXES.map((axis, i) => {
                      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
                      const x2 = cx + Math.cos(angle) * maxR;
                      const y2 = cy + Math.sin(angle) * maxR;

                      const labelOffset = 38;
                      const lx = cx + Math.cos(angle) * (maxR + labelOffset);
                      const ly = cy + Math.sin(angle) * (maxR + labelOffset);

                      const isHovered = hoveredRadarIndex === i;

                      return (
                        <g
                          key={i}
                          className="cursor-pointer group"
                          onMouseEnter={() => {
                            soundManager.playBubblePop();
                            setHoveredRadarIndex(i);
                          }}
                          onClick={() => {
                            soundManager.playClickSound();
                            setHoveredRadarIndex(i);
                          }}
                        >
                          {/* Spoke Line */}
                          <line
                            x1={cx}
                            y1={cy}
                            x2={x2}
                            y2={y2}
                            stroke={isHovered ? '#ec4899' : 'rgba(148, 163, 184, 0.35)'}
                            strokeWidth={isHovered ? '2.5' : '1.2'}
                            className="transition-colors"
                          />

                          {/* Outer Vertex Label */}
                          <text
                            x={lx}
                            y={ly}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`text-[11px] font-black transition-all ${
                              isHovered
                                ? 'fill-pink-500 scale-110 font-black'
                                : 'fill-slate-800 dark:fill-slate-200 group-hover:fill-cyan-400'
                            }`}
                          >
                            {axis.icon} {language === 'vi' ? axis.labelVi : axis.labelEn}
                          </text>
                          <text
                            x={lx}
                            y={ly + 15}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-[10px] font-mono font-black fill-cyan-400"
                          >
                            {axis.score}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Filled Radar Polygon */}
                    <polygon
                      points={radarPolygonPoints}
                      fill="rgba(236, 72, 153, 0.28)"
                      stroke="#ec4899"
                      strokeWidth="3"
                      className="transition-all duration-500 filter drop-shadow-[0_0_12px_rgba(236,72,153,0.5)]"
                    />

                    {/* Interactive Vertex Dots (Radar Blips) */}
                    {RADAR_AXES.map((axis, i) => {
                      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
                      const r = (axis.score / 100) * maxR;
                      const x = cx + Math.cos(angle) * r;
                      const y = cy + Math.sin(angle) * r;
                      const isHovered = hoveredRadarIndex === i;

                      return (
                        <g
                          key={i}
                          className="cursor-pointer"
                          onMouseEnter={() => {
                            soundManager.playBubblePop();
                            setHoveredRadarIndex(i);
                          }}
                          onClick={() => {
                            soundManager.playClickSound();
                            setHoveredRadarIndex(i);
                          }}
                        >
                          {/* Radar Pulse Wave */}
                          {isHovered && (
                            <circle
                              cx={x}
                              cy={y}
                              r="16"
                              fill="none"
                              stroke="#ec4899"
                              strokeWidth="2"
                              className="animate-ping"
                            />
                          )}

                          {/* Outer Glow Halo */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? '10' : '7'}
                            fill={isHovered ? '#ec4899' : '#06b6d4'}
                            className="transition-all duration-300"
                          />

                          {/* Inner Core Dot */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? '5' : '3.5'}
                            fill="#ffffff"
                            stroke="#0f172a"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* ─── REAL-TIME PIN MAP INFO CARD HOVERING DIRECTLY ON RADAR VERTEX ─── */}
                  <AnimatePresence>
                    {hoveredRadarIndex !== null && (() => {
                      const axis = RADAR_AXES[hoveredRadarIndex];
                      const angle = (hoveredRadarIndex / count) * Math.PI * 2 - Math.PI / 2;
                      const r = (axis.score / 100) * maxR;
                      const x = cx + Math.cos(angle) * r;
                      const y = cy + Math.sin(angle) * r;

                      const leftPct = (x / 460) * 100;
                      const topPct = (y / 460) * 100;

                      const isBottomHalf = y > 220;
                      const isRightHalf = x > 280;
                      const isLeftHalf = x < 180;

                      return (
                        <div
                          key={`pin-card-${hoveredRadarIndex}`}
                          className="absolute pointer-events-none z-30"
                          style={{
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                          }}
                        >
                          {/* Pulsing Beacon Target Point at exact dot */}
                          <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-pink-400 animate-ping opacity-60 pointer-events-none" />

                          {/* Floating Map Pin Information Card */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: isBottomHalf ? -10 : 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                            className={`w-56 sm:w-64 p-3.5 rounded-2xl liquid-glass border-2 border-pink-500/80 shadow-2xl backdrop-blur-2xl flex flex-col gap-2 pointer-events-auto select-none ${
                              isBottomHalf ? '-translate-y-full -mt-4' : 'mt-4'
                            } ${
                              isRightHalf
                                ? '-translate-x-[85%]'
                                : isLeftHalf
                                ? '-translate-x-[15%]'
                                : '-translate-x-1/2'
                            }`}
                          >
                            {/* Pin pointer tip arrow */}
                            <div
                              className={`absolute w-3 h-3 bg-pink-500/90 rotate-45 border border-pink-300 pointer-events-none ${
                                isBottomHalf
                                  ? '-bottom-1.5'
                                  : '-top-1.5'
                              } ${
                                isRightHalf
                                  ? 'right-8'
                                  : isLeftHalf
                                  ? 'left-8'
                                  : 'left-1/2 -translate-x-1/2'
                              }`}
                            />

                            {/* Card Header: Icon + Title + Score */}
                            <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-white/20 dark:border-slate-700/80">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xl">{axis.icon}</span>
                                <div>
                                  <div className="text-[9px] font-mono font-bold text-pink-400 tracking-wider uppercase">
                                    {t('ĐIỂM TRỤC RADAR', 'RADAR AXIS PIN')}
                                  </div>
                                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                                    {language === 'vi' ? axis.labelVi : axis.labelEn}
                                  </h4>
                                </div>
                              </div>

                              <div className="px-2 py-0.5 rounded-lg bg-pink-500/20 border border-pink-400/60 font-mono font-black text-pink-400 text-xs shadow-xs">
                                {axis.score}%
                              </div>
                            </div>

                            {/* Core Description Text */}
                            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                              {language === 'vi' ? axis.descVi : axis.descEn}
                            </p>

                            {/* Key Highlights / Benchmark Tags */}
                            <div className="pt-1 flex flex-col gap-1 border-t border-white/10 dark:border-slate-800">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500 dark:text-slate-400 font-mono">
                                  {t('Dự án áp dụng:', 'Projects:')}
                                </span>
                                <span className="font-bold text-cyan-400 truncate max-w-[130px]">
                                  {axis.keyProjects}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500 dark:text-slate-400 font-mono">
                                  {t('Đánh giá:', 'Evaluation:')}
                                </span>
                                <span className="font-black text-emerald-400">
                                  {axis.score >= 95
                                    ? language === 'vi'
                                      ? 'Bậc thầy (Rank S+)'
                                      : 'Master (Rank S+)'
                                    : language === 'vi'
                                    ? 'Chuyên gia (Rank S)'
                                    : 'Expert (Rank S)'}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* DYNAMIC RADAR TARGET READOUT HUD (HIỂN THỊ CHI TIẾT ĐIỂM ĐANG HOVER) */}
                <div className="w-full max-w-2xl mt-4 p-5 rounded-3xl bg-white/40 dark:bg-slate-900/70 border border-pink-500/40 shadow-2xl backdrop-blur-xl flex flex-col gap-3.5 transition-all duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-white/20 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{RADAR_AXES[hoveredRadarIndex].icon}</span>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-pink-500 font-black">
                          {t('MỤC TIÊU QUÉT RADAR ĐÃ KHÓA', 'RADAR TARGET LOCKED')}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {language === 'vi'
                            ? RADAR_AXES[hoveredRadarIndex].labelVi
                            : RADAR_AXES[hoveredRadarIndex].labelEn}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-mono font-black bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
                        {RADAR_AXES[hoveredRadarIndex].score}%
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400 uppercase">
                        {t('Chỉ số thuần thục', 'Proficiency Score')}
                      </span>
                    </div>
                  </div>

                  {/* Power Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${RADAR_AXES[hoveredRadarIndex].score}%` }}
                    />
                  </div>

                  {/* Description & Key Evidence */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {language === 'vi'
                      ? RADAR_AXES[hoveredRadarIndex].descVi
                      : RADAR_AXES[hoveredRadarIndex].descEn}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/20 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 font-mono text-cyan-400">
                      <span className="text-slate-400">{t('Minh chứng thực tế:', 'Key Evidence:')}</span>
                      <span className="font-bold">{RADAR_AXES[hoveredRadarIndex].keyProjects}</span>
                    </div>

                    <span className="text-[11px] text-pink-400 font-bold hidden sm:inline-block">
                      ★ {t('Cấp độ: Thượng thừa / Senior', 'Level: Senior / Master')}
                    </span>
                  </div>
                </div>

                {/* 5 Quick-Pill Selectors Under Radar */}
                <div className="flex items-center justify-center gap-2 flex-wrap mt-5">
                  {RADAR_AXES.map((axis, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        soundManager.playClickSound();
                        setHoveredRadarIndex(i);
                      }}
                      onMouseEnter={() => {
                        soundManager.playBubblePop();
                        setHoveredRadarIndex(i);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        hoveredRadarIndex === i
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                          : 'liquid-glass-pill text-slate-700 dark:text-slate-300 hover:text-pink-400'
                      }`}
                    >
                      <span>{axis.icon}</span>
                      <span>{language === 'vi' ? axis.labelVi : axis.labelEn}</span>
                      <span className="font-mono text-[10px] opacity-80">{axis.score}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
