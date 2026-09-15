import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  Eye,
  Sparkles,
  Layers,
  Terminal,
  Shield,
  RefreshCw,
  ExternalLink,
  Globe,
  Trophy,
  Swords,
  Bot,
  MapPin,
  Radio,
  Users,
  CheckCircle2,
  Sliders,
  Palette,
  Coins,
  Flame,
  ArrowUpRight,
  Info,
  X,
  Smartphone,
  Monitor,
  Upload,
  Image as ImageIcon,
  Trash2,
  FolderUp,
  HelpCircle,
  UploadCloud
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { Project } from '../../types';
import {
  saveProjectScreenshots,
  loadProjectScreenshots,
  deleteProjectScreenshots
} from '../../utils/screenshotStorage';

// Production Project Slides for Ortho Fashion (Direct Image Backgrounds)
import orthoSlide1 from '../../assets/images/ortho/ortho_slide_1.jpg';
import orthoSlide2 from '../../assets/images/ortho/ortho_slide_2.svg';
import orthoSlide3 from '../../assets/images/ortho/ortho_slide_3.svg';
import orthoSlide4 from '../../assets/images/ortho/ortho_slide_4.svg';
import orthoSlide5 from '../../assets/images/ortho/ortho_slide_5.svg';
import orthoSlide6 from '../../assets/images/ortho/ortho_slide_6.svg';
import orthoSlide7 from '../../assets/images/ortho/ortho_slide_7.svg';
import orthoSlide8 from '../../assets/images/ortho/ortho_slide_8.svg';
import orthoSlide9 from '../../assets/images/ortho/ortho_slide_9.svg';
import orthoSlide10 from '../../assets/images/ortho/ortho_slide_10.svg';
import orthoSlide11 from '../../assets/images/ortho/ortho_slide_11.svg';
import orthoSlide12 from '../../assets/images/ortho/ortho_slide_12.svg';
import orthoSlide13 from '../../assets/images/ortho/ortho_slide_13.svg';

// Asset imports
import defaultShowcaseImg from '../../assets/images/stream_showcase_1788945642068.jpg';

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

interface ProjectShowroomMonitorProps {
  project: Project;
  language: 'vi' | 'en';
  t: (vi: string, en: string) => string;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onSwitchToLiveWeb?: () => void;
  onSwitchToStudio?: () => void;
  hasLiveWeb?: boolean;
}

