import express from "express";
import { getFridge, saveIngredients, getMissingIngredients, saveMissingIngredients } from "../controllers/FridgeController.js";

const router = express.Router();

router.get("/missing-ingredients", getMissingIngredients);
router.post("/missing-ingredients", saveMissingIngredients);
router.get("/", getFridge);
router.post("/", saveIngredients);

export default router;
