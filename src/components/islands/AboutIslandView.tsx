import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundManager } from '../../audio/soundManager';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  RotateCw,
  Repeat,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Award,
  Zap,
  Heart,
  Palette,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AboutIslandViewProps {
  onBackToWorld: () => void;
  onGainXP: (amount: number) => void;
  onWarpToSection?: (sectionKey: any) => void;
  onOpenHRQuickCV?: () => void;
}

export const AboutIslandView: React.FC<AboutIslandViewProps> = ({
  onBackToWorld,
  onGainXP,
  onOpenHRQuickCV,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const charGroupRef = useRef<THREE.Group | null>(null);

  // 3D Avatar Three.js Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 220;
    const height = canvas.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.0, 3.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf472b6, 2.2);
    keyLight.position.set(2, 3, 2);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    rimLight.position.set(-2, 2, -2);
    scene.add(rimLight);

    // Glowing Platform Disc
    const discGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.08, 32);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.6,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = -0.7;
    scene.add(disc);

    // Character Group
    const charGroup = new THREE.Group();
    charGroup.position.y = -0.4;

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.36, 0.85, 20);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.3,
      metalness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.45;
    charGroup.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.26, 24, 24);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.3,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.15;
    charGroup.add(head);

    // Hair / Cap
    const hairGeo = new THREE.SphereGeometry(0.28, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.5,
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.2;
    charGroup.add(hair);

    // Glasses
    const glassGeo = new THREE.TorusGeometry(0.075, 0.015, 12, 24);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const glassL = new THREE.Mesh(glassGeo, glassMat);
    glassL.position.set(-0.1, 1.15, 0.25);
    charGroup.add(glassL);
    const glassR = glassL.clone();
    glassR.position.x = 0.1;
    charGroup.add(glassR);

    // Glasses Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.07);
    const bridge = new THREE.Mesh(bridgeGeo, glassMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 1.15, 0.26);
    charGroup.add(bridge);

    scene.add(charGroup);
    charGroupRef.current = charGroup;

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (charGroupRef.current) {
        if (isRotating) {
          charGroupRef.current.rotation.y += delta * 0.9;
        }
        charGroupRef.current.position.y = -0.4 + Math.sin(elapsed * 2.2) * 0.035;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isRotating]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(type);
    soundManager.playClickSound();
    setTimeout(() => setCopiedContact(null), 2500);
  };

  const handleFlipCard = () => {
    soundManager.playClickSound();
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      id="about-island-view"
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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 text-slate-800 dark:text-white font-black text-xs transition-all cursor-pointer shadow-sm hover:border-pink-400/50"
            title={t('Quay về thế giới đảo 3D', 'Return to 3D World')}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-pink-500" />
            <span>{t('Về Thế Giới Đảo', '3D World')}</span>
          </button>

          <div className="h-4 w-px bg-white/40 dark:bg-slate-700 hidden sm:block" />

          {/* Island Identifier */}
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent hidden sm:inline-block">
            🪪 {t('Đảo 01: Hồ Sơ Cá Nhân • Personal Profile', 'Island 01: Personal Profile')}
          </span>
        </div>

        {/* Action Toggle (Front / Back Flip Button) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFlipCard}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-pink-500/25 border border-white/30"
          >
            <Repeat className="w-3.5 h-3.5 animate-spin-slow" />
            <span>
              {isFlipped
                ? t('Xem Mặt Trước Thẻ', 'Flip to Front Side')
                : t('Xem Mặt Sau Thẻ', 'Flip to Back Side')}
            </span>
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN VIEWPORT: SINGLE ID BADGE / CARD CONTAINER ─── */}
      <main className="pointer-events-auto w-full h-full pt-16 sm:pt-20 pb-8 px-3 sm:px-6 flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
        {/* Lanyard Top Strap & Clip Illusion (Thanh treo thẻ & dây đeo) */}
        <div className="flex flex-col items-center z-10 -mb-2 pointer-events-none">
          {/* Lanyard Fabric Strap */}
          <div className="w-10 sm:w-12 h-6 sm:h-8 bg-gradient-to-b from-pink-600 via-rose-500 to-pink-500 rounded-t-sm shadow-md flex items-center justify-center border-x border-pink-400/40">
            <span className="text-[7px] font-black text-white/90 tracking-widest uppercase rotate-90">
              THUWW
            </span>
          </div>
          {/* Metal Clip & Slot */}
          <div className="w-8 sm:w-9 h-3.5 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-800 rounded-sm shadow-inner flex items-center justify-center border border-white/40">
            <div className="w-3.5 h-1.5 bg-slate-900/60 rounded-full" />
          </div>
        </div>

        {/* ─── THE SINGLE ID BADGE (3D FLIP CONTAINER) ─── */}
        <div className="w-full max-w-3xl perspective-1000">
          <div
            className={`w-full rounded-[28px] sm:rounded-[36px] liquid-glass border-2 border-white/60 dark:border-slate-700/90 shadow-2xl p-5 sm:p-7 relative transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Top Lanyard Punch Hole */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-slate-900/40 dark:bg-black/60 rounded-full border border-white/30 backdrop-blur-md shadow-inner" />

            {/* ════════════════ MẶT TRƯỚC (FRONT SIDE) ════════════════ */}
            {!isFlipped ? (
              <div className="flex flex-col gap-5 w-full">
                {/* Badge Header Row */}
                <div className="flex items-center justify-between pb-3 border-b border-white/25 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    {/* Organization Hologram Badge */}
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase font-mono">
                          THUWW • CREATIVE TECH PROFILE
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        PROFILE: FE / AI / INTERACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Smart Chip Graphic */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[9px] font-mono font-black text-pink-500 dark:text-pink-400 uppercase">
                        DIGITAL PROFILE
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">LEVEL 26</span>
                    </div>
                    {/* Golden SIM Chip */}
                    <div className="w-8 h-6 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border border-amber-600/40 shadow-xs flex items-center justify-center p-0.5">
                      <div className="w-full h-full border border-amber-700/30 rounded-[3px] grid grid-cols-2 grid-rows-2" />
                    </div>
                  </div>
                </div>

                {/* Badge Core Content (2-Column Identity Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Left: 3D Hologram Avatar / Profile Visual */}
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div className="w-full rounded-2xl bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-800 p-2 relative flex flex-col items-center shadow-inner">
                      {/* Live 3D Avatar Canvas */}
                      <div className="w-full h-48 sm:h-52 relative flex items-center justify-center">
                        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                        <button
                          onClick={() => setIsRotating(!isRotating)}
                          className="absolute bottom-1 right-1 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                          title={isRotating ? t('Tắt tự xoay', 'Pause rotation') : t('Bật tự xoay', 'Auto rotate')}
                        >
                          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
                        </button>
                      </div>

                      {/* Status pill under avatar */}
                      <div className="w-full mt-1 pt-1.5 border-t border-white/20 dark:border-slate-800 flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                            {t('Sẵn sàng làm việc', 'Open to Work')}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-pink-500">
                          LV.26
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Candidate Key Identity & Bio & Numbers */}
                  <div className="md:col-span-8 flex flex-col gap-3">
                    {/* Name and Titles */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          Lê Thị Minh Thu
                        </h1>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/30">
                          @Thuww
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text mt-0.5">
                        Frontend Developer • AI • Interactive Experiences
                      </p>
                    </div>

                    {/* 1-2 Line Identity Introduction (Súc tích & Thân thiện) */}
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed bg-white/30 dark:bg-slate-900/40 p-3 rounded-2xl border border-white/25 dark:border-slate-800">
                      {t(
                        'Cử nhân Computer Vision tại HCMUS, với nền tảng Frontend và AI. Mình thích biến ý tưởng thành những sản phẩm tương tác trực quan — từ web, ứng dụng AI đến game và creative technology.',
                        'Computer Vision graduate from HCMUS with a background in Frontend and AI. I enjoy turning ideas into interactive experiences — from web and AI applications to games and creative technology.'
                      )}
                    </p>

                    {/* Quantified Metrics Summary (Tóm tắt năng lực dạng số liệu) */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                      <div className="flex flex-col items-center p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700 text-center">
                        <span className="text-sm font-black text-pink-500 font-mono">8.35</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                          {t('GPA Cử nhân', 'HCMUS GPA')}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700 text-center">
                        <span className="text-sm font-black text-cyan-400 font-mono">5+</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                          {t('Dự án AI/Web', 'AI / Web Projects')}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700 text-center">
                        <span className="text-sm font-black text-purple-400 font-mono">2+</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                          {t('Năm Frontend', 'Frontend Yrs')}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700 text-center">
                        <span className="text-sm font-black text-emerald-400 font-mono">740+</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                          {t('Học sinh & người học', 'Learners Reached')}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700 text-center">
                        <span className="text-sm font-black text-amber-400 font-mono">3</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                          {t('Học bổng lớn', 'Scholarships')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge Footer: Barcode & Flip Callout Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/20 dark:border-slate-800">
                  {/* Digital Barcode Graphic */}
                  <div className="flex items-center gap-1.5 opacity-70">
                    <div className="flex items-center gap-[2px] h-6 bg-slate-900 dark:bg-white/90 p-1 rounded-xs">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2].map((w, i) => (
                        <div
                          key={i}
                          className="h-full bg-white dark:bg-slate-900"
                          style={{ width: `${w}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">
                      LE-THI-MINH-THU-2025
                    </span>
                  </div>

                  {/* Primary Flip Action */}
                  <button
                    onClick={handleFlipCard}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white text-xs font-black hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-lg shadow-pink-500/25"
                  >
                    <span>{t('Lật sang Mặt Sau (Beyond the Code & Liên Hệ)', 'Flip to Back (Beyond the Code & Contact)')}</span>
                    <span className="text-sm">➔</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ════════════════ MẶT SAU (BACK SIDE - CHỮ XUÔI CHIỀU HOÀN TOÀN) ════════════════ */
              <div className="flex flex-col gap-4 w-full [transform:rotateY(180deg)]">
                {/* Magnetic Strip Graphic (Dải từ tính mặt sau thẻ nhân viên) */}
                <div className="w-full h-8 sm:h-9 bg-slate-900 dark:bg-black rounded-lg shadow-inner flex items-center justify-between px-3 border border-slate-700/50">
                  <span className="text-[9px] font-mono text-slate-500 tracking-widest">
                    THUWW • CREATIVE TECHNOLOGY
                  </span>
                  <span className="text-[9px] font-mono text-pink-500 font-bold">
                    FE / AI / INTERACTIVE
                  </span>
                </div>

                {/* Back Core Grid: Beyond the Code + Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Beyond the Code */}
                  <div className="flex flex-col gap-3">
                    <div className="relative overflow-hidden p-4 rounded-2xl bg-white/30 dark:bg-slate-900/50 border border-white/25 dark:border-slate-800">
                      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-pink-400/20 blur-2xl animate-pulse" />
                      <div className="absolute -left-8 bottom-0 w-20 h-20 rounded-full bg-cyan-400/15 blur-2xl" />
                      <div className="relative flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs animate-bounce">✦</span>
                          <h4 className="text-xs font-black uppercase tracking-wider text-pink-500 dark:text-pink-400">
                            {t('Không Chỉ Là Code', 'Beyond the Code')}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[8px] font-black text-pink-500">
                          VIBE CHECK ✨
                        </span>
                      </div>

                      <p className="relative text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 mb-3">
                        {t(
                          'Mình thích đứng ở giao điểm giữa công nghệ, sáng tạo và con người — nơi một ý tưởng có thể trở thành thứ vừa hữu ích vừa thú vị.',
                          'I like working where technology, creativity, and people meet — turning ideas into experiences that are both useful and fun.'
                        )}
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: '🧠', title: t('Tò mò', 'Curious'), text: t('Luôn muốn thử cái mới.', 'Always exploring new ideas.'), cls: 'text-pink-500' },
                          { icon: '🎨', title: t('Sáng tạo', 'Creative'), text: t('Code cũng là một chất liệu để tạo hình.', 'Code is another creative medium.'), cls: 'text-purple-400' },
                          { icon: '💭', title: t('Đặt người dùng trước', 'Human-centered'), text: t('Quan tâm cách mọi người thực sự trải nghiệm sản phẩm.', 'I care about how people actually experience products.'), cls: 'text-cyan-400' },
                          { icon: '🧪', title: t('Thích thử nghiệm', 'Experimental'), text: t('Học bằng cách build và iterate.', 'Learn by building and iterating.'), cls: 'text-emerald-400' },
                        ].map((item) => (
                          <div key={item.title} className="group p-2.5 rounded-xl bg-white/35 dark:bg-slate-800/40 border border-white/20 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-sm group-hover:rotate-12 transition-transform">{item.icon}</span>
                              <span className={`text-[10px] font-black ${item.cls}`}>{item.title}</span>
                            </div>
                            <span className="text-[9px] leading-tight text-slate-600 dark:text-slate-400">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini personality ticker */}
                    <div className="overflow-hidden rounded-xl bg-slate-950/90 border border-white/10 py-2">
                      <div className="flex w-max gap-3 text-[9px] font-mono font-black text-white/70 animate-pulse">
                        <span>✦ BUILD</span><span>✦ EXPLORE</span><span>✦ EXPERIMENT</span><span>✦ ITERATE</span><span>✦ CREATE</span><span>✦ BUILD</span><span>✦ EXPLORE</span><span>✦ EXPERIMENT</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Direct Contact & Action Matrix */}
                  <div className="flex flex-col justify-between gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/30 dark:bg-slate-900/50 border border-white/25 dark:border-slate-800 flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-pink-500" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                          {t('Liên Hệ', 'Contact')}
                        </h4>
                      </div>

                      {/* Email Copy */}
                      <button
                        onClick={() => handleCopy('minhthu2k33@gmail.com', 'email')}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/40 dark:bg-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-700/60 border border-white/30 transition-all cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3.5 h-3.5 text-pink-500" />
                          <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px]">
                            minhthu2k33@gmail.com
                          </span>
                        </div>
                        <span className="text-[10px] text-pink-500 font-bold">
                          {copiedContact === 'email' ? t('✓ Đã copy', '✓ Copied') : t('Copy', 'Copy')}
                        </span>
                      </button>

                      {/* Phone / Zalo Copy */}
                      <button
                        onClick={() => handleCopy('0888392122', 'phone')}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/40 dark:bg-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-700/60 border border-white/30 transition-all cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px]">
                            0888 392 122 (Zalo)
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-500 font-bold">
                          {copiedContact === 'phone' ? t('✓ Đã copy', '✓ Copied') : t('Copy', 'Copy')}
                        </span>
                      </button>

                      {/* Location */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-white/40 dark:bg-slate-800/50 border border-white/30 text-[11px] text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{t('TP. Hồ Chí Minh (Onsite / Hybrid / Remote)', 'Ho Chi Minh City (Onsite/Remote)')}</span>
                      </div>

                      {/* Social Links */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <a
                          href="https://github.com/Thuww"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 p-1.5 rounded-lg liquid-glass-pill text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-pink-500 transition-colors"
                        >
                          <span>🐙</span> GitHub
                        </a>
                        <a
                          href="https://linkedin.com/in/thuww"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 p-1.5 rounded-lg liquid-glass-pill text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-pink-500 transition-colors"
                        >
                          <span>💼</span> LinkedIn
                        </a>
                        <a
                          href="https://canva.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 p-1.5 rounded-lg liquid-glass-pill text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-pink-500 transition-colors"
                        >
                          <span>🎨</span> Canva
                        </a>
                      </div>
                    </div>

                    {/* HR Quick Actions */}
                    <div className="flex items-center gap-2">
                      {onOpenHRQuickCV && (
                        <button
                          onClick={() => {
                            soundManager.playLevelUpSound();
                            onOpenHRQuickCV();
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-black cursor-pointer transition-all shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t('Xem Nhanh CV', 'Quick CV')}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          soundManager.playClickSound();
                          confetti({ particleCount: 50, spread: 60 });
                          window.print();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black cursor-pointer hover:scale-102 transition-all shadow-md shadow-pink-500/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('Tải / In CV PDF', 'Download / Print')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Back Footer: Return to Front Side Button */}
                <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    THUWW PROFILE • KEEP EXPLORING ✦
                  </span>
                  <button
                    onClick={handleFlipCard}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>⬅</span>
                    <span>{t('Quay Lại Mặt Trước', 'Back to Front Side')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
