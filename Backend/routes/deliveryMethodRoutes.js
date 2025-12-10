import express from "express";
import upload from "../middleware/multer.js";
import {
  addDeliveryMethod,
  listDeliveryMethods,
  removeDeliveryMethod,
  singleDeliveryMethod,
  updateDeliveryMethod
} from "../controllers/deliveryMethodController.js";
import adminAuth from "../middleware/adminAuth.js";

const deliveryRouter = express.Router();  // ✅ Define router

// Add Delivery Method
deliveryRouter.post("/add",adminAuth, upload.array("images", 5), addDeliveryMethod);

// List Delivery Methods
deliveryRouter.get("/list", listDeliveryMethods);

// Get Single Delivery Method
deliveryRouter.post("/single", singleDeliveryMethod);

// Remove Delivery Method
deliveryRouter.post("/remove",adminAuth, removeDeliveryMethod);

// Update Delivery Method
deliveryRouter.put("/update/:id",adminAuth, upload.array("images", 5), updateDeliveryMethod);

export default deliveryRouter;
