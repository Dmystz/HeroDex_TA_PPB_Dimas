import { supabase } from "../config/supabaseClient.js";

const COLS = "id, name, game, role, image, description";

export const HeroModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("heroes_view")
      .select(COLS)
      .order("id");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("heroes_view")
      .select(COLS)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data; // null jika tidak ada
  },
};
