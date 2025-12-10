import express from "express";
import { addBrand, listBrands, removeBrand, singleBrand, updateBrand } from "../controllers/brandController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const brandRouter = express.Router();

// Add brand with single image
brandRouter.post("/add",adminAuth, upload.single("Brand_image"), addBrand);

// Remove brand by ID
brandRouter.post("/remove",adminAuth, removeBrand);

// Get single brand by ID (POST method)
brandRouter.post("/single", singleBrand);

// List all brands
brandRouter.get("/list", listBrands);


// Update brand (optional new image)
brandRouter.put("/update/:id", adminAuth, upload.single("Brand_image"), updateBrand);

export default brandRouter;
