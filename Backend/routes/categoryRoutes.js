import express from "express";
import { 
  addCategory, 
  listCategories, 
  removeCategory, 
  singleCategory, 
  toggleShowHome
} from "../controllers/categoryController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRouter = express.Router();

// Add Category with single image
categoryRouter.post(
  "/add",adminAuth,
  upload.single("cat_image"),   // field name for image
  addCategory
);

// Remove Category
categoryRouter.post("/remove",adminAuth, removeCategory);

// Get Single Category
categoryRouter.post("/single", singleCategory);

// List All Categories
categoryRouter.get("/list", listCategories);
// Toggle show_home
categoryRouter.patch("/updateShowHome/:id", toggleShowHome); 

export default categoryRouter;
