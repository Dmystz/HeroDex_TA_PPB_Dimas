import express from "express";
import { GameController } from "../controllers/gameController.js";

const router = express.Router();

router.get("/", GameController.getAll);
router.get("/:id", GameController.getById);

export default router;
