import express from "express";
import { 
  addProduct, 
  listProducts, 
  removeProduct, 
  singleProduct, 
  updateProduct, 
  removeProductImage, 
  getTotalProducts
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Add product with multiple images
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
    { name: 'image6', maxCount: 1 },
    { name: 'image7', maxCount: 1 }
  ]),
  addProduct
);

// Update product by ID with optional new images
productRouter.put(
  '/update/:id',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
    { name: 'image6', maxCount: 1 },
    { name: 'image7', maxCount: 1 }
  ]),
  updateProduct
);

// Remove product by ID (POST method)
productRouter.post('/remove', adminAuth, removeProduct);

// Remove single image from product
productRouter.post('/remove-image', adminAuth, removeProductImage);

// Get single product by ID
productRouter.post('/single', singleProduct);

// List all products
productRouter.get('/list', listProducts);

productRouter.get("/total", adminAuth, getTotalProducts);

export default productRouter;
