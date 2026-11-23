import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// .trim() penting: kalau env di Vercel ter-paste dengan spasi/newline di ujung,
// koneksi ke Supabase akan gagal tanpa pesan yang jelas.
const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
const supabaseKey = (process.env.SUPABASE_KEY || "").trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Jangan throw saat import: di Vercel itu membuat seluruh function crash
// (FUNCTION_INVOCATION_FAILED) dan penyebabnya sulit terlihat.
// Sebagai gantinya, error dilempar saat query dan dikirim sebagai JSON.
const client = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      if (!client) {
        throw new Error(
          "SUPABASE_URL / SUPABASE_KEY belum di-set. Tambahkan di Vercel > Project Settings > Environment Variables lalu Redeploy."
        );
      }
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);