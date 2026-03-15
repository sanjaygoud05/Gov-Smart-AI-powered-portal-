import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for Gemini
  app.post("/api/chat", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server." });
    }

    const { params } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent(params);
      res.json(response);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(error?.status || 500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hasApiKey: !!(process.env.GEMINI_API_KEY || process.env.API_KEY) });
  });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    try {
      // Dynamic import for Vite to avoid production runtime errors
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found, falling back to static serving (likely production).");
      app.use(express.static(path.join(__dirname, "dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
