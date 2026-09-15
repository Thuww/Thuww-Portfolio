var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var geminiClient = null;
function getGeminiClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}
var modelsDir = import_path.default.join(process.cwd(), "public", "models");
app.use("/models", import_express.default.static(modelsDir));
app.all("/models/*", (req, res) => {
  res.status(404).json({ error: "Model not found" });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackResponses = {
        quest: "\u{1F31F} Nhi\u1EC7m v\u1EE5 c\u1EE7a b\u1EA1n l\xE0 kh\xE1m ph\xE1 5 h\xF2n \u0111\u1EA3o tr\xEAn Aetheria: Gi\u1EDBi thi\u1EC7u (About), D\u1EF1 \xE1n (Projects), K\u1EF9 n\u0103ng (Skills), Nh\u1EADt k\xFD (Journal), v\xE0 Li\xEAn h\u1EC7 (Contact)! T\xEDch l\u0169y XP \u0111\u1EC3 m\u1EDF kh\xF3a h\u1ED3 s\u01A1 CV!",
        project: "\u{1F680} Minh Thu \u0111\xE3 th\u1EF1c hi\u1EC7n nhi\u1EC1u s\u1EA3n ph\u1EA9m ti\xEAu bi\u1EC3u: 'Ortho Fashion' (UI Login, AI Chatbot), 'Taskify App' (React+TS Kanban k\xE9o th\u1EA3), 'Virtual Try-On AI' (CatVTON Deep Learning), 'Remote Control' (Java Socket), v\xE0 'C\u1EDD Vua C++ SFML'!",
        skill: "\u26A1 K\u1EF9 n\u0103ng c\u1ED1t l\xF5i: React.js, Next.js, TypeScript, Tailwind CSS, Python (PyTorch, OpenCV), Deep Learning, C++, Java, WordPress, Canva v\xE0 \u0110i\u1EC1u ph\u1ED1i STEM & SEL.",
        contact: "\u{1F4EC} B\u1EA1n c\xF3 th\u1EC3 li\xEAn h\u1EC7 v\u1EDBi Minh Thu qua Email: minhthu2k33@gmail.com, S\u1ED1 \u0111i\u1EC7n tho\u1EA1i: 0888 392 122, ho\u1EB7c GitHub: github.com/Thuww!",
        hire: "\u{1F4BC} Minh Thu t\u1ED1t nghi\u1EC7p C\u1EED nh\xE2n Th\u1ECB gi\xE1c M\xE1y t\xEDnh t\u1EA1i HCMUS (GPA 8.35/10), c\xF3 kinh nghi\u1EC7m Frontend th\u1EF1c chi\u1EBFn t\u1EA1i Ortho Fashion v\xE0 s\u1EB5n s\xE0ng cho c\xE1c c\u01A1 h\u1ED9i ngh\u1EC1 nghi\u1EC7p m\u1EDBi!"
      };
      const lower = message.toLowerCase();
      let reply2 = "\u2728 Xin ch\xE0o! M\xECnh l\xE0 Navi, tr\u1EE3 l\xFD AI \u0111\u1ED3ng h\xE0nh c\xF9ng b\u1EA1n tr\xEAn th\u1EBF gi\u1EDBi 3D c\u1EE7a L\xEA Th\u1ECB Minh Thu (Thuww). H\xE3y h\u1ECFi m\xECnh v\u1EC1 kinh nghi\u1EC7m Frontend t\u1EA1i Ortho Fashion, c\xE1c d\u1EF1 \xE1n AI/Deep Learning, ho\u1EB7c h\u1ECDc v\u1EA5n v\xE0 k\u1EF9 n\u0103ng c\u1EE7a Minh Thu nh\xE9!";
      for (const [key, text] of Object.entries(fallbackResponses)) {
        if (lower.includes(key)) {
          reply2 = text;
          break;
        }
      }
      return res.json({ reply: reply2, source: "offline-companion" });
    }
    const systemInstruction = `You are "Navi", an intelligent, polite, and engaging AI guide for L\xEA Th\u1ECB Minh Thu's (Thuww) 3D Interactive Portfolio.
Candidate Profile:
- Full Name: L\xEA Th\u1ECB Minh Thu (Thuww)
- Roles: Frontend Developer \u2022 Computer Vision & AI Specialist \u2022 STEM Facilitator
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
    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.text }]
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 300
      }
    });
    const reply = response.text || "\u2728 Keep exploring the island, adventurer!";
    res.json({ reply, source: "gemini" });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({
      reply: "\u2728 Connection to the satellite drifted slightly, but Navi is still here! Feel free to explore the interactive waypoints on the island!",
      error: error?.message || "Internal error"
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F3AE} Game Portfolio Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