export const ProjectShowroomMonitor: React.FC<ProjectShowroomMonitorProps> = ({
  project,
  language,
  t,
  isMaximized,
  onToggleMaximize,
  onSwitchToLiveWeb,
  onSwitchToStudio,
  hasLiveWeb = false,
}) => {
  // Navigation & playback state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'slides' | 'catalog'>('slides');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);

  // Drag & Touch Swipe states for Smooth Carousel
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  // Drag & Drop files and custom upload states
  const [isDragOverFile, setIsDragOverFile] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [showUploadGuideModal, setShowUploadGuideModal] = useState(false);

  // User-uploaded original screenshots state (stored in IndexedDB with localStorage fallback)
  const [customScreenshots, setCustomScreenshots] = useState<Record<string, Array<ShowcaseSlide>>>(() => {
    try {
      const saved = localStorage.getItem('ortho_custom_project_screenshots');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load persisted screenshots from IndexedDB on component mount & project change
  useEffect(() => {
    let isMounted = true;
    loadProjectScreenshots(project.id).then((saved) => {
      if (isMounted && saved && saved.length > 0) {
        setCustomScreenshots((prev) => ({
          ...prev,
          [project.id]: saved,
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [project.id]);

  // Auto-play timer
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  // Build slides for current project
  const slides: ShowcaseSlide[] = React.useMemo(() => {
    if (project.id === 'ortho-fashion') {
      const defaultOrthoSlides: ShowcaseSlide[] = [
        {
          id: 'ortho-society-landing',
          title: 'Ortho Onchain Society — Aeaea Vision & The Concepts',
          titleEn: 'Ortho Onchain Society — Aeaea Vision & The Concepts',
          subtitle: 'Trang chủ Web3 và lý thuyết nền tảng: Twin, DAIO, $AIAI và tầm nhìn xã hội AI Agent Onchain',
          subtitleEn: 'Web3 homepage & foundational concepts: Twin, DAIO, $AIAI & Onchain AI Agent Society vision',
          category: 'Web3 & Landing Page',
          categoryEn: 'Web3 & Landing Page',
          tags: ['React.js', 'Web3 Society', 'TypeScript', 'Tailwind CSS', 'Digital Twin'],
          imageSrc: orthoSlide1,
          filterGroup: 'landing',
          metrics: 'Onchain Society • DAIO • $AIAI Token',
          metricsEn: 'Onchain Society • DAIO • $AIAI Token',
          contributions: [
            'Thiết kế giao diện Dark Luxury Landing Page giới thiệu tầm nhìn và triết lý The First AI Agent Society Onchain.',
            'Trình bày các khái niệm cốt lõi: Digital Twin (đại diện số), DAIO (tổ chức trí tuệ phi tập trung) và đồng $AIAI.',
            'Tối ưu hóa bố cục typography song ngữ, độ tương phản và hoạt ảnh chuyển cảnh cao cấp.'
          ],
          contributionsEn: [
            'Engineered Dark Luxury Landing Page introducing the vision and philosophy of The First AI Agent Society Onchain.',
            'Architected presentations for core concepts: Digital Twin, DAIO, and $AIAI native token.',
            'Optimized bilingual typography, contrast ratios, and sleek transition cues.'
          ]
        },
        {
          id: 'ortho-idol-jisoo',
          title: 'AI Idol Jisoo Companion — Interactive Chatbot & Live Telemetry',
          titleEn: 'AI Idol Jisoo Companion — Interactive Chatbot & Live Telemetry',
          subtitle: 'Hệ thống Idol AI tương tác cao với chỉ số RPG thời gian thực (Vocal, Dance, Visual, Fame, Affection) và 30 FPS Stream',
          subtitleEn: 'High-interaction AI Idol companion with realtime RPG telemetry and 30 FPS live chat stream',
          category: 'AI Persona Chatbot',
          categoryEn: 'AI Persona Chatbot',
          tags: ['React.js', 'AI Chatbot', 'RPG Stats', 'Emotion Engine', '30 FPS Stream'],
          imageSrc: orthoSlide2,
          filterGroup: 'chatbot',
          metrics: 'Affection 80/100 • Credits 5,000 • Vocal 20 • Fame 17',
          metricsEn: 'Affection 80/100 • Credits 5,000 • Vocal 20 • Fame 17',
          contributions: [
            'Xây dựng giao diện trò chuyện Idol AI với avatar nhân vật Jisoo và thanh trạng thái cảm xúc.',
            'Thiết kế bảng hiển thị chỉ số RPG: Vocal (20), Dance (9), Visual (17), Fame (17), Affection (80/100).',
            'Tích hợp các nút chức năng Create Image, Video, Music, Starter Pack và bộ sưu tập 12 vật phẩm.',
            'Xây dựng luồng hội thoại Producer – Jisoo thời gian thực với chỉ báo 30 FPS Stream.'
          ],
          contributionsEn: [
            'Engineered AI Idol chat interface featuring Jisoo avatar and real-time affection state machines.',
            'Designed RPG telemetry panel: Vocal (20), Dance (9), Visual (17), Fame (17), Affection (80/100).',
            'Integrated Create Image, Video, Music, and Starter Pack buttons with 12-item wardrobe collection.',
            'Implemented responsive Producer – Jisoo dialogue stream with 30 FPS telemetry monitor.'
          ]
        },
        {
          id: 'ortho-aeaea-mobile',
          title: 'Aeaea Mobile Web Atelier — 3D Cyber Mech & Avatar Entrance',
          titleEn: 'Aeaea Mobile Web Atelier — 3D Cyber Mech & Avatar Entrance',
          subtitle: 'Giao diện Mobile Web Atelier (aeaea.xyz) với logo Chrome 3D kim loại lỏng và Mech Suit Avatar',
          subtitleEn: 'Mobile Web Atelier UI (aeaea.xyz) featuring 3D liquid chrome branding and Mech Suit Avatar',
          category: 'Mobile Web3 UI',
          categoryEn: 'Mobile Web3 UI',
          tags: ['Mobile UI', 'Responsive Design', '3D Branding', 'Touch Controls', 'Web3'],
          imageSrc: orthoSlide3,
          filterGroup: 'landing',
          metrics: 'aeaea.xyz • Cyber Mech v3.2 • 19:58 Live View',
          metricsEn: 'aeaea.xyz • Cyber Mech v3.2 • 19:58 Live View',
          contributions: [
            'Thiết kế giao diện mobile-first tối ưu cho cổng truy cập aeaea.xyz trên thiết bị di động.',
            'Tích hợp visual 3D Cyber Mech kết hợp hiệu ứng kim loại lỏng liquid metal cho thương hiệu AEAEA.',
            'Tối ưu hóa thao tác chạm, nút CTA Enter Now và chỉ báo cuộn mượt mà.'
          ],
          contributionsEn: [
            'Crafted mobile-first viewport optimized for aeaea.xyz mobile browser access.',
            'Integrated 3D Cyber Mech visual paired with liquid metal chrome branding effects.',
            'Engineered fluid touch targets, Enter Now CTA, and responsive scroll indicators.'
          ]
        },
        {
          id: 'ortho-dashboard-twinmaster',
          title: 'AIAI TwinMaster & Rewards Dashboard — Top Earners Today',
          titleEn: 'AIAI TwinMaster & Rewards Dashboard — Top Earners Today',
          subtitle: 'Trung tâm quản lý số dư 259,225 $AIAI, Total Earnings 68,994 $AIAI và bảng xếp hạng Top Earners',
          subtitleEn: 'Management center for 259,225 $AIAI balance, 68,994 $AIAI total earnings, and Top Earners board',
          category: 'Web3 Analytics & Dashboard',
          categoryEn: 'Web3 Analytics & Dashboard',
          tags: ['React.js', 'Crypto Analytics', 'Staking Rewards', 'Tailwind CSS', 'Leaderboard'],
          imageSrc: orthoSlide4,
          filterGroup: 'dashboard',
          metrics: 'Total 68,994 $AIAI • Pool 49,973 $AIAI • Top #1 KENZEE2787',
          metricsEn: 'Total 68,994 $AIAI • Pool 49,973 $AIAI • Top #1 KENZEE2787',
          contributions: [
            'Phát triển bảng điều khiển tổng thể tài khoản người dùng (Welcome back, Hanh Phan!).',
            'Xây dựng các widget thống kê số liệu: Total Earnings 68,994 $AIAI, Total Spending -11,122 $AIAI và Cognitive Rating.',
            'Tạo bảng xếp hạng Top Earners Today thời gian thực (Kenzee2787, Agent Andy, Irmaaa, Degengirl, Cyber.pk).',
            'Tích hợp nút tạo Memecoin và quản lý địa chỉ ví Web3 (0x0c...E75e).'
          ],
          contributionsEn: [
            'Developed comprehensive user telemetry dashboard (Welcome back, Hanh Phan!).',
            'Engineered real-time stats cards: Total Earnings 68,994 $AIAI, Total Spending -11,122 $AIAI, and Cognitive Rating.',
            'Implemented live Top Earners Today leaderboard (Kenzee2787, Agent Andy, Irmaaa, Degengirl, Cyber.pk).',
            'Integrated Memecoin creation action and Web3 wallet address manager (0x0c...E75e).'
          ]
        },
        {
          id: 'ortho-marketplace-skills',
          title: 'AIAI Twin Skills Marketplace — Mobile Skill Store',
          titleEn: 'AIAI Twin Skills Marketplace — Mobile Skill Store',
          subtitle: 'Cửa hàng kỹ năng và tiện ích mở rộng cho AI Agent Twin: Meme Coin Creation, Conversation Lv3, SOTD',
          subtitleEn: 'Skill and capability upgrade store for AI Agent Twins: Meme Coin Creation, Conversation Lv3, SOTD',
          category: 'Marketplace & Skills',
          categoryEn: 'Marketplace & Skills',
          tags: ['Marketplace UI', 'Skill Upgrades', 'Mobile Store', 'Token Economy'],
          imageSrc: orthoSlide5,
          filterGroup: 'dashboard',
          metrics: 'Balance 4.521 AIAI • Meme Coin 100k • Equipped State',
          metricsEn: 'Balance 4.521 AIAI • Meme Coin 100k • Equipped State',
          contributions: [
            'Thiết kế sàn giao dịch kỹ năng chuyên biệt cho AI Agent Twin trên di động.',
            'Xây dựng các gói kỹ năng: Meme Coin Creation (100k $AIAI), Conversation Lv3 (50k $AIAI), Thread Creation (Equipped).',
            'Tích hợp số dư ví người dùng (4.521 AIAI), trạng thái mua/trang bị tức thì.'
          ],
          contributionsEn: [
            'Designed dedicated mobile capability marketplace for AI Agent Twins.',
            'Engineered skill packages: Meme Coin Creation (100k $AIAI), Conversation Lv3 (50k $AIAI), Thread Creation (Equipped).',
            'Integrated live user wallet balance (4.521 AIAI) and instant buy/equip status toggles.'
          ]
        },
        {
          id: 'ortho-potion-worldpool',
          title: 'Potion World Pool — AI Style Inventory & Prompt Library',
          titleEn: 'Potion World Pool — AI Style Inventory & Prompt Library',
          subtitle: 'Kho thư viện phong cách nghệ thuật AI Potion World Pool với thẻ tag và các preset Solitude, Pop Art',
          subtitleEn: 'Potion World Pool AI artistic style library with tags and presets: Solitude, Pop Art, Modern Cartoon',
          category: 'Generative AI & Studio',
          categoryEn: 'Generative AI & Studio',
          tags: ['Diffusion Presets', 'Style Library', 'World Pool', 'Card Grid'],
          imageSrc: orthoSlide6,
          filterGroup: 'chatbot',
          metrics: '6 Style Presets • Multi-tag Filtering • Wallet Connected',
          metricsEn: '6 Style Presets • Multi-tag Filtering • Wallet Connected',
          contributions: [
            'Xây dựng giao diện kho phong cách Potion World Pool trên cloud (potion-dev.asia-southeast1.run.app).',
            'Thiết kế hệ thống lọc đa thẻ tag (#digitalart, #abstract, #surreal, #cyberpunk, #portrait).',
            'Tạo card lưới hiển thị các phong cách nghệ thuật: Solitude Moodboard, Art Composition, Pop Art Portraits.'
          ],
          contributionsEn: [
            'Built Potion World Pool artistic style repository on cloud runtime.',
            'Engineered multi-tag filtering bar (#digitalart, #abstract, #surreal, #cyberpunk, #portrait).',
            'Created responsive card grid presenting art presets: Solitude Moodboard, Art Composition, Pop Art Portraits.'
          ]
        },
        {
          id: 'ortho-potion-spaw',
          title: 'Potion Spawwww — Pixel Neon Realism & AI Character Chat',
          titleEn: 'Potion Spawwww — Pixel Neon Realism & AI Character Chat',
          subtitle: 'Studio hội thoại và tạo ảnh chân dung anime phong cách Pixel Neon Realism hai cột',
          subtitleEn: 'Dual-panel studio for AI character conversation and Pixel Neon Realism portrait generation',
          category: 'Generative AI & Chat',
          categoryEn: 'Generative AI & Chat',
          tags: ['Persona Prompting', 'Split Screen', 'Image Generation', 'Anime Avatars'],
          imageSrc: orthoSlide7,
          filterGroup: 'chatbot',
          metrics: 'Pixel Neon Persona • Prompt Assistant • 6 Avatar Grid',
          metricsEn: 'Pixel Neon Persona • Prompt Assistant • 6 Avatar Grid',
          contributions: [
            'Xây dựng giao diện chia đôi (Split-view) giữa khung trò chuyện Persona và thư viện hình ảnh kết quả.',
            'Thiết kế Persona bot "Pixel Neon Realism" trả lời đối thoại đầy cá tính nghệ thuật.',
            'Tích hợp thanh nhập prompt thông minh với nút tạo ảnh generative tức thì.'
          ],
          contributionsEn: [
            'Constructed dual-panel split-view workspace combining Persona chat with generated media gallery.',
            'Designed "Pixel Neon Realism" persona dialogue with evocative cyberpunk styling.',
            'Integrated intelligent prompt entry with one-click generative triggering.'
          ]
        },
        {
          id: 'ortho-garden-elemental',
          title: 'AIGARDEN Elemental #1138 — Water Dragon Samurai Artwork',
          titleEn: 'AIGARDEN Elemental #1138 — Water Dragon Samurai Artwork',
          subtitle: 'Bài đăng tác phẩm nghệ thuật Samurai rồng nước và cộng đồng chia sẻ nghệ thuật AI trên AIGARDEN',
          subtitleEn: 'Showcase post for Water Dragon Samurai generative artwork on AIGARDEN creative community',
          category: 'Creative Community Feed',
          categoryEn: 'Creative Community Feed',
          tags: ['AIGARDEN', 'Generative Artwork', 'Samurai Aesthetic', 'Social Feed'],
          imageSrc: orthoSlide8,
          filterGroup: 'landing',
          metrics: 'Elemental #1138 • 142 Upvotes • Realtime Sharing',
          metricsEn: 'Elemental #1138 • 142 Upvotes • Realtime Sharing',
          contributions: [
            'Thiết kế card trưng bày tác phẩm số chất lượng cao Elemental #1138 với hiệu ứng ánh sáng bioluminescent.',
            'Xây dựng hệ thống tương tác cộng đồng: nút Upvote, Share, Copy Link và thời gian đăng tải.',
            'Tối ưu hóa khả năng hiển thị chi tiết tác phẩm hội họa kết hợp phong cách Nhật Bản truyền thống và AI.'
          ],
          contributionsEn: [
            'Designed high-fidelity artwork showcase card for Elemental #1138 with bioluminescent glow.',
            'Built community engagement features: Upvotes, Share, Copy Link, and timestamp badges.',
            'Optimized visual fidelity celebrating fusion of classical Japanese aesthetics and modern AI synthesis.'
          ]
        },
        {
          id: 'ortho-explore-feed',
          title: 'Explore Community Feed — AI Generated Bento Gallery',
          titleEn: 'Explore Community Feed — AI Generated Bento Gallery',
          subtitle: 'Bảng tin khám phá cộng đồng với bố cục Bento Grid đa chiều hiển thị các nhân vật AI độc đáo',
          subtitleEn: 'Community explore feed with multi-dimensional Bento Grid showcasing distinctive AI characters',
          category: 'Community & Bento UI',
          categoryEn: 'Community & Bento UI',
          tags: ['Bento Grid', 'Masonry Feed', 'Community Explore', 'Floating Dock'],
          imageSrc: orthoSlide9,
          filterGroup: 'landing',
          metrics: 'Bento Masonry • Floating Dock Nav • Multi-Character Feed',
          metricsEn: 'Bento Masonry • Floating Dock Nav • Multi-Character Feed',
          contributions: [
            'Xây dựng giao diện trang Khám phá (Explore Feed) với lưới Bento Grid trực quan và hiện đại.',
            'Tạo danh mục các nhân vật sáng tạo (Cyber Heroine, Street Boombox, Aqua Mage, Star Oracle).',
            'Thiết kế thanh điều hướng nổi (Floating Dock Navigation) ở cạnh đáy hỗ trợ chuyển trang mượt mà.'
          ],
          contributionsEn: [
            'Built modern Explore Feed layout utilizing an intuitive multi-column Bento Grid.',
            'Organized character collections (Cyber Heroine, Street Boombox, Aqua Mage, Star Oracle).',
            'Engineered sleek bottom Floating Dock navigation for fluid mobile and desktop routing.'
          ]
        },
        {
          id: 'ortho-lushtale-modal',
          title: 'Lush Tale Illustration Modal — Mythic Rarity & KAI Staking',
          titleEn: 'Lush Tale Illustration Modal — Mythic Rarity & KAI Staking',
          subtitle: 'Cửa sổ Modal phân loại độ hiếm Mythic, 4 ô tranh minh họa phong cảnh nước và tính năng Recycle 166,670 KAI',
          subtitleEn: 'Mythic rarity inspection modal with 4-quadrant landscape watercolor preview & 166,670 KAI Recycle action',
          category: 'Web3 NFT & Inventory',
          categoryEn: 'Web3 NFT & Inventory',
          tags: ['Modal Dialog', 'Mythic Rarity', 'KAI Staking', '4-Quadrant View'],
          imageSrc: orthoSlide10,
          filterGroup: 'dashboard',
          metrics: 'Mythic Rarity • 166,670 KAI Recycle • 0xbd63...412d Creator',
          metricsEn: 'Mythic Rarity • 166,670 KAI Recycle • 0xbd63...412d Creator',
          contributions: [
            'Phát triển hộp thoại Modal xem chi tiết phong cách nghệ thuật trên potion.kai.now.',
            'Thiết kế khung xem trước 4 góc (4-Quadrant Preview) minh họa phong cảnh nước watercolor kỳ ảo.',
            'Tích hợp các trường dữ liệu Web3: Độ hiếm Mythic, Daily Earnings, Usage Count và địa chỉ Creator.',
            'Xây dựng nút tương tác Recycle với giá trị 166,670 KAI và nút Sample phong cách.'
          ],
          contributionsEn: [
            'Engineered detailed art style inspection modal on potion.kai.now inventory tab.',
            'Constructed 4-quadrant preview canvas for whimsical watercolor landscape compositions.',
            'Integrated Web3 telemetry: Mythic rarity badge, Daily Earnings, Usage Count, and Creator wallet.',
            'Implemented 166,670 KAI Recycle economy button and Sample style trigger.'
          ]
        },
        {
          id: 'ortho-garden-fighter',
          title: 'AIGarden Fighter Arena — Azuki #1834 vs Elemental #10700',
          titleEn: 'AIGarden Fighter Arena — Azuki #1834 vs Elemental #10700',
          subtitle: 'Đấu trường đối kháng Match Setup giữa Azuki #1834 và Elemental #10700 với trọng tài AI quyết định',
          subtitleEn: 'Match Setup battle arena between Azuki #1834 and Elemental #10700 with autonomous AI referee',
          category: 'Game AI & Arena',
          categoryEn: 'Game AI & Arena',
          tags: ['Game UI', 'Betting Arena', 'AI Judge', 'Mobile Arena', 'Tug of War'],
          imageSrc: orthoSlide11,
          filterGroup: 'game',
          metrics: 'Azuki vs Elemental • Total Pool 20 $ANIME • Winner by AI',
          metricsEn: 'Azuki vs Elemental • Total Pool 20 $ANIME • Winner by AI',
          contributions: [
            'Thiết kế giao diện đối kháng Match Setup kịch tính giữa Azuki #1834 và Elemental #10700.',
            'Xây dựng nút cược Back Blue vs Back Red và thanh kéo co tỷ lệ đặt cược (Tug-of-war Bar).',
            'Tích hợp thông báo quy tắc "Winner is decided by AI" và quản lý tổng pool thưởng 20 $ANIME.'
          ],
          contributionsEn: [
            'Designed competitive Match Setup screen pitting Azuki #1834 against Elemental #10700.',
            'Constructed Back Blue vs Back Red betting controls and visual tug-of-war odds gauge.',
            'Integrated "Winner is decided by AI" rule badge and 20 $ANIME reward pool manager.'
          ]
        },
        {
          id: 'ortho-swarm-cybertown',
          title: '3D Swarm Cyber Town Map — Cherry Blossoms & Spatial Nodes',
          titleEn: '3D Swarm Cyber Town Map — Cherry Blossoms & Spatial Nodes',
          subtitle: 'Bản đồ không gian 3D làng công nghệ Cyber Town kết hợp hoa anh đào và hội thoại Swarm 3 General',
          subtitleEn: '3D spatial map of Cyber Town digital village with cherry blossoms and Swarm 3 General dialogue',
          category: '3D Metaverse & Spatial UI',
          categoryEn: '3D Metaverse & Spatial UI',
          tags: ['3D Map', 'Spatial UI', 'Cherry Blossoms', 'Swarm Nodes', 'Agent Dialogues'],
          imageSrc: orthoSlide12,
          filterGroup: 'metaverse',
          metrics: 'Active Nodes 1-6 • 80,347 $AIAI • Swarm 3 Dialogue',
          metricsEn: 'Active Nodes 1-6 • 80,347 $AIAI • Swarm 3 Dialogue',
          contributions: [
            'Xây dựng giao diện bản đồ không gian 3D thành phố số phong cách cyberpunk kết hợp hoa anh đào.',
            'Tạo hệ thống tọa độ Waypoint Nodes (Node #1 đến #6) và bong bóng hội thoại tương tác của Swarm General.',
            'Tích hợp thanh lệnh Style your reality và hiển thị số dư 80,347 $AIAI thời gian thực.'
          ],
          contributionsEn: [
            'Engineered 3D spatial map UI for cyberpunk digital village enriched with cherry blossoms.',
            'Constructed interactive Waypoint pins (Nodes #1 to #6) and Swarm General dialogue bubble.',
            'Integrated virtual reality styling command bar and live 80,347 $AIAI balance telemetry.'
          ]
        },
        {
          id: 'ortho-swarm-ecolabyrinth',
          title: '3D Swarm Ecological Labyrinth — Hedge Maze & Animal Agents',
          titleEn: '3D Swarm Ecological Labyrinth — Hedge Maze & Animal Agents',
          subtitle: 'Bản đồ không gian mê cung sinh thái ruộng bậc thang và các tọa độ định vị Agent sinh học',
          subtitleEn: '3D ecological hedge maze and terraced terrain spatial map with biological agent waypoints',
          category: '3D Metaverse & Spatial UI',
          categoryEn: '3D Metaverse & Spatial UI',
          tags: ['Ecological Maze', 'Spatial Coordinates', 'All Swarm Mode', 'Map Styling'],
          imageSrc: orthoSlide13,
          filterGroup: 'metaverse',
          metrics: 'Ecological Spatial Map • 8 Waypoint Coordinates • All Swarm Mode',
          metricsEn: 'Ecological Spatial Map • 8 Waypoint Coordinates • All Swarm Mode',
          contributions: [
            'Thiết kế giao diện bản đồ 3D mê cung sinh thái xanh với địa hình ruộng bậc thang và lối đi.',
            'Xây dựng lưới tọa độ không gian chính xác: Pin 1, 2, 4, 5, 6, Node AO, Node KT và Sector G.',
            'Tích hợp chế độ chuyển đổi All Swarm Mode và thanh thực thi lệnh bản đồ.'
          ],
          contributionsEn: [
            'Designed 3D ecological spatial map featuring hedge maze paths and agricultural terraced terrains.',
            'Constructed precise spatial coordinate pins: Pin 1, 2, 4, 5, 6, Node AO, Node KT, and Sector G.',
            'Integrated All Swarm Mode toggle and virtual map styling execution engine.'
          ]
        }
      ];

      const userCustom = customScreenshots[project.id];
      if (userCustom && userCustom.length > 0) {
        return userCustom;
      }
      return defaultOrthoSlides;
    }

    if (project.id === 'graduation-invitation') {
      return [
        {
          id: 'grad-hero',
          title: 'Graduation Invitation — Fullscreen Responsive Hero',
          titleEn: 'Graduation Invitation — Fullscreen Responsive Hero',
          subtitle: 'Giao diện thiệp mời tốt nghiệp với thiệp mở phong thư và hiệu ứng chúc mừng sinh động',
          subtitleEn: 'Graduation invitation web with interactive opening envelope and festive animations',
          category: 'Web & Creative',
          categoryEn: 'Web & Creative',
          tags: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Firebase Hosting', 'Responsive'],
          imageSrc: defaultShowcaseImg,
          filterGroup: 'core',
          metrics: 'Firebase Hosting • Responsive Mobile & Desktop • AI-assisted Dev',
          metricsEn: 'Firebase Hosting • Responsive Mobile & Desktop • AI-assisted Dev',
          contributions: [
            'Tự thiết kế và lập trình website thiệp mời tốt nghiệp cá nhân từ đầu.',
            'Sử dụng AI hỗ trợ viết code, sau đó trực tiếp chỉnh sửa, tối ưu và tùy biến chi tiết.',
            'Xây dựng giao diện responsive hoàn chỉnh trên cả màn hình desktop lẫn điện thoại thông minh.',
            'Deploy thực tế lên Firebase Hosting: https://minhthu-gradinvite.web.app/.'
          ],
          contributionsEn: [
            'Independently designed and built the personal graduation invitation website from scratch.',
            'Leveraged AI for initial code drafting, followed by deep manual refinement and styling.',
            'Built responsive layouts seamlessly supporting both mobile and desktop screens.',
            'Deployed live to production on Firebase Hosting: https://minhthu-gradinvite.web.app/.'
          ]
        },
        {
          id: 'grad-envelope',
          title: 'Interactive Envelope Opening & Schedule Timeline',
          titleEn: 'Interactive Envelope Opening & Schedule Timeline',
          subtitle: 'Hiệu ứng mở phong bao thiệp mời và dòng thời gian các mốc tốt nghiệp HCMUS',
          subtitleEn: 'Interactive envelope unfolding animation and HCMUS graduation timeline milestones',
          category: 'Interactive UI',
          categoryEn: 'Interactive UI',
          tags: ['CSS Animations', 'Timeline UI', 'Responsive Design'],
          imageSrc: defaultShowcaseImg,
          filterGroup: 'core',
          metrics: 'Envelope Animation • Event Timeline • RSVP',
          metricsEn: 'Envelope Animation • Event Timeline • RSVP',
          contributions: [
            'Thiết kế tương tác lật mở phong bao thư với hiệu ứng chuyển động CSS mượt mà.',
            'Trình bày timeline thời gian tổ chức lễ tốt nghiệp tại Trường ĐH Khoa học Tự nhiên ĐHQG-HCM.',
            'Tích hợp bản đồ hướng dẫn đường đi và form xác nhận tham dự (RSVP).'
          ],
          contributionsEn: [
            'Designed unfolding envelope interaction with smooth CSS transitions.',
            'Formatted HCMUS graduation ceremony schedule timeline.',
            'Integrated navigation directions and RSVP attendance confirmation.'
          ]
        }
      ];
    }

    if (project.id === 'virtual-tryon-ai') {
      return [
        {
          id: 'vton-catvton',
          title: 'CatVTON Architecture & Garment Warping Pipeline',
          titleEn: 'CatVTON Architecture & Garment Warping Pipeline',
          subtitle: 'Cải tiến mạng nơ-ron CatVTON giảm chi phí tính toán và giữ nguyên chi tiết trang phục',
          subtitleEn: 'Optimized CatVTON architecture reducing computational cost while preserving garment texture',
          category: 'Deep Learning & Thesis',
          categoryEn: 'Deep Learning & Thesis',
          tags: ['Python', 'PyTorch', 'CatVTON', 'Diffusion Models', 'Computer Vision'],
          imageSrc: defaultShowcaseImg,
          filterGroup: 'core',
          metrics: 'Optimized CatVTON • Reduced FLOPs • High Fidelity',
          metricsEn: 'Optimized CatVTON • Reduced FLOPs • High Fidelity',
          contributions: [
            'Nghiên cứu và tối ưu hóa kiến trúc CatVTON cho bài toán Thử đồ ảo (Virtual Try-On).',
            'Giảm thiểu chi phí tính toán GPU trong khi vẫn duy trì độ sắc nét của họa tiết quần áo.',
            'Thực nghiệm và so sánh trên hai bộ dữ liệu chuẩn quốc tế là VITON-HD và DressCode.'
          ],
          contributionsEn: [
            'Researched and optimized CatVTON architecture for Virtual Try-On synthesis.',
            'Reduced GPU computational costs while preserving realistic clothing fold textures.',
            'Benchmarked thoroughly against VITON-HD and DressCode datasets.'
          ]
        },
        {
          id: 'vton-color-editing',
          title: 'Text-Guided Garment Color Editing (NLP + DeepLabV3 + HSV)',
          titleEn: 'Text-Guided Garment Color Editing (NLP + DeepLabV3 + HSV)',
          subtitle: 'Phương pháp đổi màu trang phục bằng văn bản tự nhiên với phân đoạn DeepLabV3',
          subtitleEn: 'Text-guided garment color alteration using NLP color extraction & DeepLabV3 segmentation',
          category: 'Computer Vision & NLP',
          categoryEn: 'Computer Vision & NLP',
          tags: ['DeepLabV3', 'NLP', 'HSV Color Space', 'Segmentation'],
          imageSrc: defaultShowcaseImg,
          filterGroup: 'core',
          metrics: 'NLP Extraction • DeepLabV3 Masking • HSV Conversion',
          metricsEn: 'NLP Extraction • DeepLabV3 Masking • HSV Conversion',
          contributions: [
            'Đề xuất giải pháp trích xuất thuộc tính màu từ văn bản tự nhiên qua NLP.',
            'Phân đoạn chính xác vùng áo/quần bằng mô hình DeepLabV3 để tạo mặt nạ nhị phân.',
            'Biến đổi màu sắc trong không gian màu HSV nhằm bảo toàn nếp nhăn và ánh sáng tự nhiên.'
          ],
          contributionsEn: [
            'Proposed NLP color attribute extraction pipeline from natural language prompts.',
            'Accurately segmented garment regions using DeepLabV3 masks.',
            'Transformed hues within the HSV color space preserving authentic shadows and folds.'
          ]
        },
        {
          id: 'vton-metrics',
          title: 'Quantitative Benchmark Evaluation (SSIM, FID, LPIPS)',
          titleEn: 'Quantitative Benchmark Evaluation (SSIM, FID, LPIPS)',
          subtitle: 'Phân tích định lượng chất lượng hình ảnh tổng hợp và hiệu quả thời gian xử lý',
          subtitleEn: 'Quantitative image synthesis evaluation and processing speed benchmarks',
          category: 'Evaluation & Metrics',
          categoryEn: 'Evaluation & Metrics',
          tags: ['SSIM', 'FID', 'LPIPS', 'VITON-HD', 'DressCode'],
          imageSrc: defaultShowcaseImg,
          filterGroup: 'core',
          metrics: 'SSIM ↑ • FID ↓ • LPIPS ↓ • Thesis Defense HCMUS',
          metricsEn: 'SSIM ↑ • FID ↓ • LPIPS ↓ • Thesis Defense HCMUS',
          contributions: [
            'Đo lường chi tiết chỉ số SSIM (Structural Similarity) đánh giá độ tương đồng cấu trúc.',
            'Tính toán FID (Fréchet Inception Distance) và LPIPS để xác thực độ chân thực của ảnh.',
            'Báo cáo kết quả xuất sắc trước hội đồng Khóa luận tốt nghiệp Cử nhân Thị giác máy tính HCMUS.'
          ],
          contributionsEn: [
            'Measured SSIM metrics validating structure consistency against ground truth.',
            'Calculated FID and LPIPS scores validating generative visual realism.',
            'Presented thesis findings with distinction at HCMUS Computer Vision defense.'
          ]
        }
      ];
    }

    // Default slides for other projects
    return [
      {
        id: `${project.id}-slide-1`,
        title: project.title,
        titleEn: project.titleEn,
        subtitle: project.tagline,
        subtitleEn: project.taglineEn,
        category: project.category,
        categoryEn: project.categoryEn,
        tags: project.tags,
        imageSrc: defaultShowcaseImg,
        filterGroup: 'core',
        metrics: project.metrics,
        metricsEn: project.metricsEn,
        contributions: project.features.slice(0, 4),
        contributionsEn: project.featuresEn.slice(0, 4)
      },
      {
        id: `${project.id}-slide-2`,
        title: `${project.title} — Architecture & Technical Highlights`,
        titleEn: `${project.titleEn} — Architecture & Technical Highlights`,
        subtitle: project.description.slice(0, 140) + '...',
        subtitleEn: project.descriptionEn.slice(0, 140) + '...',
        category: 'Engineering Architecture',
        categoryEn: 'Engineering Architecture',
        tags: project.tags,
        imageSrc: defaultShowcaseImg,
        filterGroup: 'core',
        metrics: project.metrics,
        metricsEn: project.metricsEn,
        contributions: project.features.slice(2, 6),
        contributionsEn: project.featuresEn.slice(2, 6)
      }
    ];
  }, [project, customScreenshots]);

  // Process uploaded screenshot files (up to 13 high-res images)
  const processUploadedFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setIsProcessingFiles(true);

    try {
      // Sort files naturally by name (so ortho_slide_1..13 or timestamps stay in logical order)
      fileArray.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      // Read all files as Data URLs in parallel
      const readResults = await Promise.all(
        fileArray.map((file, idx) => {
          return new Promise<{ name: string; dataUrl: string; index: number }>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                name: file.name,
                dataUrl: (event.target?.result as string) || '',
                index: idx,
              });
            };
            reader.onerror = () => {
              resolve({ name: file.name, dataUrl: '', index: idx });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const validResults = readResults.filter((r) => r.dataUrl.length > 0);
      if (validResults.length === 0) {
        setIsProcessingFiles(false);
        return;
      }

      // Map each uploaded photo to corresponding slide template
      const newSlides: ShowcaseSlide[] = validResults.map((item, idx) => {
        const template = slides[idx % slides.length];
        return {
          id: `user-ortho-${Date.now()}-${idx}`,
          title: template ? template.title : item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          titleEn: template ? template.titleEn : item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          subtitle: template ? template.subtitle : (language === 'vi' ? 'Ảnh chụp màn hình thực tế từ dự án của bạn' : 'Original production project screenshot'),
          subtitleEn: template ? template.subtitleEn : 'Original production project screenshot',
          category: template ? template.category : (language === 'vi' ? 'Ảnh Thực Tế' : 'Production UI'),
          categoryEn: template ? template.categoryEn : 'Production UI',
          tags: template ? template.tags : ['Original Screenshot', 'Production UI', 'Ortho Fashion'],
          imageSrc: item.dataUrl,
          filterGroup: template ? template.filterGroup : 'core',
          isOriginalUpload: true,
          metrics: template ? template.metrics : (language === 'vi' ? 'Ảnh Thực Tế • Độ Phân Giải Cao' : 'Production Screenshot • HD'),
          metricsEn: template ? template.metricsEn : 'Production Screenshot • HD',
          contributions: template ? template.contributions : [
            'Ảnh chụp màn hình thực tế từ sản phẩm thực tế của dự án.',
            'Giao diện trực tiếp do tác giả tham gia phát triển và triển khai.'
          ],
          contributionsEn: template ? template.contributionsEn : [
            'Real production screenshot from the actual project.',
            'User interface engineered and deployed by author.'
          ]
        };
      });

      setCustomScreenshots((prev) => ({
        ...prev,
        [project.id]: newSlides,
      }));

      // Persist to IndexedDB for large high-res screenshot storage
      await saveProjectScreenshots(project.id, newSlides);

      setCurrentSlideIndex(0);
      soundManager.playLevelUpSound();
    } catch (err) {
      console.error('Error processing uploaded files:', err);
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const handleClearCustomScreenshots = async () => {
    soundManager.playClickSound();
    setCustomScreenshots((prev) => {
      const updated = { ...prev };
      delete updated[project.id];
      return updated;
    });
    await deleteProjectScreenshots(project.id);
    try {
      localStorage.removeItem('ortho_custom_project_screenshots');
    } catch {}
    setCurrentSlideIndex(0);
  };

  // Drag & drop handlers for file upload directly into slide area
  const handleFileDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOverFile(true);
    }
  };

  const handleFileDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFiles(e.dataTransfer.files);
    }
  };

  // Filtered slides for catalog view
  const filteredSlides = React.useMemo(() => {
    if (selectedFilter === 'all') return slides;
    return slides.filter((s) => s.filterGroup === selectedFilter);
  }, [slides, selectedFilter]);

  // Current active slide
  const activeSlide = slides[currentSlideIndex] || slides[0];

  // Auto-play timer effect
  useEffect(() => {
    if (!isPlaying || isHovered || slides.length <= 1) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, 4500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, isHovered, slides.length]);

  // Reset index when project changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setProgressKey((k) => k + 1);
  }, [project.id]);

  const handleNextSlide = () => {
    soundManager.playClickSound();
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    setProgressKey((k) => k + 1);
  };

  const handlePrevSlide = () => {
    soundManager.playClickSound();
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgressKey((k) => k + 1);
  };

  const handleSelectSlide = (idx: number) => {
    soundManager.playClickSound();
    setCurrentSlideIndex(idx);
    setProgressKey((k) => k + 1);
  };

  // Drag / Swipe handlers for smooth carousel track
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (dragStartX === null) return;
    if (dragOffset < -50) {
      handleNextSlide();
    } else if (dragOffset > 50) {
      handlePrevSlide();
    }
    setDragStartX(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea, a, select, [data-no-drag]')) return;
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    setDragOffset(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStartX === null) return;
    if (dragOffset < -60) {
      handleNextSlide();
    } else if (dragOffset > 60) {
      handlePrevSlide();
    }
    setDragStartX(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setDragStartX(null);
      setDragOffset(0);
      setIsDragging(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* =========================================================================
          TOP SHOWROOM HEADER TOOLBAR
         ========================================================================= */}
      <div className="h-10 w-full bg-slate-900/95 border-b border-white/10 flex items-center justify-between px-3 z-20 flex-none select-none backdrop-blur-md">
        {/* Left: Window Dots & Title Pill */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 flex-none">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-sm" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-400/30 text-[11px] font-mono text-purple-300 font-bold truncate shadow-inner">
            <Sparkles className="w-3 h-3 text-purple-400 flex-none animate-spin" />
            <span className="truncate">
              {project.id === 'ortho-fashion'
                ? t('ORTHO SHOWROOM • NỀN ORTHO SLIDE 1', 'ORTHO SHOWROOM • BACKGROUND ORTHO SLIDE 1')
                : t(`SHOWCASE • ${project.title}`, `SHOWCASE • ${project.titleEn}`)}
            </span>
          </div>

          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
            <Radio className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
            <span>HQ SHOWROOM</span>
          </span>
        </div>

        {/* Right: Tabs & Playback Controls */}
        <div className="flex items-center gap-1.5 flex-none">
          {/* Tabs: Slideshow / Catalog (Hidden for ortho-fashion since it's a pure background) */}
          {project.id !== 'ortho-fashion' && (
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950/80 border border-white/10">
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  setActiveTab('slides');
                }}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'slides'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={t('Xem trình chiếu Slide màn hình', 'View Slide Showcase')}
              >
                <Layers className="w-3 h-3" />
                <span>{t('Slide', 'Slides')}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClickSound();
                  setActiveTab('catalog');
                }}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={t('Xem lưới toàn bộ màn hình', 'View Grid Catalog')}
              >
                <Eye className="w-3 h-3" />
                <span>{t('Bộ sưu tập', 'Catalog')}</span>
              </button>
            </div>
          )}

          {/* If project has live web simulation option, show switch button */}
          {hasLiveWeb && onSwitchToLiveWeb && (
            <button
              onClick={() => {
                soundManager.playClickSound();
                onSwitchToLiveWeb();
              }}
              className="px-2 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
              title={t('Chuyển sang mô phỏng web thực tế (Live Web)', 'Switch to Live Web Simulation')}
            >
              <Globe className="w-3 h-3" />
              <span className="hidden md:inline">{t('Web Live', 'Live Web')}</span>
            </button>
          )}

          {/* Info toggle */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              setShowInfoDrawer(!showInfoDrawer);
            }}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              showInfoDrawer
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border-white/10'
            }`}
            title={t('Chi tiết đóng góp kỹ thuật', 'Technical contribution details')}
          >
            <Info className="w-3 h-3" />
          </button>

          {/* Lightbox / Fullscreen Image Zoom */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              setIsLightboxOpen(true);
            }}
            className="p-1.5 rounded-md bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={t('Phóng to xem chi tiết màn hình', 'Zoom slide preview')}
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          {/* Maximize / Minimize Monitor */}
          <button
            onClick={() => {
              soundManager.playClickSound();
              onToggleMaximize();
            }}
            className="p-1.5 rounded-md bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={
              isMaximized
                ? t('Thu nhỏ màn hình stream', 'Shrink stream view')
                : t('Mở rộng màn hình stream', 'Expand stream view')
            }
          >
            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN STAGE CONTENT AREA (SWITCHED BY TAB OR FULL CLEAN BACKGROUND FOR ORTHO)
         ========================================================================= */}
      <div className="relative flex-1 w-full min-h-0 overflow-hidden flex">
        {project.id === 'ortho-fashion' ? (
          /* Pure background view for Ortho Fashion: ortho_slide_1.jpg with zero UI clutter */
          <div className="relative flex-1 h-full w-full overflow-hidden bg-slate-950 flex items-center justify-center select-none">
            {/* Ambient subtle glow */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-105 pointer-events-none"
              style={{ backgroundImage: `url(${orthoSlide1})` }}
            />

            {/* Main Background Image - Full crisp display */}
            <img
              src={orthoSlide1}
              alt="Ortho Fashion Background"
              className="relative z-10 w-full h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.005]"
              onClick={() => setIsLightboxOpen(true)}
              draggable={false}
            />
          </div>
        ) : (
          <>
            {/* TAB 1: CINEMATIC SLIDESHOW */}
            {activeTab === 'slides' && (
          <div className="relative flex-1 h-full w-full flex flex-col overflow-hidden">
            {/* Slide Visual Area (Smooth Multi-Slide Carousel Track & Drag-Drop Zone) */}
            <div
              className={`relative flex-1 w-full overflow-hidden bg-slate-950 flex flex-col group cursor-grab active:cursor-grabbing select-none transition-all ${
                isDragOverFile ? 'ring-4 ring-purple-500 ring-inset' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                handleMouseLeave();
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDragOver={handleFileDragOver}
              onDragLeave={handleFileDragLeave}
              onDrop={handleFileDrop}
            >
              {/* Drag & Drop File Hover Overlay */}
              {isDragOverFile && (
                <div className="absolute inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                  <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-bounce text-purple-200">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                    {t('Thả 13 ảnh vào đây để thay thế slide', 'Drop 13 screenshots here to replace slides')}
                  </h3>
                  <p className="text-xs text-purple-300 mt-1 max-w-sm">
                    {t('Toàn bộ hình ảnh thực tế sẽ hiển thị tức thì và tự động lưu vào trình duyệt', 'Original photos will be displayed instantly & saved to browser')}
                  </p>
                </div>
              )}

              {/* Uploading / Processing State Overlay */}
              {isProcessingFiles && (
                <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent animate-spin mb-3" />
                  <h4 className="text-sm font-bold text-white">
                    {t('Đang xử lý và nạp ảnh thực tế vào slide...', 'Processing and loading project screenshots...')}
                  </h4>
                </div>
              )}

              {/* Background Glow / Ambiance (Dynamic for active slide) */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-110 pointer-events-none transition-all duration-700"
                style={{ backgroundImage: `url(${activeSlide.imageSrc})` }}
              />

              {/* Sliding Carousel Rail */}
              <div
                className="relative z-10 w-full h-full flex items-center"
                style={{
                  transform: `translateX(calc(-${currentSlideIndex * 100}% + ${dragOffset}px))`,
                  transition: isDragging ? 'none' : 'transform 480ms cubic-bezier(0.2, 0.9, 0.3, 1)',
                }}
              >
                {slides.map((slide, sIdx) => {
                  return (
                    <div
                      key={slide.id}
                      className="w-full h-full flex-none flex items-center justify-center p-2 sm:p-4 relative"
                    >
                      <div className="relative max-h-full max-w-full w-full h-full flex items-center justify-center">
                        {/* High-Res Image Screenshot Presentation Frame */}
                        <div className="relative max-h-full max-w-full rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-slate-950 flex items-center justify-center">
                          <img
                            src={slide.imageSrc}
                            alt={slide.title}
                            className="max-h-[360px] sm:max-h-[480px] w-auto max-w-full object-contain cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
                            onClick={() => setIsLightboxOpen(true)}
                            draggable={false}
                          />
                        </div>

                        {/* Slide Overlay Badges (Title, Category, Details Button) */}
                        <div className="absolute bottom-2 sm:bottom-3 left-3 right-3 pointer-events-none flex flex-col sm:flex-row sm:items-end justify-between gap-2 z-20">
                          <div className="flex flex-col gap-1 max-w-xl bg-slate-950/85 p-2 sm:p-2.5 rounded-lg backdrop-blur-md border border-white/10 shadow-lg">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-purple-600/90 text-white font-mono text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-md">
                                {language === 'vi' ? slide.category : slide.categoryEn}
                              </span>
                              {slide.isOriginalUpload && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono text-[10px] font-bold">
                                  📸 {language === 'vi' ? 'Ảnh gốc' : 'Original'}
                                </span>
                              )}
                              {slide.metrics && (
                                <span className="px-2 py-0.5 rounded bg-slate-900/80 text-cyan-300 border border-cyan-400/30 font-mono text-[10px] backdrop-blur-md">
                                  {language === 'vi' ? slide.metrics : slide.metricsEn}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-white drop-shadow-md line-clamp-1">
                              {language === 'vi' ? slide.title : slide.titleEn}
                            </h4>

                            <p className="text-[11px] text-slate-300 line-clamp-1 drop-shadow-sm hidden sm:block">
                              {language === 'vi' ? slide.subtitle : slide.subtitleEn}
                            </p>
                          </div>

                          <div className="pointer-events-auto flex items-center gap-1.5 flex-none">
                            <button
                              onClick={() => {
                                soundManager.playClickSound();
                                setShowInfoDrawer(!showInfoDrawer);
                              }}
                              className="px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all shadow-md flex items-center gap-1 cursor-pointer"
                            >
                              <Info className="w-3.5 h-3.5 text-purple-400" />
                              <span className="text-[11px]">{t('Xem đóng góp', 'View features')}</span>
                            </button>

                            <button
                              onClick={() => {
                                soundManager.playClickSound();
                                setIsLightboxOpen(true);
                              }}
                              className="p-1.5 rounded-md bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/20 backdrop-blur-md transition-all shadow-md cursor-pointer"
                              title={t('Phóng to toàn màn hình', 'Full screen zoom')}
                            >
                              <ZoomIn className="w-3.5 h-3.5 text-cyan-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Slide Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white border border-white/20 backdrop-blur-md opacity-80 hover:opacity-100 transition-all shadow-xl cursor-pointer hover:scale-110"
                title={t('Màn hình trước', 'Previous slide')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white border border-white/20 backdrop-blur-md opacity-80 hover:opacity-100 transition-all shadow-xl cursor-pointer hover:scale-110"
                title={t('Màn hình tiếp theo', 'Next slide')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slide Counter Overlay (Top Right) */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2 pointer-events-auto">
                <div className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-xs font-mono font-black text-purple-300 shadow-lg flex items-center gap-1.5">
                  <span>
                    {String(currentSlideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Auto Play / Pause Toggle */}
                <button
                  onClick={() => {
                    soundManager.playClickSound();
                    setIsPlaying(!isPlaying);
                  }}
                  className={`p-1.5 rounded-full border backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-purple-600/90 text-white border-purple-400'
                      : 'bg-slate-900/85 text-slate-300 border-white/20 hover:text-white'
                  }`}
                  title={isPlaying ? t('Tạm dừng tự động chạy', 'Pause autoplay') : t('Tự động chạy slideshow', 'Start autoplay')}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* CAROUSEL TIMELINE & DEDICATED PROGRESS BAR */}
            <div className="w-full bg-slate-950/95 border-t border-white/10 px-3 py-2 flex flex-col gap-1.5 flex-none select-none z-20">
              {/* Segmented Timeline Progress Bars (One per slide) */}
              <div className="w-full flex items-center gap-1.5 h-2">
                {slides.map((slide, idx) => {
                  const isPassed = idx < currentSlideIndex;
                  const isCurrent = idx === currentSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => handleSelectSlide(idx)}
                      className="relative flex-1 h-full rounded-full bg-slate-800 hover:bg-slate-700 transition-colors overflow-hidden cursor-pointer"
                      title={`${idx + 1}. ${language === 'vi' ? slide.title : slide.titleEn}`}
                    >
                      {isPassed && (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
                      )}
                      {isCurrent && (
                        <div
                          key={progressKey}
                          className={`h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-full ${
                            isPlaying ? 'animate-showroom-timer-progress' : 'w-full'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Controls & Slide Meta Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setIsPlaying(!isPlaying);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3 text-purple-400" />
                        <span>{t('Tự động: 4.5s', 'Autoplay: 4.5s')}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-cyan-400" />
                        <span>{t('Phát tự động', 'Autoplay')}</span>
                      </>
                    )}
                  </button>

                  <span className="text-slate-600">•</span>

                  <span className="text-[11px] font-mono text-purple-300 truncate max-w-[200px] sm:max-w-xs">
                    #{currentSlideIndex + 1}: {language === 'vi' ? activeSlide.title : activeSlide.titleEn}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Upload Custom Original Project Screenshot Button */}
                  <label
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md border border-purple-300/30 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title={t('Tải lên 13 ảnh chụp màn hình gốc của dự án Ortho từ máy tính của bạn', 'Upload your 13 production screenshots from computer')}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('Tải lên 13 ảnh gốc', 'Upload 13 Screenshots')}</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          processUploadedFiles(e.target.files);
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>

                  {/* Guide Button - Shows where and how to add images */}
                  <button
                    onClick={() => {
                      soundManager.playClickSound();
                      setShowUploadGuideModal(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-[10px] font-medium transition-colors cursor-pointer"
                    title={t('Xem hướng dẫn vị trí và cách thêm ảnh vào dự án', 'How and where to add project screenshots')}
                  >
                    <Info className="w-3 h-3 text-cyan-400" />
                    <span>{t('Chỗ thêm ảnh?', 'Image Guide')}</span>
                  </button>

                  {customScreenshots[project.id]?.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] text-emerald-300 font-mono">
                      <span>✓ {customScreenshots[project.id].length} {t('ảnh thực tế', 'photos')}</span>
                      <button
                        onClick={handleClearCustomScreenshots}
                        className="text-rose-400 hover:text-rose-300 underline ml-1 cursor-pointer"
                        title={t('Đặt lại về slide mẫu mặc định', 'Reset to default sample mockups')}
                      >
                        {t('Khôi phục', 'Reset')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Slide Thumbnail Strip */}
            <div className="h-14 sm:h-16 w-full bg-slate-950 border-t border-white/10 flex items-center gap-2 px-3 overflow-x-auto flex-none scrollbar-thin scrollbar-thumb-purple-600/40">
              {slides.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => handleSelectSlide(idx)}
                    className={`relative h-10 sm:h-12 w-16 sm:w-20 rounded-lg overflow-hidden flex-none border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-purple-400 ring-2 ring-purple-500/50 scale-105 shadow-lg'
                        : 'border-white/10 opacity-50 hover:opacity-90 hover:border-white/30'
                    }`}
                    title={language === 'vi' ? slide.title : slide.titleEn}
                  >
                    {slide.imageSrc ? (
                      <img
                        src={slide.imageSrc}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-mono">
                        UI #{idx + 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[8px] font-mono font-bold text-white truncate">
                        #{idx + 1}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: GRID CATALOG OF ALL SCREENS */}
        {activeTab === 'catalog' && (
          <div className="relative flex-1 h-full w-full overflow-y-auto p-4 bg-slate-950 flex flex-col gap-4">
            {/* Filter pills for catalog */}
            {project.id === 'ortho-fashion' && (
              <div className="flex items-center gap-1.5 flex-wrap flex-none">
                {[
                  { id: 'all', labelVi: 'Tất cả (10+)', labelEn: 'All (10+)' },
                  { id: 'landing', labelVi: 'Landing Web3', labelEn: 'Web3 Landing' },
                  { id: 'chatbot', labelVi: 'AI Chatbot & Stylist', labelEn: 'AI Chatbot & Stylist' },
                  { id: 'dashboard', labelVi: 'Dashboard & Store', labelEn: 'Dashboard & Store' },
                  { id: 'game', labelVi: 'Game Arena', labelEn: 'Game Arena' },
                  { id: 'metaverse', labelVi: 'Metaverse Map', labelEn: 'Metaverse Map' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      soundManager.playClickSound();
                      setSelectedFilter(f.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedFilter === f.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {language === 'vi' ? f.labelVi : f.labelEn}
                  </button>
                ))}
              </div>
            )}

            {/* Catalog Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => {
                    soundManager.playClickSound();
                    const realIndex = slides.findIndex((s) => s.id === slide.id);
                    if (realIndex !== -1) setCurrentSlideIndex(realIndex);
                    setActiveTab('slides');
                  }}
                  className="group relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-purple-400/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={slide.imageSrc}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-purple-600/90 text-white font-mono text-[9px] font-bold uppercase">
                        {language === 'vi' ? slide.category : slide.categoryEn}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900/80 text-cyan-300 font-mono text-[10px] font-bold border border-white/10">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {language === 'vi' ? slide.title : slide.titleEn}
                      </h5>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {language === 'vi' ? slide.subtitle : slide.subtitleEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] text-purple-400 font-medium flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {t('Xem chi tiết', 'Inspect slide')}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}

        {/* SIDE INFO DRAWER (TECHNICAL CONTRIBUTIONS) */}
        {showInfoDrawer && (
          <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-slate-900/98 backdrop-blur-xl border-l border-white/15 p-4 z-30 flex flex-col shadow-2xl animate-slideLeft overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-none">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t('Đóng góp kỹ thuật', 'Technical Contributions')}
                </h4>
              </div>
              <button
                onClick={() => setShowInfoDrawer(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 py-3 space-y-3">
              <div>
                <span className="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider block">
                  {language === 'vi' ? activeSlide.category : activeSlide.categoryEn}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {language === 'vi' ? activeSlide.title : activeSlide.titleEn}
                </h3>
              </div>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1">
                {activeSlide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-white/10 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Key contributions list */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-300 block">
                  {t('Công việc & Trách nhiệm chính của Minh Thu:', "Minh Thu's Core Work & Deliverables:")}
                </span>
                {(language === 'vi' ? activeSlide.contributions : activeSlide.contributionsEn).map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-none mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="pt-3 border-t border-white/10 flex-none flex gap-2">
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  setIsLightboxOpen(true);
                }}
                className="flex-1 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{t('Xem ảnh phóng to', 'Zoom Image')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          FULLSCREEN LIGHTBOX MODAL
         ========================================================================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col p-4 animate-fadeIn">
          {/* Lightbox Toolbar */}
          <div className="h-12 w-full flex items-center justify-between px-2 flex-none border-b border-white/10">
            <div className="flex items-center gap-3">
              {project.id === 'ortho-fashion' ? (
                <span className="px-2.5 py-1 rounded bg-purple-600 text-white font-mono text-xs font-bold">
                  ORTHO BACKGROUND
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded bg-purple-600 text-white font-mono text-xs font-bold">
                  {String(currentSlideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              )}
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xl">
                {project.id === 'ortho-fashion'
                  ? 'Ortho Fashion — Background Image (ortho_slide_1.jpg)'
                  : (language === 'vi' ? activeSlide.title : activeSlide.titleEn)}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  setIsLightboxOpen(false);
                }}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title={t('Đóng', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image View */}
          <div className="relative flex-1 w-full flex items-center justify-center p-4 overflow-hidden">
            <img
              src={project.id === 'ortho-fashion' ? orthoSlide1 : activeSlide.imageSrc}
              alt={project.id === 'ortho-fashion' ? 'Ortho Fashion Background' : activeSlide.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/20"
            />

            {/* Floating Navigation Controls (Only for multi-slide projects) */}
            {project.id !== 'ortho-fashion' && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white border border-white/20 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white border border-white/20 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Instructions Modal */}
      {showUploadGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                soundManager.playClickSound();
                setShowUploadGuideModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {t('Hướng dẫn thêm ảnh dự án Ortho Fashion', 'Guide: Adding Real Project Screenshots')}
                </h3>
                <p className="text-xs text-purple-300">
                  {t('2 cách đơn giản để thay thế toàn bộ ảnh mẫu bằng ảnh thực tế của bạn', '2 easy methods to replace mockups with your authentic images')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Method 1 */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[11px] font-bold">
                    {t('Cách 1: Nhanh nhất (Trực tiếp trong giao diện)', 'Method 1: Instant In-App Upload')}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">✓ {t('Khuyên dùng', 'Recommended')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(
                    'Bấm nút "Tải lên 13 ảnh gốc" hoặc kéo-thả trực tiếp 13 tệp ảnh từ máy tính của bạn vào khung hình trình chiếu. Toàn bộ ảnh sẽ lập tức hiển thị, tự động căn chỉnh và lưu trữ an toàn trên cơ sở dữ liệu IndexedDB của trình duyệt để bạn xem lại bất cứ lúc nào.',
                    'Click "Upload 13 Screenshots" or drag-and-drop your 13 image files directly into the slideshow screen. Images will instantly appear and persist in your browser.'
                  )}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('Chọn 13 ảnh từ máy tính ngay', 'Select 13 photos now')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          processUploadedFiles(e.target.files);
                          setShowUploadGuideModal(false);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Method 2 */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 text-[11px] font-bold">
                    {t('Cách 2: Lưu cố định vào Source Code', 'Method 2: Persistent Source Code Assets')}
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">src/assets/images/ortho/</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {t(
                    'Nếu bạn muốn ảnh lưu vĩnh viễn trong mã nguồn dự án GitHub / Cloud Run, mở thanh File Explorer ở cột bên trái của AI Studio, điều hướng đến thư mục sau và tải ảnh lên:',
                    'To embed images permanently into the source code repository, open the left File Explorer in AI Studio and upload your files to:'
                  )}
                </p>
                <div className="p-2.5 rounded bg-slate-950 font-mono text-[11px] text-cyan-300 border border-white/10 select-all">
                  src/assets/images/ortho/
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {t(
                    'Đặt tên các tệp từ ortho_slide_1.jpg đến ortho_slide_13.jpg tương ứng với 13 tính năng của dự án.',
                    'Name the files ortho_slide_1.jpg through ortho_slide_13.jpg corresponding to the 13 modules.'
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  soundManager.playClickSound();
                  setShowUploadGuideModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('Đã hiểu', 'Got it')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
