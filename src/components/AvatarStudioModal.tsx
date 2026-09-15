import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UploadCloud,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Shirt,
  Download,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { soundManager } from '../audio/soundManager';
import {
  saveCustomModel,
  getCustomModel,
  clearCustomModel,
  getStoredModelSettings,
  saveStoredModelSettings,
  ModelSettings,
} from '../utils/characterStore';
import confetti from 'canvas-confetti';

interface AvatarStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarStudioModal: React.FC<AvatarStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const [activeModelName, setActiveModelName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [settings, setSettings] = useState<ModelSettings>(getStoredModelSettings());

  // Check currently active model on modal open
  useEffect(() => {
    if (isOpen) {
      getCustomModel().then((res) => {
        if (res) {
          setActiveModelName(res.name);
        } else {
          setActiveModelName(null);
        }
      });
      setSettings(getStoredModelSettings());
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(glb|gltf)$/i)) {
      setErrorMsg(
        t(
          'Vui lòng chọn file định dạng .glb hoặc .gltf!',
          'Please select a .glb or .gltf 3D model file!'
        )
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const buffer = await file.arrayBuffer();
      await saveCustomModel(buffer, file.name);
      setActiveModelName(file.name);
      setSuccessMsg(
        t(
          `Đã nạp thành công mô hình: ${file.name}! Nhân vật của bạn đã được thay đổi.`,
          `Successfully loaded 3D model: ${file.name}! Your character is now updated.`
        )
      );
      soundManager.playLevelUpSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        t(
          'Không thể xử lý file mô hình. Vui lòng thử lại!',
          'Failed to process 3D model file. Please try again!'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(urlInput.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('URL returned an HTML webpage instead of a direct 3D model file (.glb / .gltf)');
      }
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 4) {
        throw new Error('Downloaded file is too small to be a valid 3D model');
      }
      const preview = new Uint8Array(buffer.slice(0, 16));
      if (String.fromCharCode(...preview).trim().startsWith('<')) {
        throw new Error('Downloaded file is HTML rather than a 3D model');
      }
      const fileName = urlInput.split('/').pop()?.split('?')[0] || 'RemoteModel.glb';
      await saveCustomModel(buffer, fileName);
      setActiveModelName(fileName);
      setSuccessMsg(
        t(
          `Đã tải mô hình từ URL thành công: ${fileName}!`,
          `Successfully loaded model from URL: ${fileName}!`
        )
      );
      soundManager.playLevelUpSound();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        t(
          'Không thể tải từ URL này (có thể do bị chặn CORS). Hãy tải file về máy rồi kéo thả vào đây!',
          'Cannot fetch from this URL (likely blocked by CORS). Please download the file to your computer and drag it here!'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDefault = async () => {
    soundManager.playClickSound();
    await clearCustomModel();
    setActiveModelName(null);
    setSuccessMsg(
      t(
        'Đã khôi phục về nhân vật Thuww Techwear mặc định!',
        'Reset to default Thuww Techwear character!'
      )
    );
  };

  const updateSetting = (key: keyof ModelSettings, val: number) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    saveStoredModelSettings({ [key]: val });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="avatar-studio-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            id="avatar-studio-modal"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-pink-500/30 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-purple-500/15 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {t('Trạm Đổi Nhân Vật 3D', '3D Avatar Studio')}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500 text-white">
                      GLB Loader
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t(
                      'Tùy biến nhân vật khám phá thế giới Aetheria',
                      'Customize your explorer avatar across Aetheria'
                    )}
                  </p>
                </div>
              </div>

              <button
                id="close-avatar-studio-btn"
                onClick={() => {
                  soundManager.playClickSound();
                  onClose();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar">
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('Nhân vật đang kích hoạt:', 'Active Explorer:')}
                  </span>
                  <span className="text-xs font-black text-pink-600 dark:text-pink-400">
                    {activeModelName || t('Thuww Techwear (Mặc định)', 'Default Thuww Techwear')}
                  </span>
                </div>

                {activeModelName && (
                  <button
                    onClick={handleResetDefault}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('Về mặc định', 'Reset')}</span>
                  </button>
                )}
              </div>

              {/* Citizen 3 Featured Card (Poly Pizza 26UC5iU4Fk) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 border-2 border-pink-400/40 dark:border-pink-500/30 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
                        {t('Model Bạn Đang Chọn', 'Requested Model')}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        Poly Pizza #26UC5iU4Fk
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Citizen 3 (J-Toastie)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                      {t(
                        'Nhân vật công dân chibi 3D đáng yêu, có sẵn khung xương chuyển động (Rigged & Animated) phong cách Low-Poly.',
                        'Adorable 3D chibi citizen character, fully rigged & animated with playful low-poly aesthetic.'
                      )}
                    </p>
                  </div>

                  <a
                    href="https://poly.pizza/m/26UC5iU4Fk"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundManager.playClickSound()}
                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('Tải GLB Tại Poly Pizza (Miễn Phí)', 'Get GLB on Poly Pizza (Free)')}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>

                {/* 3 Step Instruction */}
                <div className="mt-4 pt-3.5 border-t border-pink-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {t(
                        'Bấm nút mở trang Poly Pizza (không cần đăng nhập)',
                        'Open Poly Pizza page (no login required)'
                      )}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {t('Bấm "Download" -> Chọn file .GLTF / .GLB', 'Click "Download" -> Choose .GLTF / .GLB')}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {t(
                        'Kéo thả file vào khung bên dưới — Xong ngay!',
                        'Drag & drop file into the box below — Done!'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
                  isDragOver
                    ? 'border-pink-500 bg-pink-500/10 scale-102'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-pink-400 hover:bg-pink-50/30 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".glb,.gltf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-500 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {t(
                      'Kéo thả file .GLB / .GLTF vào đây hoặc bấm để duyệt từ máy',
                      'Drag & drop .GLB / .GLTF file here or click to browse'
                    )}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t(
                      'Hỗ trợ file tải từ Poly Pizza, Ready Player Me, Sketchfab, Mixamo...',
                      'Supports Poly Pizza, Ready Player Me, Sketchfab, Mixamo...'
                    )}
                  </p>
                </div>

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-500 animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{t('Đang phân tích & nạp mô hình 3D...', 'Parsing 3D model...')}</span>
                  </div>
                )}
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Direct URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-pink-500" />
                  <span>{t('Hoặc nhập link trực tiếp tới file .GLB trực tuyến:', 'Or enter direct online .GLB URL:')}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://.../character.glb"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-pink-500"
                  />
                  <button
                    onClick={handleFetchUrl}
                    disabled={isLoading || !urlInput.trim()}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-pink-600 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {t('Tải URL', 'Fetch URL')}
                  </button>
                </div>
              </div>

              {/* Real-time Transformation Sliders (Scale, Y-Offset, Rotation) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-pink-500" />
                    <span className="text-xs font-black text-slate-800 dark:text-white">
                      {t('Tinh Chỉnh Dáng Đứng Trực Tiếp', 'Live Model Fine-Tuning')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {t('Tự động lưu', 'Auto-saved')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Scale */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
                      <span>{t('Kích Thước', 'Scale')}</span>
                      <span className="font-mono text-pink-500">{settings.scale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="2.5"
                      step="0.05"
                      value={settings.scale}
                      onChange={(e) => updateSetting('scale', parseFloat(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>

                  {/* Y Offset */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
                      <span>{t('Cao Độ Tiếp Đất', 'Ground Offset')}</span>
                      <span className="font-mono text-pink-500">{settings.yOffset.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-0.8"
                      max="0.8"
                      step="0.05"
                      value={settings.yOffset}
                      onChange={(e) => updateSetting('yOffset', parseFloat(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>

                  {/* Rotation */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
                      <span>{t('Xoay Hướng', 'Rotation')}</span>
                      <span className="font-mono text-pink-500">
                        {Math.round((settings.rotationY * 180) / Math.PI)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.PI * 2}
                      step="0.1"
                      value={settings.rotationY}
                      onChange={(e) => updateSetting('rotationY', parseFloat(e.target.value))}
                      className="w-full accent-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Info className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>
                  {t(
                    'Mô hình được lưu an toàn trong trình duyệt (IndexedDB), mở lại web vẫn giữ nguyên!',
                    'Model is saved in your browser (IndexedDB) and persists across reloads!'
                  )}
                </span>
              </div>

              <button
                onClick={() => {
                  soundManager.playClickSound();
                  onClose();
                }}
                className="px-5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
              >
                {t('Vào Thế Giới Chơi Ngay', 'Play In World')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
