import express from "express";
import { addHero, listHeroes, singleHero, removeHero, updateHero } from "../controllers/heroController.js";
import upload from "../middleware/multer.js"; // for file uploads
import adminAuth from "../middleware/adminAuth.js";

const heroRouter = express.Router();

// Add Hero (single image)
heroRouter.post("/add",adminAuth, upload.single("image"), addHero);

// List all Heroes
heroRouter.get("/list", listHeroes);

// Get single Hero
heroRouter.get("/single/:id", singleHero);

// Remove Hero
heroRouter.post("/remove/:id",adminAuth, removeHero);


// Update Hero (single image)
heroRouter.put("/update/:id",adminAuth, upload.single("image"), updateHero);

export default heroRouter;
