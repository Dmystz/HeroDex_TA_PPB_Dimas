import { GameModel } from "../models/gameModel.js";

export const GameController = {
  async getAll(req, res) {
    try {
      res.json(await GameModel.getAll());
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const game = await GameModel.getById(req.params.id);
      if (!game) return res.status(404).json({ error: "Game tidak ditemukan" });
      res.json(game);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },
};
