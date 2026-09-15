import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Map,
  Radio,
  Users,
  Heart,
  MessageSquare,
  Share2,
  ExternalLink,
  Github,
  Code2,
  Sparkles,
  Zap,
  Check,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Send,
  Terminal,
  Play,
  Eye,
  Flame,
  Layers,
  Award,
  RefreshCw,
  Info,
  Laptop,
  Gamepad2,
  SlidersHorizontal,
  X,
  Tv,
  Globe,
  Smartphone,
  Monitor,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROJECTS, PERSONAL_INFO } from '../../data/portfolioData';
import { Project } from '../../types';
import { soundManager } from '../../audio/soundManager';
import { useLanguage } from '../../context/LanguageContext';
import streamShowcaseImg from '../../assets/images/stream_showcase_1788945642068.jpg';
import { ProjectShowroomMonitor } from './ProjectShowroomMonitor';

interface ProjectsArcadeViewProps {
  onBackToWorld: () => void;
  onGainXP: (amount: number) => void;
  onWarpToSection?: (section: any) => void;
}

type CategoryFilter = 'all' | 'Web & Frontend' | 'Software & AI' | 'Design & Media';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface SimulatedChatMessage {
  id: string;
  sender: string;
  badge: string;
  text: string;
  textEn?: string;
  time: string;
  timeEn?: string;
  color: string;
}

const DEFAULT_CHATS: Record<string, SimulatedChatMessage[]> = {
  'graduation-invitation': [
    { id: 'g1', sender: 'HCMUS_Friend', badge: 'FRIEND', text: 'Website thiệp mời tốt nghiệp siêu xinh! Tông retro pixel và thư mời rất ấm áp 💖', textEn: 'The graduation invitation website is awesome! Loved the retro pixel vibe and letter 💖', time: '1 phút trước', timeEn: '1m ago', color: 'text-pink-400' },
    { id: 'g2', sender: 'Frontend_Reviewer', badge: 'DEV', text: 'Responsive mượt cả desktop lẫn điện thoại, load Firebase Hosting vèo vèo 🚀', textEn: 'Responsive layout works like a charm on phone and PC, super fast Firebase load 🚀', time: '2 phút trước', timeEn: '2m ago', color: 'text-cyan-400' },
    { id: 'g3', sender: 'Creative_Tech', badge: 'PRO', text: 'Tự lên ý tưởng và code thiệp mời tương tác thế này vừa ý nghĩa vừa thể hiện tay nghề!', textEn: 'Building an interactive invitation site from scratch is both meaningful and creative!', time: '4 phút trước', timeEn: '4m ago', color: 'text-amber-400' },
  ],
  'ortho-fashion': [
    { id: 'o1', sender: 'TechLead_VN', badge: 'VIP', text: 'Chatbot AI và UI Login của Ortho Fashion làm rất chỉn chu!', textEn: 'The AI Stylist Chatbot and Login UI for Ortho Fashion are super polished!', time: '1 phút trước', timeEn: '1m ago', color: 'text-amber-400' },
    { id: 'o2', sender: 'Web3_Explorer', badge: 'DEV', text: 'Tích hợp ví MetaMask và Three.js WebGL mượt mà quá 👍', textEn: 'MetaMask Web3 wallet connection and Three.js canvas run buttery smooth 👍', time: '2 phút trước', timeEn: '2m ago', color: 'text-cyan-400' },
    { id: 'o3', sender: 'Senior_HR', badge: 'RECRUITER', text: 'Kinh nghiệm thực chiến từ Intern lên Developer tại Ortho rất ấn tượng!', textEn: 'Direct progression from Intern to Developer at Ortho Fashion is impressive!', time: '3 phút trước', timeEn: '3m ago', color: 'text-pink-400' },
  ],
  'viethope-vsdp': [
    { id: 'v1', sender: 'VietHope_Alumni', badge: 'COMMUNITY', text: 'Portal ứng tuyển và chấm điểm AI cho học bổng VSDP rất thiết thực 🌟', textEn: 'Application portal and AI grading for VSDP scholarship are truly practical 🌟', time: '1 phút trước', timeEn: '1m ago', color: 'text-emerald-400' },
    { id: 'v2', sender: 'Judge_Member', badge: 'JUDGE', text: 'Form đăng ký nhiều bước và dashboard chấm điểm trực quan cho ban giám khảo.', textEn: 'Multi-step registration form and intuitive scoring dashboard for judges.', time: '2 phút trước', timeEn: '2m ago', color: 'text-cyan-400' },
  ],
  'virtual-tryon-ai': [
    { id: 't1', sender: 'AI_Researcher', badge: 'PRO', text: 'Cải tiến CatVTON giảm chi phí phần cứng mà vẫn giữ nét vải rất xuất sắc!', textEn: 'CatVTON optimization cuts hardware overhead while retaining sharp garment folds!', time: '1 phút trước', timeEn: '1m ago', color: 'text-pink-400' },
    { id: 't2', sender: 'HCMUS_Peer', badge: 'HCMUS', text: 'Kết hợp DeepLabV3 với NLP đổi màu áo qua câu lệnh văn bản quá hay 👏', textEn: 'Pairing DeepLabV3 with NLP to recolor shirts via natural language prompt is brilliant 👏', time: '3 phút trước', timeEn: '3m ago', color: 'text-amber-400' },
  ],
  'taskify-app': [
    { id: 'k1', sender: 'ReactDev', badge: 'FAN', text: 'Thao tác kéo thả react-beautiful-dnd mượt mà, type safety 100%!', textEn: 'Smooth react-beautiful-dnd drag & drop with 100% strict TypeScript types!', time: '1 phút trước', timeEn: '1m ago', color: 'text-emerald-400' },
  ],
  'remote-control-java': [
    { id: 'r1', sender: 'JavaEngineer', badge: 'DEV', text: 'Lập trình Socket TCP/IP, chụp màn hình và điều khiển tiến trình qua PowerShell rất vững.', textEn: 'Solid TCP/IP socket programming, live screen streaming, and PowerShell process control.', time: '2 phút trước', timeEn: '2m ago', color: 'text-indigo-400' },
  ],
  'chess-game-cpp': [
    { id: 'c1', sender: 'GameDevVN', badge: 'DEV', text: 'Áp dụng OOP trong C++ và thư viện SFML xử lý game loop rất bài bản!', textEn: 'Textbook C++ OOP design and SFML graphics handling 60 FPS game loops!', time: '2 phút trước', timeEn: '2m ago', color: 'text-purple-400' },
  ],
};

