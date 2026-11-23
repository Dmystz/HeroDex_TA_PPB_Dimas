import { HeroModel } from "../models/heroModel.js";

export const HeroController = {
  async getAll(req, res) {
    try {
      res.json(await HeroModel.getAll());
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const hero = await HeroModel.getById(req.params.id);
      if (!hero) return res.status(404).json({ error: "Hero tidak ditemukan" });
      res.json(hero);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
};
