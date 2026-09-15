import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gamepad2, ArrowRight, ShieldCheck, Zap, Laptop, Compass } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface GameLoadingScreenProps {
  onGameReady: () => void;
}

const SYSTEM_LOGS = [
  'Khởi tạo WebGL 2.0 context & Three.js 3D Engine...',
  'Tải bộ nhớ đổ bóng GLSL Shaders & Liquid Glass materials...',
  'Kích hoạt Spatial Audio Synthesizer & Web Audio API...',
  'Đồng bộ hóa 5 hòn đảo: Hồ sơ, Kỹ năng, Dự án, Hải trình & Dịch vụ...',
  'Tối ưu 60 FPS Native, Zero Layout Shift (CLS 0.0)...',
  'Thế giới mở Aetheria đã sẵn sàng!',
];

const PRO_TIPS = [
  'Tip: Dùng phím W-A-S-D hoặc chạm trên màn hình để di chuyển tự do trên đảo!',
  'Tip: Bấm biểu tượng Điện Thoại (📱) trên header để mở Cài đặt & Bản đồ dịch chuyển nhanh giữa các đảo!',
  'Tip: Đảo 02 có chế độ Livestream Dev đa phòng trên Desktop và Reels Feed trên Mobile!',
  'Tip: Mở CV 30 Giây Nhanh nếu bạn là Nhà tuyển dụng cần xem tóm tắt năng lực!',
  'Tip: Dùng chế độ Chụp Ảnh (Photo Mode) trên thanh công cụ để lưu giữ kỷ niệm 3D!',
];

export const GameLoadingScreen: React.FC<GameLoadingScreenProps> = ({ onGameReady }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 3D Avatar Character Canvas (from 3D Profile)
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const charGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const canvas = avatarCanvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 160;
    const height = canvas.clientHeight || 160;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    // Focus nicely on upper body, cute face with glasses and pink hoodie
    camera.position.set(0, 0.95, 2.7);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf472b6, 2.4);
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
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.6,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = -0.7;
    scene.add(disc);

    // Character Group
    const charGroup = new THREE.Group();
    charGroup.position.y = -0.4;

    // Body (Pink Hoodie)
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
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (charGroupRef.current) {
        charGroupRef.current.rotation.y += delta * 0.85;
        charGroupRef.current.position.y = -0.4 + Math.sin(elapsed * 2.5) * 0.035;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Tip rotation
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
    }, 3500);
    return () => clearInterval(tipTimer);
  }, []);

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 6;
        const bounded = Math.min(100, next);
        setLogIndex(Math.min(SYSTEM_LOGS.length - 1, Math.floor((bounded / 100) * SYSTEM_LOGS.length)));
        return bounded;
      });
    }, 70);

    return () => clearInterval(timer);
  }, []);

  const handleLaunch = () => {
    soundManager.playLevelUpSound();
    onGameReady();
  };

  return (
    <motion.div
      id="aetheria-loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 select-none bg-slate-950/40 backdrop-blur-xl text-white font-sans overflow-hidden"
    >
      {/* Dynamic Animated Ambient Background Aura */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.18)_0,transparent_70%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none animate-pulse [animation-duration:4s]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse [animation-duration:5s]" />

      {/* ─── 1. TOP HEADER STATUS ─── */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.1 }}
        className="relative z-10 w-full max-w-4xl flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full liquid-glass border border-white/50 dark:border-pink-500/30 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent font-mono">
              AETHERIA 3D // OPEN WORLD
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-[9px] font-mono font-bold tracking-widest uppercase">
              LIQUID GLASS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>60 FPS • THREE.JS</span>
          </div>
        </div>
      </motion.header>

      {/* ─── 2. CENTER COMPACT FLOATING CARD (TRANSLUCENT GLASS) ─── */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.15 }}
        className="relative z-10 flex flex-col items-center justify-center max-w-md w-full px-6 py-7 rounded-[36px] liquid-glass border-2 border-white/60 dark:border-pink-500/40 shadow-2xl backdrop-blur-2xl text-center my-auto ring-1 ring-white/30"
      >
        {/* Hologram 3D Avatar Orb (From 3D Profile) */}
        <div className="relative mb-3.5 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-[0_0_35px_rgba(244,63,94,0.45)]">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/90 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative flex items-center justify-center">
              <canvas
                ref={avatarCanvasRef}
                className="w-full h-full object-cover"
                title="Nhân vật 3D Avatar Profile của Lê Thị Minh Thu"
              />
            </div>
          </div>
          <span className="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-pink-400/60 text-[10px] font-mono text-pink-300 font-black tracking-wider shadow-md">
            LV.18 3D PROFILE
          </span>
        </div>

        <h2 className="text-xl font-black text-white tracking-wide font-sans">
          Lê Thị Minh Thu
        </h2>
        <p className="text-xs text-pink-300 font-medium mt-0.5 max-w-xs">
          Frontend Developer • AI & Computer Vision • STEM Facilitator
        </p>

        {/* Live System Log Box with Motion Transition */}
        <div className="w-full my-3.5 px-3 py-2 rounded-2xl bg-black/40 border border-white/10 font-mono text-[11px] text-cyan-300 flex items-center gap-2 justify-center shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="truncate">{SYSTEM_LOGS[logIndex]}</span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Nạp Tài Nguyên
            </span>
            <span className="text-pink-400 font-black">{progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900/80 border border-white/10 overflow-hidden p-0.5">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>
        </div>

        {/* Launch Button when Ready or tap directly */}
        <AnimatePresence>
          {isReady && (
            <motion.button
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              onClick={handleLaunch}
              className="mt-4 w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:opacity-95 text-white font-mono text-xs font-black tracking-wider transition-all cursor-pointer shadow-xl shadow-pink-500/40 flex items-center justify-center gap-2 border border-white/30"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>BẮT ĐẦU KHÁM PHÁ THẾ GIỚI 3D</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── 3. BOTTOM TIP FOOTER WITH MOTION ROTATION ─── */}
      <motion.footer
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.2 }}
        className="relative z-10 w-full max-w-2xl px-4 py-2.5 rounded-2xl liquid-glass border border-white/40 dark:border-pink-500/30 shadow-lg text-center backdrop-blur-2xl"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-slate-200 font-mono"
          >
            💡 {PRO_TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.footer>
    </motion.div>
  );
};
