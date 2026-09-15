import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PERSONAL_INFO, PROJECTS, AWARDS } from '../data/portfolioData';
import { soundManager } from '../audio/soundManager';
import {
  X,
  Mail,
  Linkedin,
  Github,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Award,
  Sparkles,
  Zap,
  Gamepad2,
  Printer,
  Calendar,
  MapPin,
  GraduationCap,
  HeartHandshake,
  FolderGit2,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HRQuickCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen3DWorld: () => void;
}

export const HRQuickCVModal: React.FC<HRQuickCVModalProps> = ({
  isOpen,
  onClose,
  onOpen3DWorld,
}) => {
  const { language, t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    soundManager.playCoinSound();
    navigator.clipboard.writeText('minhthu2k33@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    soundManager.playCoinSound();
    navigator.clipboard.writeText('0888392122');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handlePrintCV = () => {
    soundManager.playLevelUpSound();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    window.print();
  };

  return (
    <div
      id="hr-quick-cv-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-200 text-slate-100 font-sans overflow-y-auto no-scrollbar"
    >
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.12)_0,transparent_60%)]" />

      {/* Main CV Dossier Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-[32px] liquid-glass border border-white/40 dark:border-slate-700/60 shadow-2xl p-5 sm:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar my-auto">
        {/* Top Control Bar for HR */}
        <div className="flex items-center justify-between pb-4 border-b border-white/20 dark:border-slate-700/50 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black tracking-wide text-white uppercase">
                  HỒ SƠ ỨNG VIÊN // HR FAST-TRACK CV
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 text-[9px] font-mono font-bold uppercase">
                  SẴN SÀNG NHẬN VIỆC
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Tổng hợp nhanh học vấn, kinh nghiệm thực chiến & sản phẩm dành cho Quý Nhà tuyển dụng / Tech Lead
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintCV}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-mono text-xs font-black tracking-wider transition-all cursor-pointer shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In / Xuất PDF</span>
              <span className="sm:hidden">In PDF</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClickSound();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Candidate Summary Banner */}
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-white/10 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-pink-500/80 shadow-lg shrink-0 bg-gradient-to-tr from-pink-500/40 to-indigo-600/40 flex items-center justify-center text-2xl font-black text-white">
              <span>MT</span>
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  {PERSONAL_INFO.fullName}
                </h2>
                <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono font-bold">
                  Frontend Developer & AI Engineer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-pink-300 font-medium mt-1">
                Cử nhân Thị giác Máy tính (HCMUS) • Kinh nghiệm React.js, Next.js, Python, Three.js & Thiết kế
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Quận Tân Phú, TP. Hồ Chí Minh (On-site & Hybrid)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sẵn sàng gia nhập dự án</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={handleCopyEmail}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép Email!</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5 text-pink-400" />
                  <span>minhthu2k33@gmail.com</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyPhone}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer"
            >
              {copiedPhone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép SĐT!</span>
                </>
              ) : (
                <>
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>0888 392 122</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-mono font-bold text-slate-200 transition-all"
              >
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>GitHub</span>
              </a>

              <a
                href={PERSONAL_INFO.socials.portfolioCanva}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600/40 border border-pink-400/40 text-xs font-mono font-bold text-pink-200 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Canva Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Highlight Metrics from Real CV */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 text-center">
            <span className="text-xl sm:text-2xl font-black text-cyan-400 block font-mono">
              8.35 / 10
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              GPA Cử nhân HCMUS (~3.34/4.0)
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 text-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 block font-mono">
              740+
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              Học sinh STEM & SEL tại Kidspire
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 text-center">
            <span className="text-xl sm:text-2xl font-black text-amber-400 block font-mono">
              10+ Dự án
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              Web, AI, Phần mềm & Media
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 text-center">
            <span className="text-xl sm:text-2xl font-black text-pink-400 block font-mono">
              4 Học bổng
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              Bosch, HCMUS, VietHope, CNCF
            </span>
          </div>
        </div>

        {/* Core Sections: Work Experience & Tech Arsenal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* Left: Work History (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <h3 className="text-xs font-black font-mono tracking-wider uppercase text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>KINH NGHIỆM THỰC CHIẾN NỔI BẬT</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Job 1: Ortho Fashion */}
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm">
                      Front-end Developer (Intern & Official)
                    </span>
                    <span className="block text-pink-400 font-mono text-[11px]">
                      Ortho Fashion (ortho.fashion) • 06/2024 - 02/2026
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[10px]">
                    Production
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 mt-2.5 leading-relaxed">
                  <li>Xây dựng UI Login hiện đại, bảo mật và phát triển Chatbot AI tư vấn phong cách thông minh.</li>
                  <li>Phát triển các landing page, e-commerce web bằng React.js, Next.js, Tailwind CSS, Three.js và REST APIs.</li>
                  <li>Tích hợp kết nối ví Web3 MetaMask, mô-đun gợi ý trang phục AI & hỗ trợ công cụ thử đồ ảo.</li>
                  <li>Refactor, module hóa UI components nâng cao khả năng tái sử dụng và tối ưu hiệu năng thiết bị di động.</li>
                </ul>
              </div>

              {/* Job 2: Kidspire */}
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm">
                      Điều phối viên & Giảng dạy STEM - SEL
                    </span>
                    <span className="block text-emerald-400 font-mono text-[11px]">
                      Kidspire Vietnam Organization • 12/2025 - Hiện tại
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    Xã hội & Giáo dục
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 mt-2.5 leading-relaxed">
                  <li>Điều phối chương trình STEM tích hợp Học tập Cảm xúc - Xã hội (SEL) 18 tháng cho 740+ học sinh (12-18 tuổi) và 200+ phụ huynh tại các mái ấm, trung tâm bảo trợ.</li>
                  <li>Trực tiếp giảng dạy 30 giờ SEL cho học sinh và 6 giờ tập huấn cho người chăm sóc về tự điều chỉnh cảm xúc và giải quyết xung đột.</li>
                </ul>
              </div>

              {/* Job 3: VietHope */}
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm">
                      Designer & Video Editor (Marketing Team) & Web Contributor
                    </span>
                    <span className="block text-cyan-400 font-mono text-[11px]">
                      VietHope Organization • 12/2022 - Hiện tại
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                    Tình nguyện
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 mt-2.5 leading-relaxed">
                  <li>Quản trị nội dung và nâng cấp giao diện website tổ chức viethope.org (WordPress).</li>
                  <li>Tham gia xây dựng nền tảng xét tuyển học bổng VietHope VSDP (viethope.org/programs/vsdp2025/).</li>
                  <li>Biên tập video recap sự kiện trọng điểm: MDP 2022, VSDP 2022, Summit 2023 và Teaser Talkshow 27.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Technical Arsenal & Key Projects (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h3 className="text-xs font-black font-mono tracking-wider uppercase text-amber-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>HỌC VẤN & HỌC BỔNG</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 text-xs">
              <span className="font-bold text-white block">ĐH Khoa học Tự nhiên - ĐHQG-HCM</span>
              <span className="text-cyan-300 text-[11px] block">Cử nhân Thị giác Máy tính (2021 - 2025)</span>
              <span className="text-slate-400 text-[11px] block">GPA: 8.35 / 10 • Chương trình tích hợp Thạc sĩ</span>
              
              <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Award className="w-3 h-3" />
                  <span>Học bổng Bosch Global Software "Give Wings To Your Dream 2024"</span>
                </div>
                <div>• Học bổng Cựu sinh viên Khoa CNTT 2023 - HCMUS</div>
                <div>• Học bổng VietHope Youth Development 2021 & 2022</div>
                <div>• Học bổng CNCF - Christina Noble Education Programme</div>
              </div>
            </div>

            <h3 className="text-xs font-black font-mono tracking-wider uppercase text-cyan-300 flex items-center gap-1.5 mt-1">
              <Award className="w-3.5 h-3.5" />
              <span>VŨ KHÍ CÔNG NGHỆ CHÍNH</span>
            </h3>

            <div className="p-3 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {[
                  'React.js',
                  'TypeScript',
                  'Next.js',
                  'Tailwind CSS',
                  'Python',
                  'OpenCV',
                  'Deep Learning (VTON)',
                  'C / C++ (OOP)',
                  'Java (Socket)',
                  'Three.js / WebGL',
                  'WordPress & WiX',
                  'Graphic & Video Design',
                  'Agile / Git',
                  'STEM & SEL',
                ].map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-xs font-black font-mono tracking-wider uppercase text-pink-300 flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('DỰ ÁN TIÊU BIỂU', 'FEATURED PROJECTS')}</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              {PROJECTS.slice(0, 4).map((proj) => (
                <div
                  key={proj.id}
                  className="p-2.5 rounded-xl bg-white/5 dark:bg-slate-900/40 border border-white/10 flex items-center justify-between"
                >
                  <div className="pr-2">
                    <span className="font-bold text-white block text-[11px]">
                      {language === 'en' && proj.titleEn ? proj.titleEn : proj.title}
                    </span>
                    <span className="text-[10px] text-pink-400">
                      {language === 'en' && proj.categoryEn ? proj.categoryEn : proj.category}
                    </span>
                  </div>
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition-all shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer: Switch back to 3D World or Connect */}
        <div className="pt-4 border-t border-white/20 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              soundManager.playClickSound();
              onOpen3DWorld();
            }}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer font-bold"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Khám phá Portfolio Tương tác Không gian 3D &rarr;</span>
          </button>

          <a
            href="mailto:minhthu2k33@gmail.com?subject=Thư mời phỏng vấn - Vị trí Frontend Developer / Software Engineer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:opacity-95 text-white font-mono text-xs font-black tracking-wider transition-all cursor-pointer shadow-lg shadow-pink-500/30 text-center"
          >
            Gửi Thư Phỏng Vấn Trực Tiếp (minhthu2k33@gmail.com)
          </a>
        </div>
      </div>
    </div>
  );
};
