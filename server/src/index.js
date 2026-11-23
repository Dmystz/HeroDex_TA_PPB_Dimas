import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import heroRoutes from "./routes/heroRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { isSupabaseConfigured } from "./config/supabaseClient.js";

dotenv.config();

const app = express();

const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ name: "HeroDex API", status: "ok", supabaseConfigured: isSupabaseConfigured })
);
app.use("/api/heroes", heroRoutes);
app.use("/api/games", gameRoutes);

app.use((req, res) => res.status(404).json({ error: "Endpoint tidak ditemukan" }));

// Di Vercel server dijalankan oleh platform, jadi listen hanya untuk lokal.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;