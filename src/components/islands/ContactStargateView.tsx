import React, { useState, useEffect } from 'react';
import { soundManager } from '../../audio/soundManager';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  Send,
  Sparkles,
  CheckCircle2,
  Mail,
  Github,
  Linkedin,
  Eye,
  Layers,
  Copy,
  Check,
  Zap,
  Flame,
  Clock,
  Star,
  Truck,
  Gift,
  ShieldCheck,
  X,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactStargateViewProps {
  onBackToWorld: () => void;
  onGainXP: (amount: number) => void;
}

export interface UpgradePackage {
  id: string;
  tier: string;
  name: string;
  icon: string;
  badge: string;
  isPopular?: boolean;
  price: string;
  priceSub: string;
  description: string;
  delivery: string;
  features: string[];
  gradient: string;
  buttonClass: string;
}

const UPGRADE_PACKAGES: UpgradePackage[] = [
  {
    id: 'starter',
    tier: 'TIER 01 • STARTER',
    name: 'Gói Starter Boost',
    icon: '🚀',
    badge: 'TƯ VẤN & REVIEW',
    price: '01 Lời Mời Cafe',
    priceSub: 'Trao đổi chuyên môn & kết nối',
    description: 'Đánh giá cấu trúc Frontend, audit điểm Lighthouse, tư vấn cải thiện hiệu năng và trải nghiệm người dùng.',
    delivery: 'Phản hồi trong 24h',
    features: [
      'Code Review & Architecture Audit',
      'Đánh giá UI/UX & Khả năng tương tác',
      'Đề xuất lộ trình tối ưu hoá 60 FPS',
      '30 phút thảo luận kỹ thuật trực tiếp',
    ],
    gradient: 'from-sky-500/20 to-indigo-500/20 border-sky-400/30',
    buttonClass: 'bg-white/10 hover:bg-white/20 text-white',
  },
  {
    id: 'pro-creative',
    tier: 'TIER 02 • PRO CREATIVE',
    name: 'Gói Pro 3D Creative',
    icon: '⭐',
    badge: '🔥 ĐƯỢC CHỌN NHIỀU NHẤT',
    isPopular: true,
    price: 'Sprint / Full-time',
    priceSub: 'Thử việc hoặc hợp đồng dự án',
    description: 'Chuyển đổi Figma thành Web tương tác 3D WebGL / Three.js sống động, giao diện kính mờ Liquid Glass đỉnh cao.',
    delivery: 'Onboarding siêu tốc',
    features: [
      'Web tương tác 3D Three.js mượt mà',
      'Giao diện Liquid Glassmorphism chuẩn Apple',
      'Clean Code, TypeScript 100% Type Coverage',
      'Tối ưu tải trang < 0.8s, 60 FPS ổn định',
    ],
    gradient: 'from-pink-500/30 via-rose-500/20 to-amber-500/30 border-pink-400/60 ring-2 ring-pink-500/40',
    buttonClass: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/40',
  },
  {
    id: 'enterprise-lead',
    tier: 'TIER 03 • ENTERPRISE',
    name: 'Gói Enterprise & Lead',
    icon: '👑',
    badge: 'LUXURY & ARCHITECTURE',
    price: 'Offer Vị Trí Senior',
    priceSub: 'Đồng hành xây dựng sản phẩm lớn',
    description: 'Kiến trúc hệ thống Front-to-Back, tích hợp AI Agents, Shaders đồ họa độc bản và thiết kế Design System toàn diện.',
    delivery: 'Đồng hành dài hạn',
    features: [
      'Kiến trúc Frontend quy mô lớn (Scalable)',
      'Tích hợp AI / LLM Agents thời gian thực',
      'Custom Shader FX (Water, Bloom, Volumetrics)',
      'Đào tạo & chuyển giao công nghệ cho team',
    ],
    gradient: 'from-amber-500/20 to-purple-500/20 border-amber-400/40',
    buttonClass: 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black shadow-lg shadow-amber-500/30',
  },
];

const ADDONS = [
  { id: 'pigeon', name: '🕊️ Chim Bưu Điện Freeship 24H', defaultChecked: true },
  { id: 'shader', name: '💎 Custom Shader Độc Bản', defaultChecked: true },
  { id: 'design-system', name: '🎨 Export Full Figma Tokens', defaultChecked: false },
];

