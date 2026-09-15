import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Models static serving or 404 fallback (prevents SPA HTML fallback from corrupting 3D loaders)
const modelsDir = path.join(process.cwd(), "public", "models");
app.use("/models", express.static(modelsDir));
app.all("/models/*", (req, res) => {
  res.status(404).json({ error: "Model not found" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Chatbot endpoint with persona for Portfolio AI Companion (Navi / Pixel Companion)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Offline / Keyless intelligent fallback persona response
      const fallbackResponses: Record<string, string> = {
        quest: "🌟 Nhiệm vụ của bạn là khám phá 5 hòn đảo trên Aetheria: Giới thiệu (About), Dự án (Projects), Kỹ năng (Skills), Nhật ký (Journal), và Liên hệ (Contact)! Tích lũy XP để mở khóa hồ sơ CV!",
        project: "🚀 Minh Thư đã thực hiện nhiều sản phẩm tiêu biểu: 'Ortho Fashion' (UI Login, AI Chatbot), 'Taskify App' (React+TS Kanban kéo thả), 'Virtual Try-On AI' (CatVTON Deep Learning), 'Remote Control' (Java Socket), và 'Cờ Vua C++ SFML'!",
        skill: "⚡ Kỹ năng cốt lõi: React.js, Next.js, TypeScript, Tailwind CSS, Python (PyTorch, OpenCV), Deep Learning, C++, Java, WordPress, Canva và Điều phối STEM & SEL.",
        contact: "📬 Bạn có thể liên hệ với Minh Thu qua Email: minhthu2k33@gmail.com, Số điện thoại: 0888 392 122, hoặc GitHub: github.com/Thuww!",
        hire: "💼 Minh Thu tốt nghiệp Cử nhân Thị giác Máy tính tại HCMUS (GPA 8.35/10), có kinh nghiệm Frontend thực chiến tại Ortho Fashion và sẵn sàng cho các cơ hội nghề nghiệp mới!"
      };

      const lower = message.toLowerCase();
      let reply = "✨ Xin chào! Mình là Navi, trợ lý AI đồng hành cùng bạn trên thế giới 3D của Lê Thị Minh Thu (Thuww). Hãy hỏi mình về kinh nghiệm Frontend tại Ortho Fashion, các dự án AI/Deep Learning, hoặc học vấn và kỹ năng của Minh Thu nhé!";
      for (const [key, text] of Object.entries(fallbackResponses)) {
        if (lower.includes(key)) {
          reply = text;
          break;
        }
      }

      return res.json({ reply, source: "offline-companion" });
    }

    const systemInstruction = `You are "Navi", an intelligent, polite, and engaging AI guide for Lê Thị Minh Thu's (Thuww) 3D Interactive Portfolio.
Candidate Profile:
- Full Name: Lê Thị Minh Thư (Thuww)
- Roles: Frontend Developer • Computer Vision & AI Specialist • STEM Facilitator
- Education: Bachelor of Computer Vision, University of Science - VNUHCM (HCMUS), GPA: 8.35/10 (~3.34/4.0). Selected for Integrated Master's Program.
- Key Real Projects & Products:
  1. Ortho Fashion (ortho.fashion): Frontend Developer (intern to dev). Built modern UI Login, AI Chatbot for fashion styling, Web3 MetaMask wallet integration, responsive components in React/Next.js/Tailwind.
  2. VietHope VSDP Scholarship Portal: Dual-portal web platform for student application and AI-assisted reviewer grading.
  3. Virtual Try-On AI (HCMUS Thesis): Optimized CatVTON diffusion pipeline for virtual clothing try-on, DeepLabV3 segmentation, and NLP natural language color customization.
  4. Taskify App (thuww.github.io/React-TypeScript-Taskify): Drag-and-drop Kanban task management in React + TypeScript.
  5. Rock Paper Scissors Game: Interactive React game.
  6. Remote Control Java: Socket TCP/IP client-server application for remote desktop screen viewing and process control via PowerShell.
  7. Chess Game C++: Object-oriented chess engine built with SFML graphics and game loop.
  8. AI Search Algorithms: Pacman pathfinding with A*, BFS, DFS, Minimax, Alpha-Beta pruning.
  9. VietHope Marketing: 3+ years Designer & Video Editor for nonprofit educational programs.
  10. Kidspire Vietnam: STEM & Social-Emotional Learning (SEL) Facilitator for 740+ students and 200+ caregivers.
- Contact: minhthu2k33@gmail.com | 0888 392 122 | github.com/Thuww | linkedin.com/in/thuww
Tone: Professional, polite, friendly, and enthusiastic for recruiters and tech leads. Answer directly in Vietnamese (or English if requested), highlighting concrete achievements, tech stacks, and metrics. Keep responses concise (2-4 sentences).`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.text }],
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    const reply = response.text || "✨ Keep exploring the island, adventurer!";
    res.json({ reply, source: "gemini" });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({
      reply: "✨ Connection to the satellite drifted slightly, but Navi is still here! Feel free to explore the interactive waypoints on the island!",
      error: error?.message || "Internal error",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎮 Game Portfolio Server running on port ${PORT}`);
  });
}

startServer();
