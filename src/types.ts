export type SectionKey = 'home' | 'about' | 'projects' | 'skills' | 'journal' | 'contact';

export interface Waypoint {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  iconName: string;
  position: [number, number, number]; // 3D coordinates in Three.js scene
  sectionKey: SectionKey;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  tagline: string;
  taglineEn?: string;
  description: string;
  descriptionEn?: string;
  role: string;
  roleEn?: string;
  year: string;
  category: string;
  categoryEn?: string;
  tags: string[];
  metrics: string;
  metricsEn?: string;
  previewColor: string;
  demoUrl?: string;
  githubUrl?: string;
  features: string[];
  featuresEn?: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    icon: string;
    xp: string;
    highlight?: boolean;
  }[];
}

export interface JournalPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  content: string;
  likes: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  color: string;
}

export interface ProjectedWaypoint {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  iconName: string;
  sectionKey: SectionKey;
  color: string;
  x: number;
  y: number;
  visible: boolean;
  distance: number;
}

export interface PlayerState {
  x: number;
  y: number;
  z: number;
  currentIsland: string;
  isMoving: boolean;
  xp: number;
  level: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  source?: 'gemini' | 'offline-companion';
}

// Constellation Star for Skills Island
export interface ConstellationStar {
  id: string;
  name: string;
  category: 'Frontend Core' | '3D & Shader Magic' | 'Game Engine & Physics' | 'Design & Creative';
  level: number; // 0 - 100
  x: number; // SVG / Canvas percentage 0 - 100
  y: number; // SVG / Canvas percentage 0 - 100
  color: string;
  connections: string[]; // IDs of stars connected with glowing celestial lines
  description: string;
  xp: string;
  icon: string;
}

// Treasure Map Milestone for Journal Island
export interface ExpeditionMilestone {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  x: number; // Map position percentage
  y: number; // Map position percentage
  type: 'port' | 'ruins' | 'kraken' | 'treasure' | 'observatory';
  description: string;
  rewards: string[];
  devlogPostId?: string;
  unlocked: boolean;
}

// Inventory Item for About Me Island Drag & Drop
export interface BackpackItem {
  id: string;
  name: string;
  category: 'Gear' | 'Potion' | 'Artifact';
  icon: string;
  description: string;
  statBonus: string;
  inBackpack: boolean;
}

export interface ShowcaseSlide {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  category: string;
  categoryEn: string;
  tags: string[];
  imageSrc: string;
  contributions: string[];
  contributionsEn: string[];
  metrics?: string;
  metricsEn?: string;
  filterGroup: 'all' | 'landing' | 'chatbot' | 'dashboard' | 'game' | 'metaverse' | 'core';
  isOriginalUpload?: boolean;
}
