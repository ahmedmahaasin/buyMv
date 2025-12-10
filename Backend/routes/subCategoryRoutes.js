import express from "express";
import { 
  addCategory, 
  listCategories, 
  removeCategory, 
  singleCategory, 
  updateShowHome
} from "../controllers/subCategoryController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

// Define a new router for subcategories
const subcategoryRouter = express.Router();

// Add Sub Category with single image
subcategoryRouter.post(
  "/add",
  adminAuth,
  upload.single("cat_image"),   // field name for image
  addCategory
);

// Remove Sub Category
subcategoryRouter.post("/remove", adminAuth, removeCategory);

// Get Single Sub Category
subcategoryRouter.post("/single", singleCategory);

// List All Sub Categories
subcategoryRouter.get("/list", listCategories);

// PATCH route to update show_home
subcategoryRouter.patch("/updateShowHome/:id", adminAuth, updateShowHome);

export default subcategoryRouter;
