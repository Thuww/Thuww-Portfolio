import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { soundManager } from '../audio/soundManager';
import { Bot, Send, Sparkles, X, User, CornerDownLeft, Loader2 } from 'lucide-react';

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "✨ Xin chào! Mình là Navi, trợ lý AI đồng hành của Lê Thị Minh Thu (Thuww). Hãy hỏi mình về kinh nghiệm Frontend tại Ortho Fashion, các dự án AI & Deep Learning, học vấn HCMUS, hoặc cách liên hệ phỏng vấn nhé!",
      timestamp: Date.now(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Listen for open-ai-chatbot event from CyberPhone Apps
  useEffect(() => {
    const handleOpenAiChatbot = () => setIsOpen(true);
    window.addEventListener('open-ai-chatbot', handleOpenAiChatbot);
    return () => {
      window.removeEventListener('open-ai-chatbot', handleOpenAiChatbot);
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    soundManager.playClickSound();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI service');
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Non-JSON response from AI service');
      }

      const data = await response.json();
      soundManager.playChimeSound();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.reply || "✨ Mình luôn sẵn sàng hỗ trợ thông tin ứng viên cho Quý Nhà tuyển dụng!",
        timestamp: Date.now(),
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Chat error:', err);
      // Fallback friendly reply
      const fallbackMsg: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        text: "✨ Navi đây! Lê Thị Minh Thu là Frontend Developer & Cử nhân Thị giác Máy tính HCMUS, có kinh nghiệm thực chiến tại Ortho Fashion (React/Next.js/Tailwind), nghiên cứu VTON Deep Learning và điều phối STEM. Bạn có thể mở mục Hồ Sơ CV trên thanh điều hướng để xem chi tiết!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const SUGGESTED_QUESTIONS = [
    "Kinh nghiệm Frontend của Minh Thu tại Ortho?",
    "Khóa luận AI Virtual Try-On (CatVTON)?",
    "Sản phẩm Taskify và Remote Control Java?",
    "Thông tin liên hệ và cách xem CV nhanh?",
  ];

  return (
    <>
      {/* Floating Toggle Button (Stacked neatly above Island Map Button) */}
      <div className="fixed bottom-34 md:bottom-22 right-4 sm:right-6 z-40 pointer-events-auto select-none">
        <button
          id="ai-chatbot-toggle-btn"
          onClick={() => {
            soundManager.playClickSound();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all cursor-pointer backdrop-blur-xl ${
            isOpen
              ? 'bg-rose-500 text-white scale-105 ring-4 ring-rose-500/30'
              : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-pink-500/30 border border-white/20'
          }`}
          title="Trợ lý AI Navi Guide"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline">
            Navi AI Guide
          </span>
        </button>
      </div>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] rounded-3xl glass-panel flex flex-col overflow-hidden border border-white/60 dark:border-slate-700/60 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                  Navi AI Companion
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Hỏi đáp thông tin về Minh Thu (Thuww) & dự án
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClickSound();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs no-scrollbar">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isUser
                        ? 'bg-rose-500 text-white'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      isUser
                        ? 'bg-rose-500 text-white rounded-tr-xs shadow-md'
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-white/60 dark:border-slate-700/60 shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-500" />
                <span>Navi is consulting the satellite...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="p-2 border-t border-slate-200/40 dark:border-slate-700/40 bg-white/20 dark:bg-slate-900/20 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-bold glass-pill text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 bg-white/40 dark:bg-slate-900/40"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Navi a question..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-rose-500 text-white disabled:opacity-50 hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
