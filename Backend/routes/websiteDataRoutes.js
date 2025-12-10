import express from "express";
import multer from "multer";
import {
  addWebsiteData,
  singleWebsiteData,
  updateWebsiteData,
  removeWebsiteData,
} from "../controllers/websiteDataController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes

// Add website data (with logo)
router.post("/add", adminAuth, upload.single("Logo"), addWebsiteData);

// Get single website data
router.get("/single/:id", singleWebsiteData);

// Update website data (with optional new logo)
router.put("/update/:id", adminAuth, upload.single("Logo"), updateWebsiteData);

// Remove website data
router.post("/remove", adminAuth, removeWebsiteData);

export default router;
