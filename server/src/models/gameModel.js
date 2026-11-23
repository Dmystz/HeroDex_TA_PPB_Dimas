import { supabase } from "../config/supabaseClient.js";

const COLS = "id, title, genre, image, description";

export const GameModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("games")
      .select(COLS)
      .order("id");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("games")
      .select(COLS)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data; // null jika tidak ada
  },
};
