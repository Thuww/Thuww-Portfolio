import React, { useState, useEffect } from 'react';
import { soundManager } from '../../audio/soundManager';
import {
  ArrowLeft,
  Compass,
  Sparkles,
  Award,
  Layers,
  Eye,
  CheckCircle2,
  Anchor,
  Ship,
  MapPin,
  Flame,
  Code,
  Coins,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ancientSeaMapImg from '../../assets/images/ancient_sea_map_1788945627476.jpg';

interface JournalExpeditionViewProps {
  onBackToWorld: () => void;
  onGainXP: (amount: number) => void;
}

export type SeaAtmosphere = 'aurora' | 'calm' | 'storm';

export interface MapIslandNode {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  coord: { x: number; y: number }; // Percentage 0-100 on map
  icon: string;
  color: string;
  accent: string;
  codeSnippet: string;
  lore: string;
  treasures: string[];
  xpReward: number;
  nauticalCoords: string;
}

const MAP_ISLANDS: MapIslandNode[] = [
  {
    id: 'island-2022',
    year: '2021-2022',
    title: 'Vịnh Khởi Nguyên • HCMUS & VietHope',
    subtitle: 'Bước chân vào ĐH Khoa học Tự nhiên & Sáng tạo nội dung giáo dục',
    coord: { x: 14, y: 62 },
    icon: '🎓',
    color: 'from-amber-400 to-orange-500',
    accent: '#f59e0b',
    codeSnippet: `// HCMUS Computer Vision & OOP\n#include <SFML/Graphics.hpp>\nclass ChessGame : public BoardGame {\n  void handlePlayerMove();\n};`,
    lore: 'Khởi đầu hành trình học tập tại Khoa CNTT - ĐH Khoa học Tự nhiên ĐHQG-HCM. Xây dựng nền tảng thuật toán vững chắc, lập trình C++ Game Cờ vua SFML, và đồng hành cùng VietHope trong vai trò Designer & Video Editor.',
    treasures: ['Học Bổng Đồng Hành Khuyến Học 📜', 'Dự Án Cờ Vua C++ SFML ♟️'],
    xpReward: 120,
    nauticalCoords: "10°46'N, 106°40'E",
  },
  {
    id: 'island-2023',
    year: '2023',
    title: 'Đảo Thuật Toán & Hệ Thống • Network & AI',
    subtitle: 'Remote Desktop Socket TCP/IP & Thuật toán tìm kiếm Pacman',
    coord: { x: 33, y: 32 },
    icon: '⚡',
    color: 'from-pink-500 to-rose-500',
    accent: '#f43f5e',
    codeSnippet: `// Java Socket TCP/IP Server\nServerSocket server = new ServerSocket(8888);\nSocket client = server.accept();\nRobot robot = new Robot(); // Screen capture & input control`,
    lore: 'Nghiên cứu lập trình mạng client-server điều khiển máy tính từ xa qua Java Socket và PowerShell. Triển khai các giải thuật tìm kiếm không gian trạng thái kinh điển: A*, BFS, DFS, Minimax với tỉ lệ tối ưu 100%.',
    treasures: ['Ứng Dụng Remote Desktop Java 🖥️', 'Chứng Nhận Thuật Toán AI Pacman 👾'],
    xpReward: 160,
    nauticalCoords: "10°45'N, 106°41'E",
  },
  {
    id: 'island-2024',
    year: '2024',
    title: 'Quần Đảo Thực Chiến • Ortho Fashion & Frontend',
    subtitle: 'Phát triển UI Login, AI Chatbot thời trang & Taskify Kanban',
    coord: { x: 53, y: 64 },
    icon: '💎',
    color: 'from-cyan-400 to-blue-500',
    accent: '#0ea5e9',
    codeSnippet: `// Ortho Fashion UI & AI Chatbot\nconst [messages, setMessages] = useState<ChatMessage[]>([]);\nconst handleFashionStyling = async (prompt: string) => {\n  const res = await callFashionChatbot(prompt);\n};`,
    lore: 'Gia nhập startup Ortho Fashion từ thực tập sinh lên Frontend Developer. Trực tiếp thiết kế UI đăng nhập và chatbot AI tư vấn trang phục, kết nối ví Web3 MetaMask. Tự xây dựng Taskify App bằng React + TypeScript.',
    treasures: ['Taskify Kanban App 📋', 'Kinh Nghiệm Thực Chiến Ortho 🛍️'],
    xpReward: 200,
    nauticalCoords: "10°47'N, 106°42'E",
  },
  {
    id: 'island-2025',
    year: '2025',
    title: 'Đỉnh Cao Khóa Luận • CatVTON & Kidspire',
    subtitle: 'Tốt nghiệp Xuất sắc GPA 8.35/10, Tuyển thẳng Thạc sĩ & STEM Facilitator',
    coord: { x: 72, y: 28 },
    icon: '👑',
    color: 'from-emerald-400 to-teal-500',
    accent: '#10b981',
    codeSnippet: `// Khóa luận Tốt nghiệp Virtual Try-On\nfrom catvton import TryOnPipeline\npipeline = TryOnPipeline.from_pretrained('catvton-v1')\nresult = pipeline(person=model_img, garment=cloth_img, text=nlp_color)`,
    lore: 'Hoàn thành khóa luận tốt nghiệp ứng dụng Deep Learning Virtual Try-On kết hợp CatVTON, DeepLabV3 phân đoạn và đổi màu y phục bằng câu lệnh văn bản. Tốt nghiệp GPA 8.35/10 và điều phối STEM & SEL cho hơn 740 học sinh.',
    treasures: ['Cử Nhân Thị Giác Máy Tính (HCMUS) 🎓', 'Chứng Nhận Tuyển Thẳng Thạc Sĩ 📜'],
    xpReward: 250,
    nauticalCoords: "10°46'N, 106°40'E",
  },
  {
    id: 'island-2026',
    year: '2026+',
    title: 'Chân Trời Phía Trước • Tech Lead & Full-Stack AI',
    subtitle: 'Sẵn sàng cống hiến cho các dự án Web hiện đại và tích hợp AI thông minh',
    coord: { x: 88, y: 55 },
    icon: '🌌',
    color: 'from-purple-500 to-indigo-600',
    accent: '#8b5cf6',
    codeSnippet: `// Ready for Innovative Engineering Opportunities!\nconst candidate = new Engineer({\n  name: 'Lê Thị Minh Thu',\n  roles: ['Frontend Developer', 'AI/CV Specialist'],\n  status: 'Ready to join great teams'\n});`,
    lore: 'Mở rộng kiến thức về Full-Stack, Web tương tác 3D và On-device AI. Sẵn sàng mang tư duy kỹ thuật chỉn chu, tinh thần trách nhiệm cao và khả năng học hỏi nhanh vào môi trường công nghệ chuyên nghiệp.',
    treasures: ['Hồ Sơ CV Fast-Track 2026 📑', 'Sẵn Sàng Nhận Việc Ngay 🚀'],
    xpReward: 300,
    nauticalCoords: "10°48'N, 106°45'E",
  },
];

export const JournalExpeditionView: React.FC<JournalExpeditionViewProps> = ({
  onBackToWorld,
  onGainXP,
}) => {
  const [selectedIsland, setSelectedIsland] = useState<MapIslandNode>(MAP_ISLANDS[3]);
  const [shipCoord, setShipCoord] = useState<{ x: number; y: number }>(MAP_ISLANDS[3].coord);
  const [shipAngle, setShipAngle] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [lootedIslands, setLootedIslands] = useState<string[]>(['island-2022', 'island-2023']);
  const [isLooting, setIsLooting] = useState<boolean>(false);
  const [atmosphere, setAtmosphere] = useState<SeaAtmosphere>('aurora');
  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(false);
  const [lightningFlash, setLightningFlash] = useState<boolean>(false);

  // Storm lightning periodic flash effect
  useEffect(() => {
    if (atmosphere !== 'storm') {
      setLightningFlash(false);
      return;
    }

    const triggerLightning = () => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 140);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerLightning();
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [atmosphere]);

  // Navigate ship to target island
  const handleSelectIsland = (island: MapIslandNode) => {
    if (island.id === selectedIsland.id) return;
    soundManager.playShipSailSound();

    // Calculate angle towards target island
    const dx = island.coord.x - shipCoord.x;
    const dy = island.coord.y - shipCoord.y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    setShipAngle(angleDeg);
    setShipCoord(island.coord);
    setSelectedIsland(island);
    onGainXP(40);
  };

  // Auto-Cruise through all islands
  const handleAutoCruise = () => {
    if (isAutoCruising) return;
    setIsAutoCruising(true);
    soundManager.playLevelUpSound();

    let step = 0;
    const interval = setInterval(() => {
      if (step >= MAP_ISLANDS.length) {
        clearInterval(interval);
        setIsAutoCruising(false);
        confetti({ particleCount: 100, spread: 80 });
        return;
      }
      handleSelectIsland(MAP_ISLANDS[step]);
      step++;
    }, 2400);
  };

  // Claim island treasure chest
  const handleClaimTreasure = () => {
    if (lootedIslands.includes(selectedIsland.id) || isLooting) return;
    soundManager.playLootDropSound();
    setIsLooting(true);

    setTimeout(() => {
      setLootedIslands((prev) => [...prev, selectedIsland.id]);
      setIsLooting(false);
      onGainXP(selectedIsland.xpReward);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.7 },
      });
    }, 500);
  };

  return (
    <div
      id="journal-expedition-island"
      className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between select-none overflow-hidden"
    >
      {/* ─── 1. TOP BAR ─────────────────────────────────────────────────── */}
      <div className="pointer-events-auto px-4 sm:px-8 py-3 mt-2 mx-3 sm:mx-6 rounded-[28px] liquid-glass shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onBackToWorld();
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 text-emerald-600 dark:text-emerald-400 font-black text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Thế Giới Đảo</span>
          </button>
          <div className="h-4 w-px bg-white/40 dark:bg-slate-700 hidden sm:block" />
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent hidden sm:inline-block">
            🗺️ Đảo 04: Hải Trình Khám Phá • 2D Treasure Sea Chart & Sailing Ship
          </span>
        </div>

        <button
          onClick={() => {
            soundManager.playClickSound();
            setIsMinimized(!isMinimized);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all cursor-pointer"
        >
          {isMinimized ? <Layers className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isMinimized ? 'Hiện Bản Đồ' : 'Ẩn (Ngắm 3D)'}</span>
        </button>
      </div>

      {/* ─── 2. MAIN 2D MAP & TREASURE DISCOVERY CONTAINER ───────────────── */}
      {!isMinimized && (
        <div className="pointer-events-auto flex-1 w-full max-w-6xl mx-auto p-3 sm:p-5 flex items-center justify-center overflow-y-auto no-scrollbar pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
            {/* ─── CỘT TRÁI (8 COLS): BẢN ĐỒ BIỂN GAME 2D VỚI THUYỀN DI CHUYỂN ─── */}
            <div className="lg:col-span-8 rounded-[38px] liquid-glass p-5 shadow-2xl border border-white/50 dark:border-slate-700/70 flex flex-col justify-between relative overflow-hidden">
              {/* Map Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/30 dark:border-slate-700/60 z-10">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-500 animate-spin" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    HẢI ĐỒ ĐẠI DƯƠNG AETHERIA • NHẤP ĐẢO ĐỂ THUYỀN GIƯƠNG BUỒM
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Atmosphere Filter */}
                  <div className="flex items-center gap-1 p-0.5 rounded-full bg-black/30 border border-white/20">
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        setAtmosphere('aurora');
                      }}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                        atmosphere === 'aurora'
                          ? 'bg-cyan-500 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🌌 Aurora
                    </button>
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        setAtmosphere('calm');
                      }}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                        atmosphere === 'calm'
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ☀️ Biển Lặng
                    </button>
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        setAtmosphere('storm');
                      }}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all cursor-pointer ${
                        atmosphere === 'storm'
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚡ Bão GLSL
                    </button>
                  </div>

                  {/* Auto Cruise Button */}
                  <button
                    onClick={handleAutoCruise}
                    disabled={isAutoCruising}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-[10px] font-black flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Ship className="w-3 h-3" />
                    <span>{isAutoCruising ? 'Đang Du Hành...' : 'Tự Động Giương Buồm'}</span>
                  </button>
                </div>
              </div>

              {/* 2D Fantasy Nautical Cartography Canvas */}
              <div
                className={`relative w-full h-84 sm:h-98 rounded-3xl border border-cyan-500/40 overflow-hidden my-3 shadow-2xl transition-all duration-700 select-none ${
                  lightningFlash ? 'brightness-150 contrast-125' : ''
                } ${
                  atmosphere === 'aurora'
                    ? 'bg-gradient-to-b from-[#02101b] via-[#051c27] to-[#020b12]'
                    : atmosphere === 'calm'
                    ? 'bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#082f49]'
                    : 'bg-gradient-to-b from-[#190b2c] via-[#100820] to-[#06040d]'
                }`}
              >
                {/* ─── REALISTIC ANCIENT SEA CHART PARCHMENT OVERLAY ─── */}
                <div
                  className="absolute inset-0 pointer-events-none bg-cover bg-center mix-blend-overlay opacity-30"
                  style={{ backgroundImage: `url(${ancientSeaMapImg})` }}
                />
                {/* ─── ATMOSPHERE WEATHER LAYERS ─── */}
                {/* 1. AURORA BOREALIS ATMOSPHERE: Dynamic Green/Purple Ribbons & Celestial Stars */}
                {atmosphere === 'aurora' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Waving Aurora Mesh Light Ribbons */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/20 via-teal-400/25 to-purple-600/20 blur-2xl opacity-60 animate-pulse [animation-duration:6s]" />
                    <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-teal-400/15 via-emerald-500/10 to-transparent blur-xl" />

                    {/* Celestial Night Stars */}
                    {[
                      { x: 12, y: 15 },
                      { x: 28, y: 8 },
                      { x: 45, y: 22 },
                      { x: 62, y: 12 },
                      { x: 78, y: 18 },
                      { x: 88, y: 9 },
                      { x: 20, y: 75 },
                      { x: 50, y: 82 },
                      { x: 82, y: 70 },
                    ].map((star, sIdx) => (
                      <div
                        key={sIdx}
                        className="absolute w-1 h-1 rounded-full bg-cyan-200 animate-ping [animation-duration:3s]"
                        style={{
                          left: `${star.x}%`,
                          top: `${star.y}%`,
                          animationDelay: `${sIdx * 0.4}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* 2. CALM SUNNY HORIZON: Shimmering Sunlight Caustics & Gentle Waves */}
                {atmosphere === 'calm' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Sun rays glare diagonal */}
                    <div className="absolute top-0 right-10 w-96 h-96 bg-gradient-to-bl from-amber-300/20 via-sky-300/10 to-transparent blur-2xl" />
                    {/* Sea caustics ripple lines */}
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30" />
                  </div>
                )}

                {/* 3. TEMPEST STORM ATMOSPHERE: Slanting Rain & Thunder Lightning Burst */}
                {atmosphere === 'storm' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Thunder Lightning Violet Burst */}
                    {lightningFlash && (
                      <div className="absolute inset-0 bg-purple-300/40 backdrop-blur-[1px] transition-opacity duration-100" />
                    )}

                    {/* Slanting Rain Streaks */}
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_90%,rgba(192,132,252,0.3)_91%,transparent_92%)] [background-size:18px_18px] opacity-40 animate-pulse" />

                    {/* Dark Tempest Swell Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-black/60" />
                  </div>
                )}

                {/* ─── NAUTICAL MERCATOR GRID LINES & COORDINATES ─── */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35">
                  {/* Latitude Lines */}
                  <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 6" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 6" />
                  <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 6" />

                  {/* Longitude Lines */}
                  <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 6" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 6" />
                  <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3 6" />
                </svg>

                {/* Mercator Coordinate Labels around Border */}
                <div className="absolute top-1 left-2 text-[8px] font-mono text-cyan-400/70 select-none pointer-events-none">
                  10°52'N / 106°30'E
                </div>
                <div className="absolute top-1 right-16 text-[8px] font-mono text-cyan-400/70 select-none pointer-events-none">
                  10°52'N / 106°55'E
                </div>
                <div className="absolute bottom-1 left-2 text-[8px] font-mono text-cyan-400/70 select-none pointer-events-none">
                  10°40'N / 106°30'E
                </div>

                {/* Real-time Maritime Cockpit HUD (Top Left) */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 p-2.5 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan-300 pointer-events-none shadow-xl">
                  <div className="flex items-center gap-2 font-black text-white">
                    <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span>
                      {atmosphere === 'storm'
                        ? '⚠️ CẢNH BÁO BÃO CẤP 8 • 32 KTS'
                        : atmosphere === 'calm'
                        ? '☀️ BIỂN LẶNG QUANG ĐÃNG • 12 KTS'
                        : '🌌 DẠ QUANG CỰC QUANG • 18 KTS'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-300 gap-3">
                    <span>
                      GÓC LÁI: <strong className="text-amber-300">{Math.round((shipAngle % 360 + 360) % 360)}°</strong>
                    </span>
                    <span>
                      ĐÍCH ĐẾN: <strong className="text-emerald-400">{selectedIsland.year}</strong>
                    </span>
                  </div>
                </div>

                {/* Authentic 8-Point Nautical Compass Rose (Top Right) */}
                <div className="absolute top-3 right-3 z-10 w-12 h-12 select-none pointer-events-none opacity-80 filter drop-shadow-md">
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-spin [animation-duration:40s]">
                    {/* Compass Outer Ring */}
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="1" />

                    {/* Cardinal Needles */}
                    {/* North (Red) */}
                    <polygon points="50,6 55,50 50,45" fill="#ef4444" />
                    <polygon points="50,6 45,50 50,45" fill="#b91c1c" />
                    {/* South */}
                    <polygon points="50,94 55,50 50,55" fill="#94a3b8" />
                    <polygon points="50,94 45,50 50,55" fill="#64748b" />
                    {/* East */}
                    <polygon points="94,50 50,55 55,50" fill="#38bdf8" />
                    <polygon points="94,50 50,45 55,50" fill="#0284c7" />
                    {/* West */}
                    <polygon points="6,50 50,55 45,50" fill="#38bdf8" />
                    <polygon points="6,50 50,45 45,50" fill="#0284c7" />

                    {/* Center Pivot */}
                    <circle cx="50" cy="50" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
                    <text x="50" y="18" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">N</text>
                  </svg>
                </div>

                {/* SVG Bathymetric Isobaths & Sailing Routes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Bathymetry Isobaths (Đường đẳng sâu chân thực quanh đảo) */}
                  {MAP_ISLANDS.map((isle) => (
                    <g key={`contour-${isle.id}`}>
                      {/* Depth 15m */}
                      <circle
                        cx={`${isle.coord.x}%`}
                        cy={`${isle.coord.y}%`}
                        r="32"
                        fill="none"
                        stroke={atmosphere === 'aurora' ? '#2dd4bf' : atmosphere === 'storm' ? '#c084fc' : '#38bdf8'}
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity="0.35"
                      />
                      {/* Depth 45m */}
                      <circle
                        cx={`${isle.coord.x}%`}
                        cy={`${isle.coord.y}%`}
                        r="52"
                        fill="none"
                        stroke={atmosphere === 'aurora' ? '#14b8a6' : atmosphere === 'storm' ? '#a855f7' : '#0284c7'}
                        strokeWidth="0.8"
                        strokeDasharray="2 6"
                        opacity="0.25"
                      />
                    </g>
                  ))}

                  {/* Sailing Routes Connecting Islands (Tuyến đường hàng hải) */}
                  {MAP_ISLANDS.map((isle, idx) => {
                    if (idx === MAP_ISLANDS.length - 1) return null;
                    const nextIsle = MAP_ISLANDS[idx + 1];
                    const routeColor =
                      atmosphere === 'storm' ? '#d8b4fe' : atmosphere === 'calm' ? '#fde047' : '#5eead4';
                    return (
                      <g key={isle.id}>
                        {/* Outer Glow Route */}
                        <line
                          x1={`${isle.coord.x}%`}
                          y1={`${isle.coord.y}%`}
                          x2={`${nextIsle.coord.x}%`}
                          y2={`${nextIsle.coord.y}%`}
                          stroke={routeColor}
                          strokeWidth="4"
                          strokeDasharray="8 6"
                          strokeOpacity="0.3"
                        />
                        {/* Core Route Line */}
                        <line
                          x1={`${isle.coord.x}%`}
                          y1={`${isle.coord.y}%`}
                          x2={`${nextIsle.coord.x}%`}
                          y2={`${nextIsle.coord.y}%`}
                          stroke={routeColor}
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          strokeOpacity="0.85"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* ─── MOVING EXPEDITION SHIP WITH REALISTIC FOAM WAKE (THUYỀN DI CHUYỂN CÓ BỌT SÓNG) ─── */}
                <div
                  className="absolute z-20 transition-all duration-1000 ease-out pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${shipCoord.x}%`,
                    top: `${shipCoord.y}%`,
                    transform: `translate(-50%, -50%) rotate(${shipAngle}deg)`,
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Dual Stern Wake Water Foam (Hai vệt rẽ sóng nước phía đuôi thuyền) */}
                    <div className="absolute -left-7 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
                      <span className="w-6 h-1.5 rounded-full bg-white/40 blur-[1px] animate-ping" />
                      <span className="w-8 h-2 rounded-full bg-cyan-300/30 blur-[2px] animate-pulse" />
                    </div>

                    {/* Expanding Sea Ripple Ping */}
                    <span className="absolute w-14 h-14 rounded-full border-2 border-cyan-400/50 animate-ping" />

                    {/* Ship Vessel Body */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-slate-950 flex items-center justify-center text-2xl shadow-2xl shadow-amber-500/60 border-2 border-white hover:scale-110 transition-transform">
                      ⛵
                    </div>
                  </div>
                </div>

                {/* ─── TIMELINE ISLAND NODES (CÁC ĐẢO TRÊN BẢN ĐỒ) ───────── */}
                {MAP_ISLANDS.map((isle) => {
                  const isSelected = isle.id === selectedIsland.id;
                  const isLooted = lootedIslands.includes(isle.id);
                  return (
                    <button
                      key={isle.id}
                      onClick={() => handleSelectIsland(isle)}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-300 hover:scale-120"
                      style={{
                        left: `${isle.coord.x}%`,
                        top: `${isle.coord.y}%`,
                      }}
                    >
                      {/* Outer Beacon Ripple for Selected Island */}
                      {isSelected && (
                        <span className="absolute -inset-2 rounded-full border-2 border-emerald-400/80 animate-ping pointer-events-none" />
                      )}

                      {/* Island Glow Ring */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 shadow-xl backdrop-blur-md ${
                          isSelected
                            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white ring-4 ring-emerald-300/80 scale-110 shadow-emerald-500/50'
                            : 'bg-slate-950/85 text-white border-2 border-emerald-400/50 hover:border-emerald-300 group-hover:bg-slate-900'
                        }`}
                      >
                        {isle.icon}
                      </div>

                      {/* Island Year Pill */}
                      <span
                        className={`mt-1 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider drop-shadow-md transition-all duration-300 ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-black/70 text-emerald-300 border border-emerald-400/30 group-hover:border-emerald-400 group-hover:text-white'
                        }`}
                      >
                        {isle.year} {isLooted && '✓'}
                      </span>
                    </button>
                  );
                })}

                {/* Nautical Miles Scale Bar (Bottom Right) */}
                <div className="absolute bottom-2 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-[9px] font-mono text-slate-300 pointer-events-none">
                  <span>0</span>
                  <div className="w-12 h-1 bg-gradient-to-r from-white via-cyan-400 to-white" />
                  <span>50 NM</span>
                  <span className="text-cyan-400 font-bold ml-1">1:250,000</span>
                </div>
              </div>

              {/* Bottom Legend */}
              <div className="pt-2 border-t border-white/30 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>VẬN TỐC TỰ DO: 18 HẢI LÝ/GIỜ</span>
                </span>
                <span className="text-emerald-500 font-bold">HẢI TRÌNH PHÁT TRIỂN 4 NĂM (2022 - 2026+)</span>
              </div>
            </div>

            {/* ─── CỘT PHẢI (4 COLS): KHÁM PHÁ KHO BÁU (TREASURE SCROLL) ──── */}
            <div className="lg:col-span-4 rounded-[38px] liquid-glass p-5 sm:p-6 shadow-2xl border border-white/50 dark:border-slate-700/70 flex flex-col justify-between">
              <div>
                {/* Treasure Box Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/30 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🎁</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      RƯƠNG BÁU ĐẢO {selectedIsland.year}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 font-bold">
                    +{selectedIsland.xpReward} XP
                  </span>
                </div>

                {/* Island Title */}
                <div className="mt-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      ĐỊA ĐIỂM CẬP BẾN:
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      📍 {selectedIsland.nauticalCoords}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight mt-0.5">
                    {selectedIsland.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedIsland.subtitle}
                  </p>
                </div>

                {/* Ancient Rune Code Milestone */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-900/90 text-cyan-300 font-mono text-[10px] border border-cyan-400/30 overflow-x-auto shadow-inner relative group">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase mb-1">
                    <span>BIA ĐÁ KHẮC CODE LỊCH SỬ:</span>
                    <span className="text-emerald-400 font-bold">MILESTONE</span>
                  </div>
                  <pre className="leading-tight">{selectedIsland.codeSnippet}</pre>
                </div>

                {/* Island Lore Story */}
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal bg-white/30 dark:bg-slate-800/40 p-3 rounded-2xl border border-white/30">
                  "{selectedIsland.lore}"
                </p>

                {/* Loot Items Discovered */}
                <div className="mt-3 pt-2 border-t border-white/30 dark:border-slate-700/60">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider block mb-1.5">
                    BẢO VẬT TRỤC VỚT ĐƯỢC:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {selectedIsland.treasures.map((loot, i) => (
                      <div
                        key={i}
                        className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{loot}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Claim Treasure Button */}
              <button
                onClick={handleClaimTreasure}
                disabled={lootedIslands.includes(selectedIsland.id) || isLooting}
                className={`mt-4 w-full py-3.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl ${
                  lootedIslands.includes(selectedIsland.id)
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-white/20'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:scale-105 active:scale-95 text-white shadow-emerald-500/30'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>
                  {lootedIslands.includes(selectedIsland.id)
                    ? 'ĐÃ TRỤC VỚT KHO BÁU NÀY ✓'
                    : `Mở Rương Báu (+${selectedIsland.xpReward} XP)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
