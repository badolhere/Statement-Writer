import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "https://rgqqkkcvgwuyvdppzvvl.supabase.co/";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncXFra2N2Z3d1eXZkcHB6dnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Nzk5MjAsImV4cCI6MjA5MDU1NTkyMH0.-8dS2FNeJL18s70iE4YOX--tYSCWYl8bWLSTGBVSlo0";
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", supabaseConnected: !!supabaseUrl });
});

// Example API route to save profile
app.post("/api/profile", async (req, res) => {
  const { profile } = req.body;
  // This is a placeholder for actual Supabase logic
  // In a real app, you'd use auth to get the user ID
  // const { data, error } = await supabase.from('profiles').upsert(profile);
  res.json({ message: "Profile received in backend", profile });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