export const ProjectsArcadeView: React.FC<ProjectsArcadeViewProps> = ({
  onBackToWorld,
  onGainXP,
}) => {
  const { language, setLanguage, t } = useLanguage();
  // Active Project & Filtering
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS[0]?.id || 'graduation-invitation');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'chat'>('overview');

  // Interactive Live Stream States
  const [isLiveMuted, setIsLiveMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [hasVisitedMap, setHasVisitedMap] = useState<Record<string, boolean>>({
    [PROJECTS[0]?.id || '']: true,
  });

  // Live Web Simulation States & Project Showroom States
  const [streamViewMode, setStreamViewMode] = useState<'showroom' | 'live_web' | 'studio_canvas'>(
    PROJECTS[0]?.id === 'graduation-invitation' ? 'live_web' : 'showroom'
  );
  const [webDeviceMode, setWebDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [isStreamMaximized, setIsStreamMaximized] = useState(false);

  // Simulated Metrics (viewers, likes)
  const [viewersMap, setViewersMap] = useState<Record<string, number>>({
    'graduation-invitation': 1480,
    'ortho-fashion': 1650,
    'viethope-vsdp': 1240,
    'virtual-tryon-ai': 1890,
    'taskify-app': 820,
    'remote-control-java': 710,
    'chess-game-cpp': 650,
    'ai-search-games': 780,
    'rock-paper-scissors': 540,
    'viethope-media': 960,
    'infikey-gradinvite': 1480,
  });

  const [likesMap, setLikesMap] = useState<Record<string, number>>({
    'graduation-invitation': 980,
    'ortho-fashion': 940,
    'viethope-vsdp': 810,
    'virtual-tryon-ai': 1120,
    'taskify-app': 530,
    'remote-control-java': 460,
    'chess-game-cpp': 410,
    'ai-search-games': 520,
    'rock-paper-scissors': 380,
    'viethope-media': 670,
    'infikey-gradinvite': 980,
  });

  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});

  // Live Simulated Chat Feed & User Input
  const [chatMap, setChatMap] = useState<Record<string, SimulatedChatMessage[]>>(DEFAULT_CHATS);
  const [userChatInput, setUserChatInput] = useState('');

  // Mobile Reels State
  const [mobileReelIndex, setMobileReelIndex] = useState(0);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Stream Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return PROJECTS;
    return PROJECTS.filter((p) => {
      const cat = p.category.toLowerCase();
      if (selectedCategory === 'Web & Frontend') {
        return cat.includes('web') || cat.includes('frontend') || cat.includes('creative');
      }
      if (selectedCategory === 'Software & AI') {
        return cat.includes('ai') || cat.includes('software') || cat.includes('game') || cat.includes('vision');
      }
      if (selectedCategory === 'Design & Media') {
        return cat.includes('design') || cat.includes('media');
      }
      return p.category === selectedCategory;
    });
  }, [selectedCategory]);

  const activeProject = useMemo(() => {
    return PROJECTS.find((p) => p.id === activeProjectId) || PROJECTS[0];
  }, [activeProjectId]);

  // Keep mobileReelIndex synced when active project changes
  useEffect(() => {
    const idx = filteredProjects.findIndex((p) => p.id === activeProjectId);
    if (idx !== -1 && idx !== mobileReelIndex) {
      setMobileReelIndex(idx);
    }
  }, [activeProjectId, filteredProjects]);

  // Periodic subtle viewer count fluctuation for realistic live stream feel
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          next[id] = Math.max(100, next[id] + delta);
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Award discovery XP when a project is selected for the first time
  const handleSelectProject = useCallback(
    (projId: string) => {
      soundManager.playClickSound();
      setActiveProjectId(projId);

      // Set appropriate screen mode: Live Web for interactive web iframes, Showroom for project galleries
      if (projId === 'graduation-invitation') {
        setStreamViewMode('live_web');
      } else {
        setStreamViewMode('showroom');
      }

      if (!hasVisitedMap[projId]) {
        setHasVisitedMap((prev) => ({ ...prev, [projId]: true }));
        onGainXP(60);
        soundManager.playChimeSound();
      }
    },
    [hasVisitedMap, onGainXP]
  );

  // Like / Heart stream interaction
  const handleLikeStream = (e?: React.MouseEvent) => {
    soundManager.playClickSound();
    const pid = activeProject.id;
    const isLiked = userLikedMap[pid];

    setUserLikedMap((prev) => ({ ...prev, [pid]: !isLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [pid]: prev[pid] + (isLiked ? -1 : 1),
    }));

    if (!isLiked) {
      onGainXP(25);

      // Create floating heart
      const rect = e?.currentTarget?.getBoundingClientRect();
      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        x: rect ? rect.left + rect.width / 2 + (Math.random() * 40 - 20) : window.innerWidth / 2,
        y: rect ? rect.top : window.innerHeight / 2,
        color: ['#f43f5e', '#ec4899', '#06b6d4', '#eab308'][Math.floor(Math.random() * 4)],
      };
      setFloatingHearts((prev) => [...prev, newHeart]);

      // Trigger confetti celebration on multiple likes
      if (Math.random() > 0.6) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.75 },
          colors: ['#ec4899', '#06b6d4', '#f59e0b'],
        });
      }
    }
  };

  // Remove floating hearts after animation
  useEffect(() => {
    if (floatingHearts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingHearts((prev) => prev.slice(1));
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [floatingHearts]);

  // Donate / Cheer XP
  const handleDonateXP = () => {
    soundManager.playLevelUpSound();
    onGainXP(100);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#ec4899', '#fbbf24'],
    });

    // Add simulated chat cheer
    const newMsg: SimulatedChatMessage = {
      id: String(Date.now()),
      sender: language === 'en' ? 'You (VIP Supporter)' : 'Bạn (Người xem VIP)',
      badge: 'SUPPORTER',
      text: language === 'en' ? `🎉 Sent 100 XP cheering for ${activeProject.titleEn || activeProject.title}!` : `🎉 Đã gửi 100 XP cổ vũ dự án ${activeProject.title}!`,
      textEn: `🎉 Sent 100 XP cheering for ${activeProject.titleEn || activeProject.title}!`,
      time: language === 'en' ? 'Just now' : 'Vừa xong',
      timeEn: 'Just now',
      color: 'text-amber-300 font-bold',
    };

    setChatMap((prev) => ({
      ...prev,
      [activeProject.id]: [newMsg, ...(prev[activeProject.id] || [])],
    }));
  };

  // Send user chat message
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userChatInput.trim()) return;

    soundManager.playClickSound();
    const newMsg: SimulatedChatMessage = {
      id: String(Date.now()),
      sender: language === 'en' ? 'You' : 'Bạn',
      badge: 'GUEST',
      text: userChatInput.trim(),
      textEn: userChatInput.trim(),
      time: language === 'en' ? 'Just now' : 'Vừa xong',
      timeEn: 'Just now',
      color: 'text-cyan-300',
    };

    setChatMap((prev) => ({
      ...prev,
      [activeProject.id]: [newMsg, ...(prev[activeProject.id] || [])],
    }));

    setUserChatInput('');
  };

  // Copy project link
  const handleCopyLink = () => {
    soundManager.playClickSound();
    navigator.clipboard.writeText(window.location.href);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2600);
  };

  // Mobile Reels navigation
  const handlePrevReel = () => {
    soundManager.playClickSound();
    const nextIdx = (mobileReelIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setMobileReelIndex(nextIdx);
    setActiveProjectId(filteredProjects[nextIdx].id);
  };

  const handleNextReel = () => {
    soundManager.playClickSound();
    const nextIdx = (mobileReelIndex + 1) % filteredProjects.length;
    setMobileReelIndex(nextIdx);
    setActiveProjectId(filteredProjects[nextIdx].id);
  };

  /*
   * =========================================================================
   * INTERACTIVE CANVAS: Live Procedural Graphics Stream for Active Project
   * =========================================================================
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 720);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Particle nodes for dynamic simulation
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; hue: number }[] = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3 + 2,
        hue: activeProject.category === 'WebGL & 3D' ? 270 : activeProject.category === 'Liquid UI' ? 330 : 160,
      });
    }

    const render = () => {
      time += 0.02;

      // Dark translucent cyber canvas background
      ctx.fillStyle = 'rgba(10, 15, 29, 0.45)';
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid Background with perspective motion
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      const offset = (time * 18) % gridSize;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = offset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Dynamic Project Theme
      if (activeProject.category === 'WebGL & 3D') {
        // Rotating 3D Wireframe Polyhedron / Cube
        const cx = width / 2;
        const cy = height / 2;
        const size = Math.min(width, height) * 0.26;

        ctx.save();
        ctx.translate(cx, cy);

        // Perspective rotation angles
        const rotX = time * 0.7 + (mouseY - height / 2) * 0.002;
        const rotY = time * 0.9 + (mouseX - width / 2) * 0.002;

        const vertices = [
          [-1, -1, -1],
          [1, -1, -1],
          [1, 1, -1],
          [-1, 1, -1],
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ].map(([x, y, z]) => {
          // Y-axis rotation
          let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
          let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
          // X-axis rotation
          let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
          let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
          const fov = 350 / (350 + z2 * size * 0.6);
          return { px: x1 * size * fov, py: y2 * size * fov };
        });

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        // Draw neon edges
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 15;

        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(vertices[i].px, vertices[i].py);
          ctx.lineTo(vertices[j].px, vertices[j].py);
          ctx.stroke();
        });

        // Draw vertex nodes
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        vertices.forEach((v) => {
          ctx.beginPath();
          ctx.arc(v.px, v.py, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      } else if (activeProject.category === 'Liquid UI') {
        // Fluid Wave Blobs
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.24;

        ctx.save();
        ctx.translate(cx, cy);

        // Fluid Blob 1 (Pink / Rose)
        ctx.beginPath();
        const numPoints = 12;
        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const wave = Math.sin(angle * 3 + time * 3) * 22 + Math.cos(angle * 2 - time * 2) * 16;
          const r = baseRadius + wave;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, baseRadius * 1.4);
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.8)');
        grad.addColorStop(0.7, 'rgba(236, 72, 153, 0.4)');
        grad.addColorStop(1, 'rgba(236, 72, 153, 0.05)');
        ctx.fillStyle = grad;
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 24;
        ctx.fill();

        ctx.restore();
      } else {
        // Isometric Game Grid & Particles
        particles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, 0.8)`;
          ctx.shadowColor = `hsla(${p.hue}, 85%, 65%, 1)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Connect adjacent particles
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 90) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 90})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
      }

      // Stream Scanline & Vignette Effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeProject]);

  return (
    <div
      id="projects-arcade-container"
      className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-start select-none overflow-hidden"
    >
      {/* Floating Hearts Animation Layer */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            color: heart.color,
          }}
          className="fixed pointer-events-none z-50 animate-float-up text-2xl"
        >
          ❤️
        </div>
      ))}

      {/* Copied Link Toast */}
      {showCopiedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{t('Đã sao chép liên kết dự án vào bộ nhớ tạm!', 'Copied project link to clipboard!')}</span>
        </div>
      )}

      {/* ─── 1. TOP FLOATING ISLAND HEADER (MATCHING ALL ISLANDS) ─── */}
      <header className="pointer-events-auto fixed top-3 inset-x-3 sm:inset-x-6 z-40 max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2.5 rounded-full liquid-glass shadow-2xl border border-white/40 dark:border-slate-800">
        {/* Left: Back to 3D World & Island Map */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundManager.playTeleportSound();
              onBackToWorld();
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 text-xs font-black text-slate-800 dark:text-white transition-all cursor-pointer shadow-sm hover:border-purple-400/50"
            title={t('Quay lại thế giới đảo 3D', 'Return to 3D Archipelago')}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-purple-500" />
            <span>{t('Về Thế Giới Đảo', '3D World')}</span>
          </button>

          {/* Dedicated "Bản Đồ Đảo" (Island Map) Button */}
          <button
            id="projects-island-map-btn"
            onClick={() => {
              soundManager.playClickSound();
              window.dispatchEvent(new CustomEvent('open-cyberphone', { detail: { tab: 'map' } }));
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white hover:scale-105 active:scale-95 text-xs font-black transition-all cursor-pointer shadow-md shadow-pink-500/25 border border-white/40"
            title={t('Mở Bản Đồ Đảo Play Together (Dịch chuyển giữa các đảo)', 'Open Island Map (Fast Travel)')}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t('Bản Đồ Đảo', 'Island Map')}</span>
          </button>

          <div className="h-4 w-px bg-white/40 dark:bg-slate-700 hidden sm:block" />

          {/* Island Identifier Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              🕹️ {t('Đảo 02: Dự Án Thực Chiến • Production Web & AI', 'Island 02: Real-World Projects • Production Web & AI')}
            </span>
          </div>
        </div>

        {/* Center: Category Filters (Desktop only) */}
        <div className="hidden md:flex items-center gap-1 p-0.5 rounded-full liquid-glass border border-white/30 dark:border-slate-700/50">
          {(['all', 'Web & Frontend', 'Software & AI', 'Design & Media'] as CategoryFilter[]).map(
            (cat) => {
              const isActive = selectedCategory === cat;
              const label =
                cat === 'all'
                  ? t('Tất cả', 'All')
                  : cat === 'Web & Frontend'
                  ? 'Web & Frontend'
                  : cat === 'Software & AI'
                  ? t('AI & Phần mềm', 'AI & Software')
                  : t('Thiết kế & Media', 'Design & Media');
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundManager.playClickSound();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              );
            }
          )}
        </div>

        {/* Right: Bilingual Toggle, Live Count, Cheer XP */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center p-0.5 rounded-full liquid-glass border border-white/40 dark:border-slate-700/50">
            <button
              onClick={() => {
                soundManager.playClickSound();
                setLanguage('vi');
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                language === 'vi' ? 'bg-purple-500 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => {
                soundManager.playClickSound();
                setLanguage('en');
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                language === 'en' ? 'bg-purple-500 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-400 text-[10px] font-black tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span className="uppercase">🔴 {filteredProjects.length} {t('PHÒNG LIVE', 'LIVE')}</span>
          </div>

          <button
            onClick={handleDonateXP}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs cursor-pointer shadow-md active:scale-95 transition-all"
            title={t('Cổ vũ dự án (+100 XP)', 'Cheer project (+100 XP)')}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('Cổ vũ +100 XP', 'Cheer +100 XP')}</span>
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN VIEWPORT CONTENT (ADAPTIVE: DESKTOP DUAL-COLUMN BROADCAST vs. MOBILE REEL) ─── */}
      <div className="pointer-events-auto relative flex-1 flex flex-col min-h-0 overflow-hidden pt-16 sm:pt-20">
        {/* =========================================================================
            DESKTOP VIEW: Broadcast Studio Room (Fit-to-Viewport Master & Channel List)
           ========================================================================= */}
        <div className="hidden md:flex flex-1 p-3 sm:p-4 gap-4 h-full min-h-0 overflow-hidden max-w-7xl mx-auto w-full">
          {/* LEFT 68%: Active Live Stream Stage + Tabbed Details */}
          <div className="flex-1 flex flex-col min-h-0 liquid-glass rounded-2xl border border-white/40 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Live Broadcast Monitor */}
            <div
              ref={streamContainerRef}
              className={`relative w-full ${
                isStreamMaximized
                  ? 'h-[74%] min-h-[420px]'
                  : 'h-[50%] min-h-[250px] max-h-[380px]'
              } bg-slate-950 overflow-hidden flex flex-col items-center justify-center border-b border-white/10 transition-all duration-300`}
            >
              {streamViewMode === 'live_web' && (activeProject.id === 'graduation-invitation' || activeProject.demoUrl) ? (
                /* LIVE WEB SIMULATION MODE: Interactive Embedded Website with Simulated Browser Toolbar */
                <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
                  {/* Browser Bar Toolbar */}
                  <div className="h-9 w-full bg-slate-900/95 border-b border-white/10 flex items-center justify-between px-3 z-20 flex-none select-none backdrop-blur-md">
                    {/* Left: Window Dots & URL Pill */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-none">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-sm" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-sm" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-sm" />
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/90 border border-white/10 text-[11px] font-mono text-cyan-300 max-w-[220px] sm:max-w-[320px] truncate shadow-inner">
                        <span className="text-emerald-400 text-[10px]">🔒</span>
                        <span className="truncate">{activeProject.demoUrl || 'https://minhthu-gradinvite.web.app/'}</span>
                      </div>

                      <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>LIVE EMBED</span>
                      </span>
                    </div>

                    {/* Right: Controls (Device mode, Reload, Maximize, Studio Canvas switch, Open link) */}
                    <div className="flex items-center gap-1.5 flex-none">
                      {/* Device Viewport Toggle */}
                      <div className="flex items-center p-0.5 rounded-lg bg-slate-950/80 border border-white/10">
                        <button
                          onClick={() => {
                            soundManager.playClickSound();
                            setWebDeviceMode('desktop');
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            webDeviceMode === 'desktop'
                              ? 'bg-cyan-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title={t('Mô phỏng kích thước Desktop (Responsive)', 'Desktop responsive simulation')}
                        >
                          <Monitor className="w-3 h-3" />
                          <span className="hidden sm:inline">Desktop</span>
                        </button>
                        <button
                          onClick={() => {
                            soundManager.playClickSound();
                            setWebDeviceMode('mobile');
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            webDeviceMode === 'mobile'
                              ? 'bg-cyan-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title={t('Mô phỏng khung điện thoại Mobile (375px)', 'Mobile phone simulation')}
                        >
                          <Smartphone className="w-3 h-3" />
                          <span className="hidden sm:inline">Phone</span>
                        </button>
                      </div>

                      {/* Reload button */}
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIframeKey((k) => k + 1);
                        }}
                        className="p-1.5 rounded-md bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title={t('Tải lại trang web mô phỏng', 'Reload simulation')}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>

                      {/* External Link */}
                      <a
                        href={activeProject.demoUrl || 'https://minhthu-gradinvite.web.app/'}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title={t('Mở trong tab mới', 'Open in new tab')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* Maximize / Minimize toggle */}
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIsStreamMaximized(!isStreamMaximized);
                        }}
                        className="p-1.5 rounded-md bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title={
                          isStreamMaximized
                            ? t('Thu nhỏ màn hình stream', 'Shrink stream view')
                            : t('Mở rộng màn hình stream', 'Expand stream view')
                        }
                      >
                        {isStreamMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Browser Body / Interactive Iframe Stage */}
                  {webDeviceMode === 'desktop' ? (
                    <div className="relative flex-1 w-full bg-white overflow-hidden">
                      <iframe
                        key={`desktop-grad-${iframeKey}`}
                        src={activeProject.demoUrl || 'https://minhthu-gradinvite.web.app/'}
                        title={activeProject.title}
                        className="w-full h-full border-0 bg-white"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        loading="lazy"
                      />

                      {/* Floating Bottom Watermark */}
                      <div className="absolute bottom-2 left-2 pointer-events-none z-10 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        <span className="px-2 py-0.5 rounded bg-slate-950/85 text-[10px] font-mono text-cyan-300 border border-cyan-400/30 backdrop-blur-md shadow-md">
                          🔴 LIVE WEB • {(viewersMap[activeProject.id] || 1480).toLocaleString()} {t('đang xem', 'watching')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950/85 text-[10px] font-mono text-slate-300 border border-white/10 backdrop-blur-md shadow-md">
                          Firebase Hosting
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex-1 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-2.5 overflow-hidden">
                      {/* Realistic Smartphone Mockup */}
                      <div className="relative w-[280px] sm:w-[320px] h-full max-h-[350px] rounded-[26px] border-[4px] border-slate-700 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
                        {/* Dynamic Island / Speaker */}
                        <div className="h-4 bg-slate-900 flex items-center justify-center flex-none border-b border-white/5">
                          <div className="w-12 h-1.5 rounded-full bg-slate-800 flex items-center justify-end px-1">
                            <div className="w-1 h-1 rounded-full bg-cyan-400/60" />
                          </div>
                        </div>

                        {/* Screen */}
                        <iframe
                          key={`mobile-grad-${iframeKey}`}
                          src={activeProject.demoUrl || 'https://minhthu-gradinvite.web.app/'}
                          title={activeProject.title}
                          className="flex-1 w-full border-0 bg-white"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          loading="lazy"
                        />
                      </div>

                      {/* Floating Device Watermark */}
                      <div className="absolute bottom-2 left-3 pointer-events-none z-10 flex items-center gap-1.5 opacity-80">
                        <span className="px-2 py-0.5 rounded bg-slate-950/85 text-[10px] font-mono text-cyan-300 border border-cyan-400/30 backdrop-blur-md shadow-md">
                          📱 IPHONE FRAME • 375x812
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : streamViewMode === 'showroom' ? (
                /* SHOWROOM & SHOWCASE MODE: Rich gallery, interactive modules, simulators & specs */
                <ProjectShowroomMonitor
                  project={activeProject}
                  language={language}
                  t={t}
                  isMaximized={isStreamMaximized}
                  onToggleMaximize={() => setIsStreamMaximized(!isStreamMaximized)}
                  hasLiveWeb={activeProject.id === 'graduation-invitation' || !!activeProject.demoUrl}
                  onSwitchToLiveWeb={() => setStreamViewMode('live_web')}
                  onSwitchToStudio={() => setStreamViewMode('studio_canvas')}
                />
              ) : (
                /* STUDIO PROCEDURAL CANVAS MODE */
                <>
                  {/* Studio Stage Realistic Broadcast Backdrop */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none scale-105 transition-all duration-700"
                    style={{ backgroundImage: `url(${streamShowcaseImg})` }}
                  />

                  {/* Interactive Procedural Stream Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="relative z-0 w-full h-full object-cover cursor-crosshair mix-blend-lighten"
                    title="Canvas mô phỏng đồ họa tương tác thời gian thực"
                  />

                  {/* Top Stream Overlay Info */}
                  <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-600/90 text-white font-black text-[10px] tracking-wider uppercase shadow-md">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>LIVE DEV</span>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-cyan-300 border border-cyan-400/30 font-mono text-[10px] font-bold">
                        4K • 60 FPS
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 border border-white/10 font-mono text-[10px]">
                        12ms Latency
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pointer-events-auto">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                        <span>{(viewersMap[activeProject.id] || 1200).toLocaleString()} {t('đang xem', 'watching')}</span>
                      </div>

                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIsLiveMuted(!isLiveMuted);
                        }}
                        className="p-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
                        title={isLiveMuted ? t('Bật âm thanh', 'Unmute') : t('Tắt âm thanh', 'Mute')}
                      >
                        {isLiveMuted ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Stream Visual Tag */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-xs font-bold text-slate-200">
                        {t('Phòng', 'Room')} #{activeProject.id.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/30 border border-purple-400/40 text-xs font-mono text-purple-200">
                        {language === 'en' && activeProject.metricsEn ? activeProject.metricsEn : activeProject.metrics}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pointer-events-auto">
                      {/* Button to Switch to Live Web Simulation */}
                      {(activeProject.id === 'graduation-invitation' || activeProject.demoUrl) && (
                        <button
                          onClick={() => {
                            soundManager.playClickSound();
                            setStreamViewMode('live_web');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-black shadow-lg cursor-pointer transition-transform hover:scale-105"
                          title={t('Mở mô phỏng trang web trực tiếp trong livestream', 'Open live web simulation in livestream')}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{t('Mô Phỏng Web', 'Live Web Sim')}</span>
                        </button>
                      )}

                      {activeProject.demoUrl && (
                        <a
                          href={activeProject.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-black shadow-lg cursor-pointer transition-transform hover:scale-105"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{t('Mở Tab Mới', 'Open Tab')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Streamer Bar: Creator Profile & Interactive Quick Actions */}
            <div className="flex-none px-4 py-2.5 bg-slate-950/60 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Creator Avatar with Pulsing Ring */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-400 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      alt={PERSONAL_INFO.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-rose-500 text-[8px] font-black text-white uppercase tracking-wider">
                    LIVE
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{PERSONAL_INFO.fullName}</span>
                    <span className="text-cyan-400 text-xs" title="Verified Creator">
                      ✓
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-slate-300">
                      {language === 'en' && activeProject.roleEn ? activeProject.roleEn : activeProject.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {language === 'en' && activeProject.taglineEn ? activeProject.taglineEn : activeProject.tagline}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Like / Donate / Code / Share */}
              <div className="flex items-center gap-2">
                {/* View Mode Quick Pill (Desktop) */}
                <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setStreamViewMode('showroom');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      streamViewMode === 'showroom'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Chế độ Showroom hình ảnh & mô phỏng"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Showroom</span>
                  </button>

                  {(activeProject.id === 'graduation-invitation' || activeProject.demoUrl) && (
                    <button
                      onClick={() => {
                        soundManager.playClickSound();
                        setStreamViewMode('live_web');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        streamViewMode === 'live_web'
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Mô phỏng website trực tiếp"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Web Sim</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setStreamViewMode('studio_canvas');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      streamViewMode === 'studio_canvas'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Chế độ đồ họa Studio Canvas"
                  >
                    <span>🎨 Canvas</span>
                  </button>
                </div>

                <button
                  onClick={handleLikeStream}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    userLikedMap[activeProject.id]
                      ? 'bg-rose-500/30 border-rose-400/60 text-rose-300 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-300'
                  }`}
                  title="Thả tim cho dự án"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      userLikedMap[activeProject.id] ? 'fill-rose-500 text-rose-400' : 'text-rose-400'
                    }`}
                  />
                  <span>{(likesMap[activeProject.id] || 850).toLocaleString()}</span>
                </button>

                {activeProject.githubUrl && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                    title="Xem mã nguồn trên GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">GitHub</span>
                  </a>
                )}

                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white cursor-pointer"
                  title="Sao chép liên kết phòng này"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabbed Project Intelligence & Live Chat Feed (Fits cleanly in viewport) */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-950/40">
              {/* Tabs Navigation */}
              <div className="flex-none flex items-center px-4 border-b border-white/10 gap-2 bg-slate-900/30">
                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    setActiveTab('overview');
                  }}
                  className={`py-2 px-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                    activeTab === 'overview'
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t('Tổng quan & Chỉ số', 'Overview & Metrics')}
                </button>

                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    setActiveTab('features');
                  }}
                  className={`py-2 px-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                    activeTab === 'features'
                      ? 'border-purple-400 text-purple-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t('Tính năng cốt lõi', 'Core Features')} ({activeProject.features.length})
                </button>

                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    setActiveTab('tech');
                  }}
                  className={`py-2 px-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                    activeTab === 'tech'
                      ? 'border-pink-400 text-pink-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t('Công nghệ & Kiến trúc', 'Tech & Architecture')}
                </button>

                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    setActiveTab('chat');
                  }}
                  className={`py-2 px-3 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
                    activeTab === 'chat'
                      ? 'border-emerald-400 text-emerald-300'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('Kênh Chat Live', 'Live Chat')}</span>
                </button>
              </div>

              {/* Tab Content Body (Scrollable inside container so whole page never overflows) */}
              <div className="flex-1 p-4 overflow-y-auto min-h-0 text-sm space-y-3">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                          {language === 'en' && activeProject.titleEn ? activeProject.titleEn : activeProject.title}
                          <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            {language === 'vi' ? `Năm ${activeProject.year}` : `Year ${activeProject.year}`}
                          </span>
                        </h2>
                        <p className="text-xs text-cyan-300/90 font-medium mt-0.5">
                          {language === 'en' && activeProject.taglineEn ? activeProject.taglineEn : activeProject.tagline}
                        </p>
                      </div>

                      <div className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-mono font-bold text-right whitespace-nowrap">
                        {language === 'en' && activeProject.metricsEn ? activeProject.metricsEn : activeProject.metrics}
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      {language === 'en' && activeProject.descriptionEn ? activeProject.descriptionEn : activeProject.description}
                    </p>

                    <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Tech Tags:
                      </span>
                      {activeProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(language === 'en' && activeProject.featuresEn ? activeProject.featuresEn : activeProject.features).map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 hover:border-purple-400/40 transition-all"
                      >
                        <div className="p-1 rounded-lg bg-purple-500/20 text-purple-400 flex-none">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs text-slate-200 leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {activeProject.tags.map((tag, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2"
                        >
                          <Code2 className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-slate-200">{tag}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-[11px] text-slate-400 space-y-1">
                      <div className="text-cyan-400 font-bold">// Production Architecture Highlights</div>
                      <div>• Framework: React 19 + TypeScript (Strict Mode)</div>
                      <div>• Pipeline: Three.js WebGL Renderer with Custom GLSL Simplex Noise</div>
                      <div>• Performance: Low draw calls via InstancedMesh & Frustum Culling</div>
                    </div>
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full space-y-2">
                    <div className="flex-1 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {(chatMap[activeProject.id] || []).map((msg) => (
                        <div
                          key={msg.id}
                          className="flex items-start gap-2 p-1.5 rounded-lg bg-white/5 text-xs"
                        >
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                            {msg.badge}
                          </span>
                          <span className={`font-bold ${msg.color}`}>{msg.sender}:</span>
                          <span className="text-slate-200 flex-1">
                            {language === 'en' && msg.textEn ? msg.textEn : msg.text}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {language === 'en' && msg.timeEn ? msg.timeEn : msg.time}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={userChatInput}
                        onChange={(e) => setUserChatInput(e.target.value)}
                        placeholder={t('Nhập bình luận hoặc đặt câu hỏi về dự án...', 'Leave a comment or ask about this project...')}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>{t('Gửi', 'Send')}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 32%: Live Rooms Channel List (Always visible in viewport) */}
          <div className="w-80 lg:w-96 flex flex-col min-h-0 liquid-glass rounded-2xl border border-white/40 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header: Rooms list */}
            <div className="flex-none p-3.5 border-b border-white/10 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <h3 className="text-xs font-black tracking-wider uppercase text-white">
                  {t('DANH SÁCH PHÒNG DEV', 'DEV ROOMS DIRECTORY')} ({filteredProjects.length})
                </h3>
              </div>

              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20">
                {t('CLICK ĐỂ CHUYỂN', 'CLICK TO SWITCH')}
              </span>
            </div>

            {/* Scrollable Room List (Compact, high information density) */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-0">
              {filteredProjects.map((project, index) => {
                const isActive = project.id === activeProjectId;
                const isVisited = hasVisitedMap[project.id];
                const viewers = viewersMap[project.id] || 850;

                return (
                  <div
                    key={project.id}
                    onClick={() => handleSelectProject(project.id)}
                    className={`group relative p-3 rounded-xl transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-950/60 to-slate-900/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top line: Live tag + Room number */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-black tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          LIVE
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{t('PHÒNG', 'ROOM')} 0{index + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{viewers.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Project Title & Category */}
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {language === 'en' && project.titleEn ? project.titleEn : project.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {language === 'en' && project.taglineEn ? project.taglineEn : project.tagline}
                    </p>

                    {/* Bottom Info & Equalizer when active */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-purple-300 font-mono">
                        {language === 'en' && project.categoryEn ? project.categoryEn : project.category}
                      </span>

                      {isActive ? (
                        <div className="flex items-center gap-1 text-cyan-400 font-mono font-bold">
                          {/* Animated equalizer waves */}
                          <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                          <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                          <span className="ml-1 text-[10px]">{t('ĐANG PHÁT', 'NOW STREAMING')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 group-hover:text-slate-300">
                          {isVisited ? t('Đã xem', 'Watched') : t('+60 XP khám phá', '+60 XP Discover')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            MOBILE VIEW: Full-screen Reels Experience ("mobile hiện dạng reel")
           ========================================================================= */}
        <div className="md:hidden relative flex-1 flex flex-col min-h-0 liquid-glass overflow-hidden">
          {/* Active Reel Card */}
          <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Reel Visual Stage */}
            <div className="relative flex-1 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              {streamViewMode === 'live_web' && (activeProject.id === 'graduation-invitation' || activeProject.demoUrl) ? (
                <div className="relative w-full h-full bg-white overflow-hidden">
                  <iframe
                    key={`mobile-reel-${iframeKey}-${activeProject.id}`}
                    src={activeProject.demoUrl || 'https://minhthu-gradinvite.web.app/'}
                    title={activeProject.title}
                    className="w-full h-full border-0 bg-white"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                  />

                  {/* Mobile Top Overlay with Mode Switch & Reload */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE WEB SIM</span>
                    </div>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setIframeKey((k) => k + 1);
                        }}
                        className="p-1.5 rounded-full bg-slate-900/90 text-slate-200 border border-white/20 shadow-lg cursor-pointer"
                        title="Tải lại web"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setStreamViewMode('showroom');
                        }}
                        className="px-2.5 py-1 rounded-full bg-purple-600/90 text-white text-[10px] font-bold border border-white/20 shadow-lg cursor-pointer flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Showroom</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : streamViewMode === 'showroom' ? (
                <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col">
                  {/* Mobile Top Switch Bar */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-30">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      <span>SHOWROOM</span>
                    </div>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      {(activeProject.id === 'graduation-invitation' || activeProject.demoUrl) && (
                        <button
                          onClick={() => {
                            soundManager.playClickSound();
                            setStreamViewMode('live_web');
                          }}
                          className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black border border-white/20 shadow-md cursor-pointer flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          <span>Web Sim</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setStreamViewMode('studio_canvas');
                        }}
                        className="px-2 py-1 rounded-full bg-slate-800/90 text-slate-300 text-[10px] font-bold border border-white/20 shadow-md cursor-pointer"
                      >
                        🎨 Studio
                      </button>
                    </div>
                  </div>

                  <ProjectShowroomMonitor
                    project={activeProject}
                    language={language}
                    t={t}
                    isMaximized={false}
                    onToggleMaximize={() => {}}
                    hasLiveWeb={activeProject.id === 'graduation-invitation' || !!activeProject.demoUrl}
                    onSwitchToLiveWeb={() => setStreamViewMode('live_web')}
                    onSwitchToStudio={() => setStreamViewMode('studio_canvas')}
                  />
                </div>
              ) : (
                <>
                  {/* Studio Stage Realistic Broadcast Backdrop */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-screen pointer-events-none"
                    style={{ backgroundImage: `url(${streamShowcaseImg})` }}
                  />

                  <canvas
                    ref={canvasRef}
                    className="relative z-0 w-full h-full object-cover mix-blend-lighten"
                    title="Mô phỏng đồ họa dự án"
                  />

                  {/* Mobile Top Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>
                        REEL {mobileReelIndex + 1}/{filteredProjects.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pointer-events-auto">
                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          setStreamViewMode('showroom');
                        }}
                        className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black border border-white/20 shadow-md cursor-pointer flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Showroom</span>
                      </button>

                      {(activeProject.id === 'graduation-invitation' || activeProject.demoUrl) && (
                        <button
                          onClick={() => {
                            soundManager.playClickSound();
                            setStreamViewMode('live_web');
                          }}
                          className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black border border-white/20 shadow-md cursor-pointer flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          <span>Web Sim</span>
                        </button>
                      )}

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>LIVE {(viewersMap[activeProject.id] || 1200).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Right Action Bar (Reel standard: Heart, Comments, Demo, Code, Share) */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20">
                {/* Heart Button */}
                <button
                  onClick={handleLikeStream}
                  className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
                      userLikedMap[activeProject.id]
                        ? 'bg-rose-500/40 border-rose-400 text-rose-300 shadow-lg'
                        : 'bg-slate-900/70 border-white/20 text-white'
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        userLikedMap[activeProject.id] ? 'fill-rose-500 text-rose-400' : 'text-white'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white shadow-sm">
                    {likesMap[activeProject.id] || 850}
                  </span>
                </button>

                {/* Details / Comments Drawer */}
                <button
                  onClick={() => setShowMobileDetails(true)}
                  className="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-900/70 backdrop-blur-md border border-white/20 text-white">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-bold text-white shadow-sm">Chi tiết</span>
                </button>

                {/* Demo External Link */}
                {activeProject.demoUrl && (
                  <a
                    href={activeProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-blue-500 border border-cyan-300 text-white shadow-lg">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold text-cyan-300">Demo</span>
                  </a>
                )}

                {/* Share Link */}
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-slate-900/70 backdrop-blur-md border border-white/20 text-white">
                    <Share2 className="w-5 h-5 text-purple-300" />
                  </div>
                  <span className="text-[10px] font-bold text-white">Chia sẻ</span>
                </button>
              </div>

              {/* Mobile Bottom Info Card Overlay */}
              <div className="absolute left-3 right-16 bottom-3 z-20 space-y-1.5 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 to-cyan-400">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt={PERSONAL_INFO.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-xs font-black text-white">{PERSONAL_INFO.fullName}</span>
                  <span className="px-2 py-0.2 rounded-full bg-rose-500/80 text-[9px] font-bold text-white">
                    LIVE
                  </span>
                </div>

                <h3 className="text-base font-black text-white drop-shadow-md">
                  {language === 'en' && activeProject.titleEn ? activeProject.titleEn : activeProject.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 drop-shadow-sm">
                  {language === 'en' && activeProject.taglineEn ? activeProject.taglineEn : activeProject.tagline}
                </p>

                <div className="flex items-center gap-1.5 pt-1 pointer-events-auto">
                  <button
                    onClick={() => setShowMobileDetails(true)}
                    className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t('Xem thông số & tính năng', 'View Specs & Features')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Reel Up/Down Controls & Carousel Indicator */}
            <div className="flex-none h-12 bg-slate-900/80 border-t border-white/10 px-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px]">
                {filteredProjects.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundManager.playClickSound();
                      setMobileReelIndex(idx);
                      setActiveProjectId(p.id);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === mobileReelIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevReel}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95"
                  title="Reel trước"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextReel}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95"
                  title="Reel kế tiếp"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Details Sheet (Slide Up Modal) */}
          {showMobileDetails && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end">
              <div className="bg-slate-900 border-t border-white/20 rounded-t-3xl p-5 max-h-[80vh] flex flex-col space-y-4 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {language === 'en' && activeProject.titleEn ? activeProject.titleEn : activeProject.title}
                    </h3>
                    <p className="text-xs text-cyan-400">
                      {language === 'en' && activeProject.taglineEn ? activeProject.taglineEn : activeProject.tagline}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMobileDetails(false)}
                    className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Metrics */}
                <div className="px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-mono font-bold">
                  {language === 'en' && activeProject.metricsEn ? activeProject.metricsEn : activeProject.metrics}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'en' && activeProject.descriptionEn ? activeProject.descriptionEn : activeProject.description}
                </p>

                {/* Features list */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('Tính năng nổi bật', 'Key Features')}
                  </h4>
                  {(language === 'en' && activeProject.featuresEn ? activeProject.featuresEn : activeProject.features).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <Check className="w-3.5 h-3.5 text-cyan-400 flex-none mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeProject.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/10 flex gap-3">
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t('Trải nghiệm Demo', 'Launch Demo')}</span>
                    </a>
                  )}

                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
