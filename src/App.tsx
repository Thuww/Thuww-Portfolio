import React, { useState, useEffect, useCallback } from 'react';
import { SectionKey, Waypoint, ProjectedWaypoint } from './types';
import { PERSONAL_INFO, WAYPOINTS } from './data/portfolioData';
import { soundManager } from './audio/soundManager';
import { ThreeWorld } from './components/ThreeWorld';
import { WaypointPins } from './components/WaypointPins';
import { Navbar } from './components/Navbar';
import { HomeQuickDock } from './components/HomeQuickDock';
import { ControlsOverlay } from './components/ControlsOverlay';
import { WaypointsModal } from './components/WaypointsModal';
import { AiChatbot } from './components/AiChatbot';
import { MiniGame } from './components/MiniGame';
import { MobileNav } from './components/MobileNav';
import { GameLoadingScreen } from './components/GameLoadingScreen';
import { CloudTransition } from './components/CloudTransition';
import { PhotoMode } from './components/PhotoMode';
import { SkillsConstellationView } from './components/islands/SkillsConstellationView';
import { JournalExpeditionView } from './components/islands/JournalExpeditionView';
import { AboutIslandView } from './components/islands/AboutIslandView';
import { ProjectsArcadeView } from './components/islands/ProjectsArcadeView';
import { ContactStargateView } from './components/islands/ContactStargateView';
import { EmotesWheel } from './components/EmotesWheel';
import { HRQuickCVModal } from './components/HRQuickCVModal';
import { RightControlCenter } from './components/RightControlCenter';
import { AvatarStudioModal } from './components/AvatarStudioModal';
import confetti from 'canvas-confetti';

