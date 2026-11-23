import express from "express";
import { HeroController } from "../controllers/heroController.js";

const router = express.Router();

router.get("/", HeroController.getAll);
router.get("/:id", HeroController.getById);

export default router;