export const ContactStargateView: React.FC<ContactStargateViewProps> = ({
  onBackToWorld,
  onGainXP,
}) => {
  const { language, t } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<string>('pro-creative');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['pigeon', 'shader']);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  // Countdown timer
  const [countdown, setCountdown] = useState('02:45:18');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(23 - now.getHours()).padStart(2, '0');
      const m = String(59 - now.getMinutes()).padStart(2, '0');
      const s = String(59 - now.getSeconds()).padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activePackage = UPGRADE_PACKAGES.find((p) => p.id === selectedTier) || UPGRADE_PACKAGES[1];

  const handleToggleAddon = (id: string) => {
    soundManager.playMechanicalClick();
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyEmail = () => {
    soundManager.playCoinSound();
    navigator.clipboard.writeText('minhthu2k33@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmitDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    soundManager.playLootDropSound();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      soundManager.playLevelUpSound();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
      onGainXP(400);
    }, 1000);
  };

  return (
    <div
      id="contact-shop-island"
      className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between select-none overflow-hidden"
    >
      {/* ─── 1. TOP HEADER NAVIGATION ───────────────────────────────────── */}
      <header className="pointer-events-auto fixed top-3 inset-x-3 sm:inset-x-6 z-40 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full liquid-glass shadow-2xl border border-white/40 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onBackToWorld();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 text-slate-800 dark:text-white font-black text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-pink-500" />
            <span>Về Thế Giới 3D</span>
          </button>
          <div className="h-4 w-px bg-white/40 dark:bg-slate-700 hidden sm:block" />
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent hidden sm:inline-block">
            🛍️ Đảo 05: Gói Nâng Cấp Dịch Vụ & Hợp Tác Sáng Tạo
          </span>
        </div>

        {/* Quick Contact & Countdown */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-400/20 text-xs font-mono text-pink-600 dark:text-pink-400">
            <Clock className="w-3 h-3 animate-spin" />
            <span>DEAL FLASH: {countdown}</span>
          </div>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill hover:scale-105 active:scale-95 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">minhthu2k33@gmail.com</span>
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN STORE VIEW (ZERO SCROLL, FITS 100% VIEWPORT) ─────────── */}
      <main className="pointer-events-auto w-full h-full pt-16 sm:pt-20 pb-4 px-3 sm:px-6 flex flex-col justify-center items-center max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden">
        {/* Banner Pill */}
        <div className="w-full flex items-center justify-between py-1.5 px-4 mb-3 rounded-2xl liquid-glass border border-white/40 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🕊️</span>
            <span className="font-black text-slate-800 dark:text-white">
              Giao Thư Mời Phỏng Vấn Tận Hộp Thư Tuyển Dụng Trong 5 Phút
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-bold uppercase">
              Freeship 100%
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cam Kết Không Trễ Deadline</span>
          </div>
        </div>

        {/* ─── 3 UPGRADE TIER CARDS ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full items-stretch flex-1 max-h-[64vh]">
          {UPGRADE_PACKAGES.map((pkg) => {
            const isSelected = selectedTier === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => {
                  soundManager.playClickSound();
                  setSelectedTier(pkg.id);
                }}
                className={`rounded-[30px] liquid-glass p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden border ${
                  isSelected
                    ? pkg.gradient
                    : 'border-white/40 dark:border-slate-800/80 hover:border-white/70 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Popular Ribbon */}
                {pkg.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-pink-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-2xl shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>HOT DEAL</span>
                  </div>
                )}

                {/* Card Top */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{pkg.icon}</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400 block uppercase">
                        {pkg.tier}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  {/* Price Banner */}
                  <div className="mt-3 py-2 px-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800">
                    <div className="text-base sm:text-lg font-black text-pink-600 dark:text-pink-400">
                      {pkg.price}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {pkg.priceSub}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  <div className="mt-3 flex flex-col gap-1.5">
                    {pkg.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="pt-3 mt-3 border-t border-white/20 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>{pkg.delivery}</span>
                  </span>

                  <div
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                      isSelected
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-white/20 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isSelected ? 'Đang Chọn ✓' : 'Chọn Gói Này'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── BOTTOM FLOATING SUMMARY & CHECKOUT BAR ────────────────────── */}
        <div className="w-full mt-3 rounded-[28px] liquid-glass p-3 sm:p-4 border border-white/50 dark:border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Add-on perks toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden md:inline">
              Tiện ích kèm theo:
            </span>
            {ADDONS.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  onClick={() => handleToggleAddon(addon.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isChecked
                      ? 'bg-pink-500/15 border-pink-500/50 text-pink-600 dark:text-pink-300'
                      : 'bg-white/10 border-white/20 text-slate-400'
                  }`}
                >
                  {isChecked ? '✓ ' : '+ '}
                  {addon.name}
                </button>
              );
            })}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-black text-slate-800 dark:text-white">
                Đã chọn: <span className="text-pink-500">{activePackage.name}</span>
              </div>
              <div className="text-[10px] text-emerald-500 font-bold">
                Voucher OFFER2026 tự động áp dụng (-100% Rủi Ro)
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClickSound();
                setIsCheckoutModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:scale-105 active:scale-95 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Chốt Gói Nâng Cấp Này</span>
            </button>
          </div>
        </div>
      </main>

      {/* ─── CHECKOUT MODAL ─────────────────────────────────────────────── */}
      {isCheckoutModalOpen && (
        <div
          id="checkout-modal-backdrop"
          onClick={() => {
            soundManager.playClickSound();
            setIsCheckoutModalOpen(false);
            setIsSubmitted(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto animate-in fade-in duration-200"
        >
          <div
            id="checkout-modal-container"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[32px] liquid-glass border-2 border-white/60 dark:border-slate-700/90 shadow-2xl p-6 flex flex-col gap-4 text-slate-900 dark:text-white backdrop-blur-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/20 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-xl text-white shadow-md">
                  {activePackage.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white">
                    {activePackage.name}
                  </h3>
                  <span className="text-[10px] text-pink-500 dark:text-pink-400 font-mono font-bold">
                    {t('Gói dịch vụ đã sẵn sàng kích hoạt', 'Service package ready to deploy')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                id="close-checkout-modal-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClickSound();
                  setIsCheckoutModalOpen(false);
                  setIsSubmitted(false);
                }}
                className="w-8 h-8 rounded-full bg-white/40 dark:bg-slate-800/80 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all cursor-pointer border border-white/30 shadow-sm"
                title={t('Đóng cửa sổ', 'Close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmitDeal} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {t('Họ Tên Nhà Tuyển Dụng / Khách Hàng:', 'Your Name / Organization:')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('VD: Nguyễn Văn A (HR / Engineering Lead)', 'Ex: Jane Doe (HR / Engineering Lead)')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {t('Email Công Ty / Liên Hệ:', 'Contact / Corporate Email:')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {t('Lời Nhắn Hoặc Yêu Cầu Dự Án:', 'Message or Project Requirements:')}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t(
                      'Gợi ý: Thời gian phỏng vấn phù hợp, mô tả vị trí hoặc dự án cần làm...',
                      'Suggested: Interview scheduling, role requirements, or project scope...'
                    )}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/60 border border-white/30 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-pink-500/15 border border-pink-400/30 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 text-pink-500 dark:text-pink-400 font-bold mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('Đặc quyền ưu tiên phỏng vấn & phản hồi nhanh', 'Priority Interview & Rapid Response')}</span>
                  </div>
                  <span>
                    {t(
                      'CV và thông tin dự án sẽ được chim bưu điện gửi trực tiếp tới hòm thư của bạn ngay khi bấm xác nhận!',
                      'CV and portfolio deliverables will be dispatched directly to your inbox upon confirmation!'
                    )}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:scale-[1.02] active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? t('Đang Chốt Deal...', 'Securing Agreement...')
                      : t('Gửi Yêu Cầu & Nhận Lịch Hẹn (+400 XP)', 'Confirm & Schedule Meeting (+400 XP)')}
                  </span>
                </button>
              </form>
            ) : (
              <div className="py-6 flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-3xl shadow-xl shadow-pink-500/40 animate-bounce">
                  🕊️
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {t('Chốt Deal Thành Công!', 'Agreement Confirmed!')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                  {t(
                    `Cảm ơn bạn! Chim bưu điện đã chuyển phát thông tin gói ${activePackage.name} tới email của Minh Thu (minhthu2k33@gmail.com).`,
                    `Thank you! Signal transmission for package ${activePackage.name} sent to Minh Thu's inbox.`
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClickSound();
                    setIsCheckoutModalOpen(false);
                    onBackToWorld();
                  }}
                  className="mt-2 px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-xs font-bold text-white cursor-pointer shadow-md shadow-pink-500/30 transition-all"
                >
                  {t('Về Lại Thế Giới 3D', 'Return to 3D Realm')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