export default function App() {
  // Game lifecycle states
  const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('home');
  const [warpTarget, setWarpTarget] = useState<SectionKey | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [collectedCrystals, setCollectedCrystals] = useState<boolean[]>([false, false, false, false, false]);
  const [projectedWaypoints, setProjectedWaypoints] = useState<ProjectedWaypoint[]>([]);
  const [nearbyLandmark, setNearbyLandmark] = useState<{ sectionKey: SectionKey; title: string } | null>(null);

  // Trending Game UI & Features
  const [isPhotoModeOpen, setIsPhotoModeOpen] = useState<boolean>(false);
  const [showEmotes, setShowEmotes] = useState<boolean>(false);
  const [showHRQuickCV, setShowHRQuickCV] = useState<boolean>(false);
  const [isAvatarStudioOpen, setIsAvatarStudioOpen] = useState<boolean>(false);

  // Dynamic Gamified Progression Stats
  const [playerXP, setPlayerXP] = useState<number>(PERSONAL_INFO.currentXp);
  const [playerLevel, setPlayerLevel] = useState<number>(PERSONAL_INFO.level);

  // Modals for Badges and CV
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showCVModal, setShowCVModal] = useState<boolean>(false);
  const [hintToast, setHintToast] = useState<string | null>(null);

  // Sync dark class on root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global listener to open avatar studio from header/shortcuts
  useEffect(() => {
    const handleOpenAvatarStudio = () => setIsAvatarStudioOpen(true);
    window.addEventListener('open-avatar-studio', handleOpenAvatarStudio);
    return () => {
      window.removeEventListener('open-avatar-studio', handleOpenAvatarStudio);
    };
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleMusic = () => {
    const playing = soundManager.toggleMusic();
    setIsMusicPlaying(playing);
  };

  // Warp into dedicated island view with cute Cloud Flyby transition
  const handleWarpToIsland = useCallback((section: SectionKey) => {
    soundManager.playTeleportSound();
    setWarpTarget(section);
  }, []);

  const handleWarpReached = useCallback(() => {
    if (warpTarget) {
      setActiveSection(warpTarget);
    }
  }, [warpTarget]);

  const handleWarpFinished = useCallback(() => {
    setWarpTarget(null);
  }, []);

  const handleBackToWorld = useCallback(() => {
    handleWarpToIsland('home');
  }, [handleWarpToIsland]);

  const handleSelectWaypoint = useCallback((waypoint: Waypoint) => {
    handleWarpToIsland(waypoint.sectionKey);
  }, [handleWarpToIsland]);

  const handleGainXP = useCallback((amount: number) => {
    setPlayerXP((prev) => prev + amount);
  }, []);

  // Watch for Player Level Up cleanly
  useEffect(() => {
    const nextLevel = Math.floor(playerXP / 1000) + 1;
    if (nextLevel > playerLevel) {
      setPlayerLevel(nextLevel);
      soundManager.playLevelUpSound();
      setHintToast(`🆙 LEVEL UP! Bạn đã đạt Cấp Độ ${nextLevel}!`);
      const timer = setTimeout(() => {
        setHintToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [playerXP, playerLevel]);

  const handleCollectCrystal = useCallback((index: number) => {
    if (collectedCrystals[index]) return;

    setCollectedCrystals((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    handleGainXP(200);

    const count = collectedCrystals.filter(Boolean).length + 1;
    if (count === 5) {
      soundManager.playLevelUpSound();
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
      });
      setHintToast('🎉 CHÚC MỪNG! Bạn đã tìm đủ 5 Tinh Thể Ngôi Sao & mở khóa Shader Master!');
    } else {
      setHintToast(`✨ Thu thập Tinh Thể (${count}/5)! +200 XP kinh nghiệm!`);
    }

    setTimeout(() => {
      setHintToast(null);
    }, 4500);
  }, [collectedCrystals, handleGainXP]);

  const handleHintRequested = useCallback((text: string) => {
    setHintToast(text);
    setTimeout(() => {
      setHintToast(null);
    }, 5000);
  }, []);

  // Find island display name for cloud transition
  const getIslandName = (key: SectionKey | null) => {
    switch (key) {
      case 'home':
        return 'Thế Giới Chính • Aetheria';
      case 'about':
        return 'Đảo 01: Vườn Sáng Tạo (Atelier)';
      case 'projects':
        return 'Đảo 02: Khu Trò Chơi (Arcade)';
      case 'skills':
        return 'Đảo 03: Chòm Sao Kỹ Năng (Spire)';
      case 'journal':
        return 'Đảo 04: Bản Đồ Hải Trình (Expedition)';
      case 'contact':
        return 'Đảo 05: Cổng Tín Hiệu (Stargate)';
      default:
        return 'Hòn Đảo Bí Ẩn';
    }
  };

  const collectedCrystalsCount = collectedCrystals.filter(Boolean).length;

  return (
    <div
      id="app-root"
      className="relative w-screen h-screen overflow-hidden select-none bg-sky-100 dark:bg-slate-950 transition-colors duration-500 font-sans"
    >
      {/* 1. Play Together Game Loading Screen */}
      {!isGameLoaded && (
        <GameLoadingScreen
          onGameReady={() => {
            setIsGameLoaded(true);
            const playing = soundManager.toggleMusic();
            setIsMusicPlaying(playing);
          }}
        />
      )}

      {/* 2. Cute Flying Clouds & Airplane Loading Transition */}
      {warpTarget && (
        <CloudTransition
          islandName={getIslandName(warpTarget)}
          onWarpReached={handleWarpReached}
          onFinished={handleWarpFinished}
        />
      )}

      {/* 3. Base 3D Open World (Play Together Style Islands in Live View) */}
      <ThreeWorld
        isDarkMode={isDarkMode}
        activeSection={activeSection}
        onSelectWaypoint={handleSelectWaypoint}
        onCollectCrystal={handleCollectCrystal}
        collectedCrystals={collectedCrystals}
        onUpdateProjectedWaypoints={setProjectedWaypoints}
        onProximityChange={setNearbyLandmark}
        onGainXP={handleGainXP}
      />

      {/* 4. 2D Interactive Waypoint Overlays */}
      {activeSection === 'home' && (
        <WaypointPins
          activeSection={activeSection}
          onSelectWaypoint={handleSelectWaypoint}
          projectedWaypoints={projectedWaypoints}
        />
      )}

      {/* 5. Top Navigation Header (Unified, Single-layer, No Collisions) */}
      {activeSection === 'home' && (
        <Navbar
          activeSection={activeSection}
          onNavigate={handleWarpToIsland}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onOpenConnect={() => handleWarpToIsland('contact')}
          totalXp={playerXP}
          crystalsCount={collectedCrystalsCount}
          totalCrystals={5}
          onOpenPhotoMode={() => setIsPhotoModeOpen(true)}
          onOpenEmotes={() => setShowEmotes(true)}
          onOpenHRQuickCV={() => setShowHRQuickCV(true)}
        />
      )}

      {/* 7. Mini-game Quest Tracker */}
      {activeSection === 'home' && (
        <MiniGame
          collectedCrystals={collectedCrystals}
          onHintRequested={handleHintRequested}
        />
      )}

      {/* 8. Minimalist Home Quick Dock (Unobstructed 3D World Landscape) */}
      {activeSection === 'home' && (
        <HomeQuickDock
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onSelectSection={handleWarpToIsland}
          onOpenBadgesModal={() => setShowBadgesModal(true)}
          onOpenPhotoMode={() => setIsPhotoModeOpen(true)}
          onOpenHRQuickCV={() => setShowHRQuickCV(true)}
          onOpenEmotes={() => {
            const emoteBtn = document.getElementById('emotes-trigger-btn');
            if (emoteBtn) {
              emoteBtn.click();
            } else {
              setShowEmotes(true);
            }
          }}
        />
      )}

      {/* 10. Controls Overlay (WASD, Space Jump, [E] Interact) */}
      {activeSection === 'home' && (
        <ControlsOverlay
          onTriggerMove={(key) => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            setTimeout(() => {
              window.dispatchEvent(new KeyboardEvent('keyup', { key }));
            }, 150);
          }}
          nearbyLandmark={nearbyLandmark}
          onInteract={() => {
            if (nearbyLandmark) {
              handleWarpToIsland(nearbyLandmark.sectionKey);
            }
          }}
        />
      )}

      {/* 11. Play Together Emotes Wheel (Accessible via dock or Control Center) */}
      <EmotesWheel
        isOpen={showEmotes}
        onClose={() => setShowEmotes(false)}
        onToggle={() => setShowEmotes(!showEmotes)}
      />

      {/* 12. Universal iPad-Style Control Center (Draggable floating pill, accessible anywhere) */}
      <RightControlCenter
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenPhotoMode={() => setIsPhotoModeOpen(true)}
        onOpenEmotes={() => setShowEmotes(true)}
        onOpenBadgesModal={() => setShowBadgesModal(true)}
        onOpenHRQuickCV={() => setShowHRQuickCV(true)}
        onOpenAvatarStudio={() => setIsAvatarStudioOpen(true)}
        onNavigate={handleWarpToIsland}
        activeSection={activeSection}
      />

      {/* ─── DEDICATED CREATIVE ISLAND EXPERIENCES ─── */}

      {/* ISLAND 01: ABOUT ME (Professional Profile & Core Mindset) */}
      {activeSection === 'about' && (
        <AboutIslandView
          onBackToWorld={handleBackToWorld}
          onGainXP={handleGainXP}
          onWarpToSection={handleWarpToIsland}
          onOpenHRQuickCV={() => setShowHRQuickCV(true)}
        />
      )}

      {/* ISLAND 02: PROJECTS (Cyber Arcade & WebGL Fluid Canvas Game) */}
      {activeSection === 'projects' && (
        <ProjectsArcadeView
          onBackToWorld={handleBackToWorld}
          onGainXP={handleGainXP}
          onWarpToSection={handleWarpToIsland}
        />
      )}

      {/* ISLAND 03: SKILLS (Celestial Star Constellation & Skill Tree) */}
      {activeSection === 'skills' && (
        <SkillsConstellationView
          onBackToWorld={handleBackToWorld}
          onGainXP={handleGainXP}
        />
      )}

      {/* ISLAND 04: JOURNAL (Expedition Treasure Map & Parchment Devlogs) */}
      {activeSection === 'journal' && (
        <JournalExpeditionView
          onBackToWorld={handleBackToWorld}
          onGainXP={handleGainXP}
        />
      )}

      {/* ISLAND 05: CONTACT (Starlight Stargate Quantum Signal Transmitter) */}
      {activeSection === 'contact' && (
        <ContactStargateView
          onBackToWorld={handleBackToWorld}
          onGainXP={handleGainXP}
        />
      )}

      {/* 13. Camera Photo Mode Viewfinder */}
      <PhotoMode
        isOpen={isPhotoModeOpen}
        onClose={() => setIsPhotoModeOpen(false)}
        onGainXP={handleGainXP}
      />

      {/* 14. Hint / Achievement Toast Notification */}
      {hintToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl text-slate-900 dark:text-white text-xs font-black shadow-2xl border-2 border-pink-400 dark:border-pink-500 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-300">
          <span>{hintToast}</span>
        </div>
      )}

      {/* 15. AI Companion Chatbot (Navi) */}
      <AiChatbot />

      {/* 16. Badges & CV Modal */}
      {(showBadgesModal || showCVModal) && (
        <WaypointsModal
          activeSection={activeSection}
          onClose={() => {}}
          onNavigate={handleWarpToIsland}
          showBadgesModal={showBadgesModal}
          onCloseBadgesModal={() => setShowBadgesModal(false)}
          showCVModal={showCVModal}
          onCloseCVModal={() => setShowCVModal(false)}
        />
      )}

      {/* 17. Mobile Bottom Nav */}
      {activeSection === 'home' && (
        <MobileNav
          activeSection={activeSection}
          onNavigate={handleWarpToIsland}
        />
      )}

      {/* 18. HR Fast-Track CV Modal */}
      <HRQuickCVModal
        isOpen={showHRQuickCV}
        onClose={() => setShowHRQuickCV(false)}
        onOpen3DWorld={() => {
          setShowHRQuickCV(false);
          setActiveSection('home');
        }}
      />

      {/* 19. Avatar Studio 3D Customizer Modal */}
      <AvatarStudioModal
        isOpen={isAvatarStudioOpen}
        onClose={() => setIsAvatarStudioOpen(false)}
      />
    </div>
  );
}
