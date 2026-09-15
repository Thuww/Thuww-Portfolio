import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { WAYPOINTS } from '../data/portfolioData';
import { SectionKey, Waypoint, ProjectedWaypoint } from '../types';
import { soundManager } from '../audio/soundManager';
import {
  getCustomModel,
  getStoredModelSettings,
  ModelSettings,
} from '../utils/characterStore';

interface ThreeWorldProps {
  isDarkMode: boolean;
  activeSection: SectionKey;
  onSelectWaypoint: (waypoint: Waypoint) => void;
  onCollectCrystal: (index: number) => void;
  collectedCrystals: boolean[];
  onUpdateProjectedWaypoints: (waypoints: ProjectedWaypoint[]) => void;
  onProximityChange: (landmark: { sectionKey: SectionKey; title: string } | null) => void;
  onGainXP: (amount: number) => void;
}

export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  isDarkMode,
  activeSection,
  onSelectWaypoint,
  onCollectCrystal,
  collectedCrystals,
  onUpdateProjectedWaypoints,
  onProximityChange,
  onGainXP,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Dynamic 3D Objects
  const characterRef = useRef<THREE.Group | null>(null);
  const proceduralBodyGroupRef = useRef<THREE.Group | null>(null);
  const customModelGroupRef = useRef<THREE.Group | null>(null);
  const customMixerRef = useRef<THREE.AnimationMixer | null>(null);
  const customIdleActionRef = useRef<THREE.AnimationAction | null>(null);
  const customWalkActionRef = useRef<THREE.AnimationAction | null>(null);
  const modelSettingsRef = useRef<ModelSettings>(getStoredModelSettings());
  const charHeadRef = useRef<THREE.Group | null>(null);
  const charPonytailRef = useRef<THREE.Group | null>(null);
  const leftLegRef = useRef<THREE.Group | null>(null);
  const rightLegRef = useRef<THREE.Group | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const hotAirBalloonRef = useRef<THREE.Group | null>(null);
  const ferrisWheelRef = useRef<THREE.Group | null>(null);
  const portalRingRef = useRef<THREE.Mesh | null>(null);
  const skillOrbsGroupRef = useRef<THREE.Group | null>(null);
  const cloudsGroupRef = useRef<THREE.Group | null>(null);
  const fireEmbersRef = useRef<THREE.Points | null>(null);
  const crystalsRef = useRef<THREE.Mesh[]>([]);
  const xpOrbsRef = useRef<{ mesh: THREE.Mesh; collected: boolean }[]>([]);
  const waypointMeshesRef = useRef<{ mesh: THREE.Group; waypoint: Waypoint }[]>([]);
  const carrierPigeonRef = useRef<THREE.Group | null>(null);
  const shoppingCartRef = useRef<THREE.Group | null>(null);
  const collectedCrystalsRef = useRef(collectedCrystals);

  useEffect(() => {
    collectedCrystalsRef.current = collectedCrystals;
    crystalsRef.current.forEach((mesh, idx) => {
      if (mesh) mesh.visible = !collectedCrystals[idx];
    });
  }, [collectedCrystals]);

  // Character movement physics
  const charPosition = useRef(new THREE.Vector3(0, 4.5, 11));
  const charVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const charTargetWalk = useRef<THREE.Vector3 | null>(null);
  const isGrounded = useRef(true);
  const isGliding = useRef(false);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const lastFootstepTime = useRef(0);
  const terrainObjectsRef = useRef<THREE.Object3D[]>([]);
  const downRaycaster = useRef(new THREE.Raycaster());

  // Camera Orbit & Follow
  const isDragging = useRef(false);
  const dragDistance = useRef(0);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef(new THREE.Vector3(0, 5, 9));
  const cameraTarget = useRef(new THREE.Vector3(0, 4.5, 11));

  // Precise Terrain Heightmap & Island Surface Detection
  const getIslandGroundHeight = (x: number, z: number): number => {
    // 1. Main Islands Surface Checks (With generous borders to cover full island plateau)
    // Foreground Overlook (Spawn)
    if (Math.hypot(x - 0, z - 11) < 8.8) return 4.5;
    // Island 01: About Me (Left Island - Atelier of Dreams, Elev: 5.6)
    if (Math.hypot(x - (-11), z - (-6)) < 9.8) return 5.6;
    // Island 02: Projects (Center Island - Cyber Arcade Plaza, Elev: 2.6)
    if (Math.hypot(x - 3, z - (-8)) < 16.0) return 2.6;
    // Island 03: Skills (High Island - Alchemical Spire, Elev: 7.1)
    if (Math.hypot(x - 13, z - (-14)) < 11.2) return 7.1;
    // Island 04: Journal (Right Island - Chronicle Sanctuary, Elev: 3.0)
    if (Math.hypot(x - 14, z - (-2)) < 8.8) return 3.0;
    // Island 05: Contact (Stargate Portal, Elev: 2.0)
    if (Math.hypot(x - 2, z - 4) < 7.5) return 2.0;

    // 2. Floating Jump Pads between islands
    const pads: [number, number, number, number][] = [
      [0, 8, 4.0, 2.2],
      [1, 6, 3.0, 2.2],
      [-3, 3, 2.7, 2.2],
      [-6, 0, 3.0, 2.2],
      [-8, -3, 3.4, 2.2],
      [-10, -5, 4.8, 2.8],
      [3, 0, 2.2, 2.2],
      [3, -4, 2.4, 2.2],
      [8, -6, 2.7, 2.2],
      [11, -10, 4.8, 2.8],
      [12, -12, 6.0, 2.8],
      [9, -1, 2.2, 2.2],
      [12, -1, 2.8, 2.2],
    ];
    for (const [px, pz, py, radius] of pads) {
      if (Math.hypot(x - px, z - pz) < radius) return py;
    }

    // Default safe floating ocean elevation if crossing gaps
    return 2.5;
  };

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const dayBg = new THREE.Color('#dbeafe');
    const nightBg = new THREE.Color('#0b1120');
    scene.background = isDarkMode ? nightBg : dayBg;
    scene.fog = new THREE.FogExp2(isDarkMode ? '#0b1120' : '#e0f2fe', 0.012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 8, 20);
    camera.lookAt(charPosition.current);
    cameraRef.current = camera;

    // 3. Renderer (preserveDrawingBuffer: true enables PhotoMode high-res screenshot capture)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDarkMode ? 1.3 : 1.15;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(isDarkMode ? 0x475569 : 0xffedd5, isDarkMode ? 1.4 : 1.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(isDarkMode ? 0x818cf8 : 0xfff7ed, isDarkMode ? 1.3 : 2.2);
    sunLight.position.set(30, 50, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -35;
    sunLight.shadow.camera.right = 35;
    sunLight.shadow.camera.top = 35;
    sunLight.shadow.camera.bottom = -35;
    scene.add(sunLight);

    // Point lights
    const pinkPointLight = new THREE.PointLight(0xf472b6, 2.5, 35);
    pinkPointLight.position.set(-11, 10, -6);
    scene.add(pinkPointLight);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 2.8, 35);
    cyanPointLight.position.set(3, 8, -8);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 2.5, 35);
    purplePointLight.position.set(13, 10, -14);
    scene.add(purplePointLight);

    // Common Materials
    const grassMaterial = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1e3a2b : 0x56a445,
      roughness: 0.7,
      metalness: 0.1,
    });
    const cliffMaterial = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x27272a : 0x85664b,
      roughness: 0.9,
    });
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x0f3460 : 0x38bdf8,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    // 5. Ocean Base Plane
    const oceanGeo = new THREE.PlaneGeometry(200, 200, 32, 32);
    const ocean = new THREE.Mesh(oceanGeo, waterMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -6;
    ocean.receiveShadow = true;
    scene.add(ocean);

    // 6. CREATIVE DIVERSE ISLANDS

    // ─── ISLAND 1: "ATELIER OF DREAMS" (ABOUT ME - LEFT) ─────────────────────
    const leftIslandGroup = new THREE.Group();
    const leftBase = new THREE.Mesh(new THREE.CylinderGeometry(8, 1, 6, 12), cliffMaterial);
    leftBase.position.y = 0;
    const leftTop = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 8, 1.2, 12), grassMaterial);
    leftTop.position.y = 3;
    leftIslandGroup.add(leftBase);
    leftIslandGroup.add(leftTop);

    // Fairytale Castle Spire
    const towerGeo = new THREE.CylinderGeometry(1.5, 1.8, 6, 8);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.5 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(0, 6, -1);
    leftIslandGroup.add(tower);

    const roofGeo = new THREE.ConeGeometry(2.4, 3.5, 8);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 10.5, -1);
    leftIslandGroup.add(roof);

    // Windmill / Weather Vane on Spire
    const vane = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.4, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xfde047 })
    );
    vane.position.set(0, 12.3, -1);
    leftIslandGroup.add(vane);

    // Cozy Campfire with stones
    const bonfireGroup = new THREE.Group();
    bonfireGroup.position.set(3, 3.6, 2);
    for (let r = 0; r < 8; r++) {
      const stoneAngle = (r / 8) * Math.PI * 2;
      const stone = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.25, 0),
        new THREE.MeshStandardMaterial({ color: 0x64748b })
      );
      stone.position.set(Math.cos(stoneAngle) * 0.7, 0, Math.sin(stoneAngle) * 0.7);
      bonfireGroup.add(stone);
    }
    // Fire logs
    const log1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    log1.rotation.z = 0.5;
    const log2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    log2.rotation.z = -0.5;
    bonfireGroup.add(log1);
    bonfireGroup.add(log2);

    // Fire flame core
    const fireLight = new THREE.PointLight(0xf97316, 2.0, 8);
    fireLight.position.set(0, 0.5, 0);
    bonfireGroup.add(fireLight);
    leftIslandGroup.add(bonfireGroup);

    // Stargazing Telescope
    const telescope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.25, 1.6),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 })
    );
    telescope.position.set(-3.5, 4.4, 3);
    telescope.rotation.x = -0.6;
    leftIslandGroup.add(telescope);

    leftIslandGroup.position.set(-11, 2, -6);
    scene.add(leftIslandGroup);

    // ─── ISLAND 2: "CYBER ARCADE PLAZA" (PROJECTS - CENTER) ──────────────────
    const centerIslandGroup = new THREE.Group();
    const centerBase = new THREE.Mesh(new THREE.CylinderGeometry(14, 2, 8, 14), cliffMaterial);
    centerBase.position.y = -2;
    const centerTop = new THREE.Mesh(new THREE.CylinderGeometry(14.2, 14, 1.2, 14), grassMaterial);
    centerTop.position.y = 2;
    centerIslandGroup.add(centerBase);
    centerIslandGroup.add(centerTop);

    // 3D Cyber Arcade Plaza Buildings
    const arcadeBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(5, 6, 4),
      new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x1e1b4b : 0xe0e7ff,
        metalness: 0.6,
        roughness: 0.2,
      })
    );
    arcadeBuilding.position.set(2, 5.5, -4);
    arcadeBuilding.castShadow = true;
    centerIslandGroup.add(arcadeBuilding);

    // Rotating Hologram Ring on Roof
    const holoRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.15, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    holoRing.position.set(2, 9.5, -4);
    centerIslandGroup.add(holoRing);

    // 3 Interactive 3D Arcade Cabinets standing in plaza!
    const createArcadeCabinet = (x: number, z: number, color: number, title: string) => {
      const cabGroup = new THREE.Group();
      // Cabinet Body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 1.8, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      );
      body.position.y = 0.9;
      cabGroup.add(body);

      // Glowing CRT Screen
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.7, 0.6),
        new THREE.MeshBasicMaterial({ color })
      );
      screen.position.set(0, 1.1, 0.46);
      cabGroup.add(screen);

      // Marquee Neon Sign
      const marquee = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.25, 0.15),
        new THREE.MeshBasicMaterial({ color })
      );
      marquee.position.set(0, 1.7, 0.4);
      cabGroup.add(marquee);

      cabGroup.position.set(x, 2.6, z);
      cabGroup.rotation.y = Math.PI;
      return cabGroup;
    };

    // Add 3 cabinets for the 3 main projects!
    centerIslandGroup.add(createArcadeCabinet(-2, 1, 0x38bdf8, 'CyberRealm'));
    centerIslandGroup.add(createArcadeCabinet(0, 1, 0xf472b6, 'AuraFluid'));
    centerIslandGroup.add(createArcadeCabinet(2, 1, 0xf59e0b, 'ChronoCraft'));

    // Ferris Wheel on Plaza
    const ferrisGroup = new THREE.Group();
    const wheelCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    wheelCenter.rotation.x = Math.PI / 2;
    ferrisGroup.add(wheelCenter);
    const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.12, 8, 24), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
    ferrisGroup.add(wheelRing);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      spoke.position.set(Math.cos(angle) * 1.75, Math.sin(angle) * 1.75, 0);
      spoke.rotation.z = angle + Math.PI / 2;
      ferrisGroup.add(spoke);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.6), new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0xf472b6 }));
      cabin.position.set(Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0);
      ferrisGroup.add(cabin);
    }
    ferrisGroup.position.set(-6, 6, -3);
    ferrisWheelRef.current = ferrisGroup;
    centerIslandGroup.add(ferrisGroup);

    centerIslandGroup.position.set(3, 0, -8);
    scene.add(centerIslandGroup);

    // ─── ISLAND 3: "ALCHEMICAL SKILL SPIRE" (SKILLS - BACK RIGHT) ───────────
    const skillsIslandGroup = new THREE.Group();
    const skillsBase = new THREE.Mesh(new THREE.CylinderGeometry(9, 1.5, 7, 12), cliffMaterial);
    skillsBase.position.y = 1;
    const skillsTop = new THREE.Mesh(new THREE.CylinderGeometry(9.2, 9, 1.2, 12), grassMaterial);
    skillsTop.position.y = 4.5;
    skillsIslandGroup.add(skillsBase);
    skillsIslandGroup.add(skillsTop);

    // Glowing Alchemical Crystal Obelisk
    const obeliskGeo = new THREE.ConeGeometry(1.6, 7, 6);
    const obeliskMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2,
    });
    const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
    obelisk.position.set(0, 8, 0);
    skillsIslandGroup.add(obelisk);

    // Orbiting Floating Skill Orbs (React, TypeScript, Three.js, Shaders, UI/UX)
    const skillOrbsGroup = new THREE.Group();
    skillOrbsGroup.position.set(0, 9, 0);
    const orbColors = [0x38bdf8, 0x818cf8, 0xf472b6, 0x34d399, 0xfbbf24];
    for (let o = 0; o < 5; o++) {
      const orbAngle = (o / 5) * Math.PI * 2;
      const orb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.4, 1),
        new THREE.MeshStandardMaterial({
          color: orbColors[o],
          emissive: orbColors[o],
          emissiveIntensity: 0.8,
        })
      );
      orb.position.set(Math.cos(orbAngle) * 3.2, Math.sin(orbAngle * 2) * 0.8, Math.sin(orbAngle) * 3.2);
      skillOrbsGroup.add(orb);
    }
    skillOrbsGroupRef.current = skillOrbsGroup;
    skillsIslandGroup.add(skillOrbsGroup);

    skillsIslandGroup.position.set(13, 2, -14);
    scene.add(skillsIslandGroup);

    // ─── ISLAND 4: "CHRONICLE SANCTUARY" (JOURNAL - FAR RIGHT) ──────────────
    const journalIslandGroup = new THREE.Group();
    const jBase = new THREE.Mesh(new THREE.CylinderGeometry(7, 1, 5, 10), cliffMaterial);
    jBase.position.y = -0.5;
    const jTop = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 7, 1, 10), grassMaterial);
    jTop.position.y = 2;
    journalIslandGroup.add(jBase);
    journalIslandGroup.add(jTop);

    // Ancient Stone Library Pillars
    for (let p = 0; p < 4; p++) {
      const pillarAngle = (p / 4) * Math.PI * 2;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 3.5, 8),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 })
      );
      pillar.position.set(Math.cos(pillarAngle) * 2.8, 3.7, Math.sin(pillarAngle) * 2.8);
      journalIslandGroup.add(pillar);
    }

    // Floating Levitating Codex / Spellbook
    const bookPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.8, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    bookPedestal.position.set(0, 2.7, 0);
    journalIslandGroup.add(bookPedestal);

    const levitatingBook = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.5 })
    );
    levitatingBook.position.set(0, 4.0, 0);
    levitatingBook.rotation.z = 0.2;
    journalIslandGroup.add(levitatingBook);

    journalIslandGroup.position.set(14, 0.5, -2);
    scene.add(journalIslandGroup);

    // ─── ISLAND 5: "STARLIGHT STARGATE" (CONTACT - FOREGROUND PORTAL) ─────────
    const portalIslandGroup = new THREE.Group();
    const pBase = new THREE.Mesh(new THREE.CylinderGeometry(6, 1.5, 4, 10), cliffMaterial);
    pBase.position.y = -0.5;
    const pTop = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6, 0.8, 10), grassMaterial);
    pTop.position.y = 1.6;
    portalIslandGroup.add(pBase);
    portalIslandGroup.add(pTop);

    // Massive Glowing Stargate Ring
    const gateRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.25, 12, 32),
      new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x9333ea,
        emissiveIntensity: 0.9,
        metalness: 0.8,
      })
    );
    gateRing.position.set(0, 4.2, 0);
    portalRingRef.current = gateRing;
    portalIslandGroup.add(gateRing);

    // Vortex Portal Plane
    const vortex = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 32),
      new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      })
    );
    vortex.position.set(0, 4.2, 0);
    portalIslandGroup.add(vortex);

    portalIslandGroup.position.set(2, 0, 4);
    scene.add(portalIslandGroup);

    // ─── FOREGROUND OVERLOOK CLIFF ──────────────────────────────────────────
    const fgIsland = new THREE.Group();
    const fgBase = new THREE.Mesh(new THREE.CylinderGeometry(7, 2, 6, 8), cliffMaterial);
    fgBase.position.y = 1;
    const fgTop = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 7, 1, 8), grassMaterial);
    fgTop.position.y = 4;
    fgIsland.add(fgBase);
    fgIsland.add(fgTop);
    fgIsland.position.set(0, 0, 11);
    scene.add(fgIsland);

    // ─── FLOATING JUMP PADS / ENERGY BRIDGES CONNECTING ISLANDS ──────────────
    const bridgeGroup = new THREE.Group();
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    const bridgeCoords: [number, number, number][] = [
      [0, 3.8, 8],     // Between FG and Portal
      [1, 2.8, 6],
      [-3, 2.5, 3],    // Toward Left Island
      [-6, 2.8, 0],
      [-8, 3.2, -3],
      [3, 2.0, 0],     // Toward Projects Center
      [3, 2.2, -4],
      [8, 2.5, -6],    // Toward Skills
      [11, 3.2, -10],
      [9, 1.8, -1],    // Toward Journal
    ];

    bridgeCoords.forEach((coord, i) => {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.25, 6), padMat);
      pad.position.set(coord[0], coord[1], coord[2]);
      pad.receiveShadow = true;
      bridgeGroup.add(pad);
    });
    scene.add(bridgeGroup);
    // Mark ground tops as walkable ground
    fgTop.userData = { isWalkableGround: true };
    leftTop.userData = { isWalkableGround: true };
    centerTop.userData = { isWalkableGround: true };
    skillsTop.userData = { isWalkableGround: true };
    jTop.userData = { isWalkableGround: true };
    pTop.userData = { isWalkableGround: true };

    // ONLY walkable ground meshes and jump pads are checked for character elevation (NEVER roofs or buildings)
    terrainObjectsRef.current = [
      fgTop,
      leftTop,
      centerTop,
      skillsTop,
      jTop,
      pTop,
      bridgeGroup,
    ];

    // ─── 7. PLAYABLE EXPLORER CHARACTER RIG (REALISTIC SCULPTED 3D AVATAR) ───
    const charGroup = new THREE.Group();

    // Soft dynamic contact shadow on ground
    const shadowGeo = new THREE.CircleGeometry(0.55, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.35,
    });
    const charShadow = new THREE.Mesh(shadowGeo, shadowMat);
    charShadow.rotation.x = -Math.PI / 2;
    charShadow.position.y = 0.02;
    charGroup.add(charShadow);

    // Procedural sculpted body container (can be hidden when custom GLB is loaded)
    const proceduralBodyGroup = new THREE.Group();
    charGroup.add(proceduralBodyGroup);
    proceduralBodyGroupRef.current = proceduralBodyGroup;

    // 3D Profile Signature Materials (Matching Profile Character)
    const profileSkinMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.35,
      metalness: 0.05,
    });
    const profilePinkHoodieMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.35,
      metalness: 0.2,
    });
    const profilePinkAccentMat = new THREE.MeshStandardMaterial({
      color: 0xdb2777,
      roughness: 0.4,
      metalness: 0.2,
    });
    const profileNavyCapMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.5,
      metalness: 0.15,
    });
    const profileGoldGlassesMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.18,
    });
    const profilePantsMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.65,
    });
    const profileWhiteShoeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
    });

    // ─── TORSO & SIGNATURE PINK HOODIE (EXACT SAME AS 3D PROFILE) ───
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.35;

    // Main Hoodie Body (Play Together & 3D Profile style cylinder taper)
    const hoodieBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.36, 0.82, 20),
      profilePinkHoodieMat
    );
    hoodieBody.position.y = 0.05;
    torsoGroup.add(hoodieBody);

    // Ribbed Lower Hem
    const hoodieHem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.08, 20),
      profilePinkAccentMat
    );
    hoodieHem.position.y = -0.38;
    torsoGroup.add(hoodieHem);

    // Kangaroo Front Pocket
    const frontPocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.2, 0.08),
      profilePinkAccentMat
    );
    frontPocket.position.set(0, -0.15, 0.28);
    torsoGroup.add(frontPocket);

    // Cute Hoodie Hood (resting on the back/neck)
    const backHood = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.65),
      profilePinkHoodieMat
    );
    backHood.rotation.x = -Math.PI * 0.45;
    backHood.position.set(0, 0.35, -0.18);
    torsoGroup.add(backHood);

    // Hoodie Drawstrings
    [-0.06, 0.06].forEach((xSide) => {
      const stringMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.24, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      stringMesh.position.set(xSide, 0.22, 0.3);
      torsoGroup.add(stringMesh);

      const tipMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.04, 8),
        profileGoldGlassesMat
      );
      tipMesh.position.set(xSide, 0.09, 0.3);
      torsoGroup.add(tipMesh);
    });

    proceduralBodyGroup.add(torsoGroup);

    // ─── NECK ───
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.24, 16),
      profileSkinMat
    );
    neck.position.y = 2.06;
    proceduralBodyGroup.add(neck);

    // ─── HEAD & 3D PROFILE AVATAR (PEACH SKIN, GOLD GLASSES, NAVY CAP/HAIR) ───
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.42;

    // Head Sphere (Exactly matches 3D Profile: SphereGeometry(0.26, 24, 24))
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 24, 24),
      profileSkinMat
    );
    headGroup.add(head);

    // Hair / Cap (Exactly matches 3D Profile: SphereGeometry(0.28, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), navy color)
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      profileNavyCapMat
    );
    cap.position.y = 0.05;
    headGroup.add(cap);

    // Cap Visor Brim in front
    const capVisor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.3, 0.03, 16, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
      profileNavyCapMat
    );
    capVisor.rotation.x = 0.22;
    capVisor.position.set(0, 0.1, 0.16);
    headGroup.add(capVisor);

    // Cute Bangs framing face
    const bangL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), profileNavyCapMat);
    bangL.rotation.set(0.3, 0.2, -0.3);
    bangL.position.set(-0.14, 0.06, 0.2);
    headGroup.add(bangL);
    const bangR = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), profileNavyCapMat);
    bangR.rotation.set(0.3, -0.2, 0.3);
    bangR.position.set(0.14, 0.06, 0.2);
    headGroup.add(bangR);

    // ─── SIGNATURE GOLDEN ROUND GLASSES (EXACTLY AS IN 3D PROFILE) ───
    const glassGeo = new THREE.TorusGeometry(0.075, 0.015, 12, 24);
    const glassL = new THREE.Mesh(glassGeo, profileGoldGlassesMat);
    glassL.position.set(-0.1, 0, 0.25);
    headGroup.add(glassL);

    const glassR = glassL.clone();
    glassR.position.x = 0.1;
    headGroup.add(glassR);

    // Glasses Bridge
    const bridgeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.07);
    const bridge = new THREE.Mesh(bridgeGeo, profileGoldGlassesMat);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0, 0.26);
    headGroup.add(bridge);

    // Glasses Temples (Side arms)
    [-0.17, 0.17].forEach((sideX) => {
      const temple = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.22),
        profileGoldGlassesMat
      );
      temple.rotation.x = Math.PI / 2;
      temple.position.set(sideX, 0, 0.14);
      headGroup.add(temple);
    });

    // Eyes with catchlights & soft blush
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.1,
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const eyeSparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0.5,
    });

    [-0.1, 0.1].forEach((xSide) => {
      // Sclera
      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), eyeWhiteMat);
      eyeWhite.scale.set(1.1, 0.9, 0.6);
      eyeWhite.position.set(xSide, 0, 0.22);
      headGroup.add(eyeWhite);

      // Iris
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), irisMat);
      iris.position.set(xSide, 0, 0.245);
      headGroup.add(iris);

      // Pupil
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.011, 10), pupilMat);
      pupil.position.set(xSide, 0, 0.248);
      headGroup.add(pupil);

      // Catchlight Sparkle
      const sparkle = new THREE.Mesh(new THREE.CircleGeometry(0.005, 8), eyeSparkleMat);
      sparkle.position.set(xSide + 0.006, 0.008, 0.25);
      headGroup.add(sparkle);

      // Cute Blush Cheek
      const blush = new THREE.Mesh(new THREE.CircleGeometry(0.036, 12), blushMat);
      blush.position.set(xSide * 1.35, -0.065, 0.23);
      headGroup.add(blush);
    });

    // Soft Smile
    const smileGeo = new THREE.TorusGeometry(0.03, 0.008, 8, 16, Math.PI);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0xe11d48 });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.rotation.x = Math.PI;
    smile.position.set(0, -0.085, 0.24);
    headGroup.add(smile);

    // Ponytail / Hair Strand at Back (for animation)
    const ponytailGroup = new THREE.Group();
    ponytailGroup.position.set(0, 0.05, -0.25);
    const ponytailRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.015, 8, 16),
      profilePinkAccentMat
    );
    ponytailGroup.add(ponytailRing);
    const ponytailTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.42, 10),
      profileNavyCapMat
    );
    ponytailTail.rotation.x = -0.35;
    ponytailTail.position.set(0, -0.16, -0.06);
    ponytailGroup.add(ponytailTail);

    headGroup.add(ponytailGroup);
    charPonytailRef.current = ponytailGroup;

    proceduralBodyGroup.add(headGroup);
    charHeadRef.current = headGroup;

    // ─── LEGS & CHUNKY PROFILE SNEAKERS ───
    // Left Leg Group
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.15, 1.0, 0);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.52, 12), profilePantsMat);
    leftThigh.position.y = -0.26;
    leftLegGroup.add(leftThigh);

    const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.5, 12), profilePantsMat);
    leftShin.position.y = -0.72;
    leftLegGroup.add(leftShin);

    // Left Sneaker
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.28), profileWhiteShoeMat);
    leftShoe.position.set(0, -0.96, 0.04);
    const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.3), profilePinkAccentMat);
    leftSole.position.set(0, -1.02, 0.04);
    leftLegGroup.add(leftShoe);
    leftLegGroup.add(leftSole);

    proceduralBodyGroup.add(leftLegGroup);
    leftLegRef.current = leftLegGroup;

    // Right Leg Group
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.15, 1.0, 0);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 0.52, 12), profilePantsMat);
    rightThigh.position.y = -0.26;
    rightLegGroup.add(rightThigh);

    const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.5, 12), profilePantsMat);
    rightShin.position.y = -0.72;
    rightLegGroup.add(rightShin);

    // Right Sneaker
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.28), profileWhiteShoeMat);
    rightShoe.position.set(0, -0.96, 0.04);
    const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.3), profilePinkAccentMat);
    rightSole.position.set(0, -1.02, 0.04);
    rightLegGroup.add(rightShoe);
    rightLegGroup.add(rightSole);

    proceduralBodyGroup.add(rightLegGroup);
    rightLegRef.current = rightLegGroup;

    // ─── ARMS & HOODIE SLEEVES ───
    // Left Arm Group
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.35, 1.68, 0);

    const leftUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.095, 0.42, 14),
      profilePinkHoodieMat
    );
    leftUpperArm.position.y = -0.2;
    leftArmGroup.add(leftUpperArm);

    const leftForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.38, 14),
      profilePinkHoodieMat
    );
    leftForearm.position.y = -0.52;
    leftArmGroup.add(leftForearm);

    // Ribbed Cuff
    const leftCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.06, 14),
      profilePinkAccentMat
    );
    leftCuff.position.y = -0.66;
    leftArmGroup.add(leftCuff);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), profileSkinMat);
    leftHand.scale.set(0.85, 1.1, 0.85);
    leftHand.position.y = -0.76;
    leftArmGroup.add(leftHand);

    proceduralBodyGroup.add(leftArmGroup);
    leftArmRef.current = leftArmGroup;

    // Right Arm Group
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.35, 1.68, 0);

    const rightUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.095, 0.42, 14),
      profilePinkHoodieMat
    );
    rightUpperArm.position.y = -0.2;
    rightArmGroup.add(rightUpperArm);

    const rightForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.38, 14),
      profilePinkHoodieMat
    );
    rightForearm.position.y = -0.52;
    rightArmGroup.add(rightForearm);

    // Ribbed Cuff
    const rightCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.06, 14),
      profilePinkAccentMat
    );
    rightCuff.position.y = -0.66;
    rightArmGroup.add(rightCuff);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), profileSkinMat);
    rightHand.scale.set(0.85, 1.1, 0.85);
    rightHand.position.y = -0.76;
    rightArmGroup.add(rightHand);

    proceduralBodyGroup.add(rightArmGroup);
    rightArmRef.current = rightArmGroup;

    // Initial character placement
    charGroup.position.copy(charPosition.current);
    charGroup.rotation.y = Math.PI; // Face toward islands
    scene.add(charGroup);
    characterRef.current = charGroup;

    // ─── DYNAMIC CUSTOM 3D CHARACTER (GLTF / GLB / POLY PIZZA LOADER) ───
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    gltfLoader.setDRACOLoader(dracoLoader);

    const setupCustomGltfModel = (gltf: any) => {
      if (!characterRef.current) return;

      // Clean up previous custom model
      if (customModelGroupRef.current) {
        characterRef.current.remove(customModelGroupRef.current);
        customModelGroupRef.current = null;
      }
      if (customMixerRef.current) {
        customMixerRef.current.stopAllAction();
        customMixerRef.current = null;
        customIdleActionRef.current = null;
        customWalkActionRef.current = null;
      }

      const modelScene = gltf.scene;

      // Calculate model bounds to normalize height to ~2.0 units
      const box = new THREE.Box3().setFromObject(modelScene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const currentSettings = modelSettingsRef.current;
      const targetHeight = 2.0;
      const baseScale = targetHeight / Math.max(0.1, size.y);
      const finalScale = baseScale * (currentSettings.scale || 1.0);

      modelScene.scale.set(finalScale, finalScale, finalScale);
      box.setFromObject(modelScene);

      // Ground model feet at y = 0
      modelScene.position.y = -box.min.y + (currentSettings.yOffset || 0);
      modelScene.position.x = -center.x * finalScale;
      modelScene.position.z = -center.z * finalScale;
      modelScene.rotation.y = currentSettings.rotationY || 0;

      // Enable casting and receiving shadows
      modelScene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Handle embedded animations (Idle & Walk)
      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(modelScene);
        customMixerRef.current = mixer;

        const clips = gltf.animations;
        const idleClip = clips.find((c: any) => /idle|wait|stand|pose/i.test(c.name)) || clips[0];
        const walkClip = clips.find((c: any) => /walk|run|move|step/i.test(c.name)) || (clips.length > 1 ? clips[1] : idleClip);

        if (idleClip) {
          const idleAction = mixer.clipAction(idleClip);
          idleAction.play();
          customIdleActionRef.current = idleAction;
        }
        if (walkClip && walkClip !== idleClip) {
          const walkAction = mixer.clipAction(walkClip);
          customWalkActionRef.current = walkAction;
        }
      }

      customModelGroupRef.current = modelScene;
      characterRef.current.add(modelScene);

      // Hide procedural default body while keeping ground shadow
      if (proceduralBodyGroupRef.current) {
        proceduralBodyGroupRef.current.visible = false;
      }
    };

    const resetToProceduralCharacter = () => {
      if (customModelGroupRef.current && characterRef.current) {
        characterRef.current.remove(customModelGroupRef.current);
        customModelGroupRef.current = null;
      }
      if (customMixerRef.current) {
        customMixerRef.current.stopAllAction();
        customMixerRef.current = null;
        customIdleActionRef.current = null;
        customWalkActionRef.current = null;
      }
      if (proceduralBodyGroupRef.current) {
        proceduralBodyGroupRef.current.visible = true;
      }
    };

    const loadActiveCustomModel = async () => {
      try {
        const stored = await getCustomModel();
        if (stored && stored.buffer && stored.buffer.byteLength > 4) {
          const firstBytes = new Uint8Array(stored.buffer.slice(0, 16));
          const textPreview = String.fromCharCode(...firstBytes).trim();
          if (!textPreview.startsWith('<')) {
            gltfLoader.parse(
              stored.buffer,
              '',
              (gltf) => {
                setupCustomGltfModel(gltf);
              },
              (err) => {
                console.warn('Could not parse stored GLTF model:', err);
              }
            );
            return;
          }
        }

        // Check if a static file was placed in /models/character.glb
        try {
          const checkRes = await fetch('/models/character.glb', { method: 'HEAD' });
          const contentType = checkRes.headers.get('content-type') || '';
          if (
            checkRes.ok &&
            !contentType.includes('text/html') &&
            (contentType.includes('model') || contentType.includes('octet-stream') || contentType.includes('gltf') || contentType.includes('binary'))
          ) {
            gltfLoader.load(
              '/models/character.glb',
              (gltf) => {
                setupCustomGltfModel(gltf);
              },
              undefined,
              (err) => {
                console.warn('Fallback: no custom GLB model found, using procedural character:', err);
              }
            );
          }
        } catch {}
      } catch (err) {
        console.warn('Error loading custom character model:', err);
      }
    };

    const onModelUpdated = (e: any) => {
      if (e.detail && e.detail.buffer && e.detail.buffer.byteLength > 4) {
        const firstBytes = new Uint8Array(e.detail.buffer.slice(0, 16));
        const textPreview = String.fromCharCode(...firstBytes).trim();
        if (!textPreview.startsWith('<')) {
          gltfLoader.parse(
            e.detail.buffer,
            '',
            (gltf) => {
              setupCustomGltfModel(gltf);
            },
            (err) => {
              console.warn('Could not parse updated GLTF model:', err);
            }
          );
          return;
        }
      }
      loadActiveCustomModel();
    };

    const onModelReset = () => {
      resetToProceduralCharacter();
    };

    const onSettingsUpdated = (e: any) => {
      if (e.detail) {
        modelSettingsRef.current = e.detail;
        loadActiveCustomModel();
      }
    };

    window.addEventListener('character-model-updated', onModelUpdated);
    window.addEventListener('character-model-reset', onModelReset);
    window.addEventListener('character-settings-updated', onSettingsUpdated);

    // Initial check for active model
    loadActiveCustomModel();

    // ─── 8. HOT AIR BALLOON IN SKY ──────────────────────────────────────────
    const balloonGroup = new THREE.Group();
    const balloonSphere = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.3 }));
    balloonSphere.scale.set(1, 1.3, 1);
    balloonGroup.add(balloonSphere);
    const basket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    basket.position.y = -3.8;
    balloonGroup.add(basket);
    balloonGroup.position.set(15, 14, -6);
    hotAirBalloonRef.current = balloonGroup;
    scene.add(balloonGroup);

    // ─── 9. PROCEDURAL FLUFFY CLOUDS ────────────────────────────────────────
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.82 });
    for (let i = 0; i < 14; i++) {
      const singleCloud = new THREE.Group();
      const numPuffs = 4 + Math.floor(Math.random() * 4);
      for (let p = 0; p < numPuffs; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.5 + Math.random() * 1.5, 8, 8), cloudMat);
        puff.position.set((p - numPuffs / 2) * 1.4, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 1.2);
        singleCloud.add(puff);
      }
      singleCloud.position.set((Math.random() - 0.5) * 90, -1 + Math.random() * 14, (Math.random() - 0.5) * 90);
      cloudsGroup.add(singleCloud);
    }
    cloudsGroupRef.current = cloudsGroup;
    scene.add(cloudsGroup);

    // ─── 10. 5 WAYPOINT BEACONS ─────────────────────────────────────────────
    waypointMeshesRef.current = [];
    WAYPOINTS.forEach((wp) => {
      const wpGroup = new THREE.Group();
      wpGroup.position.set(wp.position[0], wp.position[1], wp.position[2]);

      // Glowing Base Ring
      const ringGeo = new THREE.RingGeometry(0.8, 1.3, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(wp.color), side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      wpGroup.add(ring);

      // Light Beam
      const beaconGeo = new THREE.CylinderGeometry(0.08, 0.4, 4.5, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(wp.color), transparent: true, opacity: 0.45 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 2.25;
      wpGroup.add(beacon);

      // Floating Waypoint Diamond
      const diamondGeo = new THREE.OctahedronGeometry(0.65, 0);
      const diamondMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(wp.color), emissive: new THREE.Color(wp.color), emissiveIntensity: 0.6, roughness: 0.2 });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      diamond.position.y = 4.5;
      diamond.name = `waypoint-${wp.id}`;
      wpGroup.add(diamond);

      scene.add(wpGroup);
      waypointMeshesRef.current.push({ mesh: wpGroup, waypoint: wp });
    });

    // ─── 10B. 3D CARRIER PIGEON & SHOPPING CART AT BALCONY (CONTACT LANDMARK) ──
    const shopDecorGroup = new THREE.Group();
    shopDecorGroup.position.set(5, 0.4, 4);

    // 1. Cute 3D Carrier Pigeon (Chú chim bưu điện)
    const pigeonGroup = new THREE.Group();
    pigeonGroup.position.set(-1.2, 1.2, 0);

    const birdBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
    );
    birdBody.scale.set(1, 0.85, 1.2);
    pigeonGroup.add(birdBody);

    const birdHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    birdHead.position.set(0, 0.25, 0.25);
    pigeonGroup.add(birdHead);

    const birdBeak = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.18, 6),
      new THREE.MeshStandardMaterial({ color: 0xfb923c, roughness: 0.3 })
    );
    birdBeak.rotation.x = Math.PI / 2;
    birdBeak.position.set(0, 0.24, 0.42);
    pigeonGroup.add(birdBeak);

    const mailScroll = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.18, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 })
    );
    mailScroll.position.set(0, 0.1, 0.35);
    mailScroll.rotation.y = 0.2;
    pigeonGroup.add(mailScroll);

    const wingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.24), wingMat);
    leftWing.position.set(-0.35, 0.1, 0);
    pigeonGroup.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.24), wingMat);
    rightWing.position.set(0.35, 0.1, 0);
    pigeonGroup.add(rightWing);

    pigeonGroup.name = 'carrier-pigeon';
    shopDecorGroup.add(pigeonGroup);
    carrierPigeonRef.current = pigeonGroup;

    // 2. 3D Golden Shopping Cart (Chiếc giỏ hàng 3D)
    const cartGroup = new THREE.Group();
    cartGroup.position.set(1.2, 0.5, 0);

    const cartBasket = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.5, 0.6),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    cartBasket.position.y = 0.3;
    cartGroup.add(cartBasket);

    const giftBox1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 })
    );
    giftBox1.position.set(-0.15, 0.4, 0);
    cartGroup.add(giftBox1);

    const giftBox2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.25, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 })
    );
    giftBox2.position.set(0.16, 0.38, 0.04);
    cartGroup.add(giftBox2);

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const wheelPositions = [
      [-0.32, 0.08, -0.26],
      [0.32, 0.08, -0.26],
      [-0.32, 0.08, 0.26],
      [0.32, 0.08, 0.26],
    ];
    wheelPositions.forEach((wp) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 8), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wp[0], wp[1], wp[2]);
      cartGroup.add(wheel);
    });

    cartGroup.name = 'shopping-cart';
    shopDecorGroup.add(cartGroup);
    shoppingCartRef.current = cartGroup;

    scene.add(shopDecorGroup);

    // ─── 11. 5 STAR CRYSTALS (SECRET QUEST) ─────────────────────────────────
    const crystalPositions: [number, number, number][] = [
      [-11, 11, -5], // Castle spire
      [5, 8.5, -8],  // Projects building roof
      [13, 10, -14], // Skills Spire apex
      [14, 3.5, 0],  // Journal cliff
      [0, 5.5, 9],   // Overlook path
    ];
    crystalsRef.current = [];
    crystalPositions.forEach((pos, idx) => {
      const crystalMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.48, 0),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.8,
          metalness: 0.8,
          roughness: 0.1,
          transparent: true,
          opacity: 0.9,
        })
      );
      crystalMesh.position.set(pos[0], pos[1], pos[2]);
      crystalMesh.name = `crystal-${idx}`;
      crystalMesh.visible = !collectedCrystals[idx];
      scene.add(crystalMesh);
      crystalsRef.current.push(crystalMesh);
    });

    // ─── 12. FLOATING GOLDEN XP COINS / ORBS ────────────────────────────────
    const xpOrbs: { mesh: THREE.Mesh; collected: boolean }[] = [];
    bridgeCoords.forEach((coord, i) => {
      const orbMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xd97706,
          emissiveIntensity: 0.8,
          roughness: 0.2,
        })
      );
      orbMesh.position.set(coord[0], coord[1] + 0.8, coord[2]);
      scene.add(orbMesh);
      xpOrbs.push({ mesh: orbMesh, collected: false });
    });
    xpOrbsRef.current = xpOrbs;

    // ─── 13. ANIMATION & GAME LOOP ──────────────────────────────────────────
    let clock = new THREE.Clock();
    let walkCycle = 0;
    const tempProjVec = new THREE.Vector3();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // 1. Rotate Ambient Elements
      if (ferrisWheelRef.current) ferrisWheelRef.current.rotation.z += 0.35 * delta;
      if (portalRingRef.current) portalRingRef.current.rotation.z += 0.8 * delta;
      if (hotAirBalloonRef.current) {
        hotAirBalloonRef.current.position.y = 14 + Math.sin(elapsedTime * 0.8) * 0.9;
        hotAirBalloonRef.current.rotation.y += 0.15 * delta;
      }
      if (skillOrbsGroupRef.current) {
        skillOrbsGroupRef.current.rotation.y += 0.7 * delta;
      }

      // Drift Clouds
      if (cloudsGroupRef.current) {
        cloudsGroupRef.current.children.forEach((cloud, i) => {
          cloud.position.x += (0.5 + (i % 3) * 0.3) * delta;
          if (cloud.position.x > 50) cloud.position.x = -50;
        });
      }

      // Rotate Waypoint Diamonds & Rings
      waypointMeshesRef.current.forEach(({ mesh }, index) => {
        const diamond = mesh.children[2];
        if (diamond) {
          diamond.rotation.y += 1.5 * delta;
          diamond.position.y = 4.5 + Math.sin(elapsedTime * 2.5 + index) * 0.35;
        }
        const ring = mesh.children[0];
        if (ring) {
          const scale = 1 + Math.sin(elapsedTime * 3 + index) * 0.15;
          ring.scale.set(scale, scale, 1);
        }
      });

      // Rotate Star Crystals
      crystalsRef.current.forEach((crystal, idx) => {
        if (crystal.visible) {
          crystal.rotation.y += 2.0 * delta;
          crystal.rotation.x += 1.0 * delta;
          crystal.position.y += Math.sin(elapsedTime * 3 + idx) * 0.005;
        }
      });

      // Animate Carrier Pigeon and Shopping Cart at Balcony
      if (carrierPigeonRef.current) {
        carrierPigeonRef.current.position.y = 1.2 + Math.sin(elapsedTime * 2.8) * 0.12;
        carrierPigeonRef.current.rotation.y = Math.sin(elapsedTime * 1.5) * 0.2;
        const lWing = carrierPigeonRef.current.children[4];
        const rWing = carrierPigeonRef.current.children[5];
        if (lWing && rWing) {
          lWing.rotation.z = Math.sin(elapsedTime * 8) * 0.35;
          rWing.rotation.z = -Math.sin(elapsedTime * 8) * 0.35;
        }
      }
      if (shoppingCartRef.current) {
        shoppingCartRef.current.position.y = 0.5 + Math.sin(elapsedTime * 2.2) * 0.06;
        shoppingCartRef.current.rotation.y += 0.5 * delta;
      }

      // Rotate XP Orbs
      xpOrbsRef.current.forEach(({ mesh, collected }) => {
        if (!collected) {
          mesh.rotation.y += 3.0 * delta;
          mesh.position.y += Math.sin(elapsedTime * 4) * 0.003;
        }
      });

      // ─── 2. CHARACTER MOVEMENT & CONTROLLER PHYSICS ──────────────────────
      const keys = keysPressed.current;
      let moveX = 0;
      let moveZ = 0;

      if (keys['w'] || keys['W'] || keys['ArrowUp']) moveZ -= 1;
      if (keys['s'] || keys['S'] || keys['ArrowDown']) moveZ += 1;
      if (keys['a'] || keys['A'] || keys['ArrowLeft']) moveX -= 1;
      if (keys['d'] || keys['D'] || keys['ArrowRight']) moveX += 1;

      const isMoving = moveX !== 0 || moveZ !== 0 || charTargetWalk.current !== null;

      if (!isGliding.current) {
        const speed = (keys['Shift'] || keys['shift']) ? 10 : 6;

        if (charTargetWalk.current) {
          const distToTarget = charPosition.current.distanceTo(charTargetWalk.current);
          if (distToTarget > 0.4) {
            const dir = new THREE.Vector3().subVectors(charTargetWalk.current, charPosition.current).normalize();
            charPosition.current.x += dir.x * speed * delta;
            charPosition.current.z += dir.z * speed * delta;
            // Face target
            const angle = Math.atan2(dir.x, dir.z);
            if (characterRef.current) characterRef.current.rotation.y = angle;
          } else {
            charTargetWalk.current = null;
          }
        } else if (moveX !== 0 || moveZ !== 0) {
          // Calculate movement direction relative to Camera orientation
          const camForward = new THREE.Vector3();
          camera.getWorldDirection(camForward);
          camForward.y = 0;
          camForward.normalize();

          const camRight = new THREE.Vector3();
          camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

          const moveDir = new THREE.Vector3()
            .addScaledVector(camForward, -moveZ)
            .addScaledVector(camRight, moveX)
            .normalize();

          charPosition.current.x += moveDir.x * speed * delta;
          charPosition.current.z += moveDir.z * speed * delta;

          // Face moving direction
          const targetAngle = Math.atan2(moveDir.x, moveDir.z);
          if (characterRef.current) {
            characterRef.current.rotation.y = targetAngle;
          }
        }

        // Calculate dynamic ground elevation for character's current position (ground surface only)
        const islandGroundLevel = getIslandGroundHeight(charPosition.current.x, charPosition.current.z);
        // Strictly stick to island ground elevation - prevents character from walking onto rooftops or props
        const targetGroundY = islandGroundLevel;

        // Jump physics
        if ((keys[' '] || keys['Space']) && isGrounded.current) {
          charVelocity.current.y = 8.5;
          isGrounded.current = false;
          soundManager.playJumpSound();
        }

        // Apply gravity & vertical position
        if (!isGrounded.current) {
          charVelocity.current.y -= 24 * delta;
          charPosition.current.y += charVelocity.current.y * delta;
          if (charPosition.current.y <= targetGroundY) {
            charPosition.current.y = targetGroundY;
            charVelocity.current.y = 0;
            isGrounded.current = true;
          }
        } else {
          // Smooth terrain climbing / stepping up to higher island terrain (Prevent clipping underground)
          if (charPosition.current.y < targetGroundY) {
            // Pop directly up onto ground surface if underground
            charPosition.current.y = targetGroundY;
          } else if (charPosition.current.y > targetGroundY + 0.15) {
            // Smoothly lerp down if stepping off higher ledge
            charPosition.current.y = THREE.MathUtils.lerp(charPosition.current.y, targetGroundY, 0.3);
          } else {
            charPosition.current.y = targetGroundY;
          }
        }

        // Character limbs & body animation (Walking & Idle Breathing)
        if (characterRef.current) {
          if (customMixerRef.current) {
            // Embedded GLTF animations (Mixamo / Poly Pizza / custom rigs)
            customMixerRef.current.update(delta);
            if (customWalkActionRef.current && customIdleActionRef.current) {
              if (isMoving) {
                if (!customWalkActionRef.current.isRunning()) {
                  customIdleActionRef.current.fadeOut(0.2);
                  customWalkActionRef.current.reset().fadeIn(0.2).play();
                }
              } else {
                if (!customIdleActionRef.current.isRunning()) {
                  customWalkActionRef.current.fadeOut(0.2);
                  customIdleActionRef.current.reset().fadeIn(0.2).play();
                }
              }
            }
            if (isMoving && elapsedTime - lastFootstepTime.current > 0.32) {
              soundManager.playFootstepSound();
              lastFootstepTime.current = elapsedTime;
            }
          } else if (customModelGroupRef.current) {
            // Static GLB model: apply natural walking tilt, bob & idle breathing
            const currentSettings = modelSettingsRef.current;
            if (isMoving) {
              walkCycle += delta * speed * 1.6;
              customModelGroupRef.current.position.y =
                (currentSettings.yOffset || 0) + Math.abs(Math.sin(walkCycle * 2)) * 0.08;
              customModelGroupRef.current.rotation.z = Math.sin(walkCycle) * 0.04;
              if (elapsedTime - lastFootstepTime.current > 0.32) {
                soundManager.playFootstepSound();
                lastFootstepTime.current = elapsedTime;
              }
            } else {
              customModelGroupRef.current.position.y =
                (currentSettings.yOffset || 0) + Math.sin(elapsedTime * 2.2) * 0.02;
              customModelGroupRef.current.rotation.z = 0;
            }
          } else if (proceduralBodyGroupRef.current?.visible !== false) {
            // Procedural default character animation
            if (isMoving) {
              walkCycle += delta * speed * 1.6;
              if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(walkCycle) * 0.55;
              if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(walkCycle) * 0.55;
              if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(walkCycle) * 0.45;
              if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(walkCycle) * 0.45;

              // Subtle body bounce & head lean when walking
              if (charHeadRef.current) {
                charHeadRef.current.position.y = 2.42 + Math.abs(Math.sin(walkCycle * 2)) * 0.04;
                charHeadRef.current.rotation.z = Math.sin(walkCycle) * 0.03;
              }
              if (charPonytailRef.current) {
                charPonytailRef.current.rotation.x = -0.35 + Math.sin(walkCycle) * 0.15;
              }

              // Play footstep sounds
              if (elapsedTime - lastFootstepTime.current > 0.32) {
                soundManager.playFootstepSound();
                lastFootstepTime.current = elapsedTime;
              }
            } else {
              // Idle breathing & gentle hair breeze
              const breathe = Math.sin(elapsedTime * 2.2);
              if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
              if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
              if (leftArmRef.current) {
                leftArmRef.current.rotation.x = 0;
                leftArmRef.current.rotation.z = -0.06 + breathe * 0.02;
              }
              if (rightArmRef.current) {
                rightArmRef.current.rotation.x = 0;
                rightArmRef.current.rotation.z = 0.06 - breathe * 0.02;
              }
              if (charHeadRef.current) {
                charHeadRef.current.position.y = 2.42 + breathe * 0.015;
                charHeadRef.current.rotation.y = Math.sin(elapsedTime * 0.7) * 0.08;
              }
              if (charPonytailRef.current) {
                charPonytailRef.current.rotation.x = -0.28 + Math.sin(elapsedTime * 1.8) * 0.05;
              }
            }
          }

          characterRef.current.position.copy(charPosition.current);
        }

        // Camera smoothly follows player
        if (cameraRef.current) {
          const desiredCamPos = charPosition.current.clone().add(cameraOffset.current);
          if (!isDragging.current) {
            cameraRef.current.position.lerp(desiredCamPos, 0.08);
            cameraTarget.current.lerp(charPosition.current.clone().add(new THREE.Vector3(0, 1.2, 0)), 0.08);
            cameraRef.current.lookAt(cameraTarget.current);
          } else {
            cameraRef.current.position.copy(desiredCamPos);
            cameraRef.current.lookAt(charPosition.current.clone().add(new THREE.Vector3(0, 1.2, 0)));
          }
        }
      }

      // ─── 3. COLLISION / PROXIMITY CHECK (XP ORBS & CRYSTALS) ───────────────
      // Golden XP Orbs
      xpOrbsRef.current.forEach((orbObj) => {
        if (!orbObj.collected) {
          const dist = charPosition.current.distanceTo(orbObj.mesh.position);
          if (dist < 1.8) {
            orbObj.collected = true;
            orbObj.mesh.visible = false;
            soundManager.playCoinSound();
            onGainXP(50);
          }
        }
      });

      // Star Crystals (Guaranteed Single Collection Trigger)
      crystalsRef.current.forEach((crystal, idx) => {
        if (crystal.visible && !collectedCrystalsRef.current[idx]) {
          const dist = charPosition.current.distanceTo(crystal.position);
          if (dist < 2.5) {
            crystal.visible = false;
            collectedCrystalsRef.current[idx] = true;
            onCollectCrystal(idx);
            soundManager.playLevelUpSound();
          }
        }
      });

      // Check proximity to landmarks for in-game [E] Interact HUD
      const LANDMARK_RADIUS = 5.0;
      let nearestLandmark: { sectionKey: SectionKey; title: string } | null = null;
      for (const wp of WAYPOINTS) {
        const wpPos = new THREE.Vector3(wp.position[0], wp.position[1], wp.position[2]);
        if (charPosition.current.distanceTo(wpPos) < LANDMARK_RADIUS) {
          nearestLandmark = { sectionKey: wp.sectionKey, title: wp.title };
          break;
        }
      }
      onProximityChange(nearestLandmark);

      // ─── 4. PROJECT 3D WAYPOINTS TO EXACT 2D SCREEN COORDINATES ────────────
      if (cameraRef.current && mountRef.current) {
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;

        const projectedList: ProjectedWaypoint[] = WAYPOINTS.map((wp) => {
          tempProjVec.set(wp.position[0], wp.position[1] + 3.2, wp.position[2]);
          tempProjVec.project(cameraRef.current!);

          const x = (tempProjVec.x * 0.5 + 0.5) * w;
          const y = (-tempProjVec.y * 0.5 + 0.5) * h;
          const visible = tempProjVec.z < 1.0;
          const distance = cameraRef.current!.position.distanceTo(
            new THREE.Vector3(wp.position[0], wp.position[1], wp.position[2])
          );

          return {
            id: wp.id,
            number: wp.number,
            title: wp.title,
            subtitle: wp.subtitle,
            iconName: wp.iconName,
            sectionKey: wp.sectionKey,
            color: wp.color,
            x,
            y,
            visible,
            distance,
          };
        });

        onUpdateProjectedWaypoints(projectedList);
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // 14. Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('character-model-updated', onModelUpdated);
      window.removeEventListener('character-model-reset', onModelReset);
      window.removeEventListener('character-settings-updated', onSettingsUpdated);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
      }
      renderer.dispose();
    };
  }, [isDarkMode]);

  // Fast Travel / Glide character to target section island
  const glideToSection = useCallback((section: SectionKey) => {
    if (!characterRef.current || !cameraRef.current) return;

    soundManager.playTeleportSound();
    isGliding.current = true;

    let targetLandPos = new THREE.Vector3(0, 4.5, 11);
    if (section !== 'home') {
      const wp = WAYPOINTS.find((w) => w.sectionKey === section);
      if (wp) {
        const groundHeight = getIslandGroundHeight(wp.position[0], wp.position[2]);
        targetLandPos.set(wp.position[0], groundHeight, wp.position[2] + 1.5);
      }
    }

    // High arc celestial glide
    const midPoint = new THREE.Vector3(
      (charPosition.current.x + targetLandPos.x) / 2,
      Math.max(charPosition.current.y, targetLandPos.y) + 7,
      (charPosition.current.z + targetLandPos.z) / 2
    );

    gsap.timeline({
      onComplete: () => {
        isGliding.current = false;
        charPosition.current.copy(targetLandPos);
      },
    })
      .to(charPosition.current, {
        x: midPoint.x,
        y: midPoint.y,
        z: midPoint.z,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          if (characterRef.current) {
            characterRef.current.position.copy(charPosition.current);
          }
        },
      })
      .to(charPosition.current, {
        x: targetLandPos.x,
        y: targetLandPos.y,
        z: targetLandPos.z,
        duration: 0.9,
        ease: 'power2.in',
        onUpdate: () => {
          if (characterRef.current) {
            characterRef.current.position.copy(charPosition.current);
          }
        },
      });

    // Camera accompanies flight
    gsap.to(cameraOffset.current, {
      x: 0,
      y: 6,
      z: 10,
      duration: 1.8,
      ease: 'power2.inOut',
    });
  }, []);

  useEffect(() => {
    glideToSection(activeSection);
  }, [activeSection, glideToSection]);

  // Click / Tap on terrain to move or interact
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragDistance.current = 0;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !cameraRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    dragDistance.current += Math.hypot(deltaX, deltaY);

    // Orbit camera angle smoothly around the character
    const angleX = deltaX * 0.007;
    cameraOffset.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), -angleX);
    cameraOffset.current.y = Math.max(1.8, Math.min(22, cameraOffset.current.y + deltaY * 0.04));

    // Instantly update camera position during drag so the 3D world rotates in real-time!
    const targetCamPos = charPosition.current.clone().add(cameraOffset.current);
    cameraRef.current.position.copy(targetCamPos);
    cameraRef.current.lookAt(charPosition.current.clone().add(new THREE.Vector3(0, 1.2, 0)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;

    // If user dragged to rotate the camera/world, do NOT walk the character or trigger clicks!
    if (dragDistance.current > 6) {
      return;
    }

    // Raycast on click
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Check click on Star Crystals
    const crystalIntersects = raycaster.intersectObjects(crystalsRef.current);
    if (crystalIntersects.length > 0) {
      const hit = crystalIntersects[0].object as THREE.Mesh;
      const crystalIdx = parseInt(hit.name.replace('crystal-', ''), 10);
      if (!isNaN(crystalIdx) && !collectedCrystalsRef.current[crystalIdx]) {
        hit.visible = false;
        collectedCrystalsRef.current[crystalIdx] = true;
        onCollectCrystal(crystalIdx);
        soundManager.playLevelUpSound();
        return;
      }
    }

    // Check click on 3D Carrier Pigeon or Shopping Cart at Balcony
    const shopClickables: THREE.Object3D[] = [];
    if (carrierPigeonRef.current) shopClickables.push(carrierPigeonRef.current);
    if (shoppingCartRef.current) shopClickables.push(shoppingCartRef.current);
    const shopIntersects = raycaster.intersectObjects(shopClickables, true);
    if (shopIntersects.length > 0) {
      const contactWp = WAYPOINTS.find((w) => w.sectionKey === 'contact');
      if (contactWp) {
        soundManager.playChimeSound();
        onSelectWaypoint(contactWp);
        return;
      }
    }

    // Check click on Waypoints
    const clickableObjects = waypointMeshesRef.current.map((item) => item.mesh);
    const wpIntersects = raycaster.intersectObjects(clickableObjects, true);
    if (wpIntersects.length > 0) {
      let currentObj: THREE.Object3D | null = wpIntersects[0].object;
      while (currentObj && currentObj.parent !== sceneRef.current) {
        currentObj = currentObj.parent;
      }
      const matched = waypointMeshesRef.current.find((item) => item.mesh === currentObj);
      if (matched) {
        soundManager.playChimeSound();
        onSelectWaypoint(matched.waypoint);
        return;
      }
    }

    // Click on terrain ground to Walk Character there!
    const allMeshes = sceneRef.current.children.filter((c) => c !== characterRef.current);
    const groundIntersects = raycaster.intersectObjects(allMeshes, true);
    if (groundIntersects.length > 0) {
      const hitPoint = groundIntersects[0].point;
      if (hitPoint.y > -2) {
        charTargetWalk.current = new THREE.Vector3(hitPoint.x, hitPoint.y + 0.2, hitPoint.z);
        soundManager.playFootstepSound();
      }
    }
  };

  // Zoom with scroll wheel
  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY * 0.01;
    cameraOffset.current.multiplyScalar(1 + zoomFactor * 0.1);
    cameraOffset.current.clampLength(4, 30);
  };

  return (
    <div
      ref={mountRef}
      id="three-canvas-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden touch-none"
    />
  );
};
