import DeliveryMethodsModel from "../models/delivery_methodsModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add Delivery Method
const addDeliveryMethod = async (req, res) => {
  try {
    const {
      method_name,
      service_areas,
      description,
      Delivery_charge,
      Limit_Unit_minimum,
      minimum_order_amount,
      Limit_Unit_maximum,
      maximum_order_limit,
      apply_extra_charge_minimum,
      extra_charge_amount_minimum,
      apply_extra_charge_maximum,
      extra_charge_amount_maximum,
      display,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Images are required" });
    }

    // Upload all images to Cloudinary
    const uploadedImages = [];
    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "deliveryMethods",
      });
      uploadedImages.push(result.secure_url);
    }

    const deliveryMethod = new DeliveryMethodsModel({
      image: uploadedImages,
      method_name,
      service_areas,
      description,
      Delivery_charge,
      Limit_Unit_minimum,
      minimum_order_amount,
      Limit_Unit_maximum,
      maximum_order_limit,
      apply_extra_charge_minimum,
      extra_charge_amount_minimum,
      apply_extra_charge_maximum,
      extra_charge_amount_maximum,
      display: display === "true" || display === true,
      date: Date.now(),
    });

    await deliveryMethod.save();

    return res.status(201).json({ success: true, message: "Delivery Method added", deliveryMethod });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// List Delivery Methods
const listDeliveryMethods = async (req, res) => {
  try {
    const methods = await DeliveryMethodsModel.find({});
    res.status(200).json({ success: true, methods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Delivery Method
const removeDeliveryMethod = async (req, res) => {
  try {
    const { methodID } = req.body;
    if (!methodID) return res.status(400).json({ success: false, message: "methodID required" });

    const deleted = await DeliveryMethodsModel.findByIdAndDelete(methodID);
    if (!deleted) return res.status(404).json({ success: false, message: "Delivery Method not found" });

    res.status(200).json({ success: true, message: "Delivery Method removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Delivery Method
const singleDeliveryMethod = async (req, res) => {
  try {
    const methodID = req.body.methodID || req.params.id || req.query.id;
    if (!methodID) return res.status(400).json({ success: false, message: "methodID required" });

    const method = await DeliveryMethodsModel.findById(methodID);
    if (!method) return res.status(404).json({ success: false, message: "Delivery Method not found" });

    res.status(200).json({ success: true, method });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Delivery Method
const updateDeliveryMethod = async (req, res) => {
  try {
    const methodID = req.params.id; // ✅ Use req.params.id
    if (!methodID) return res.status(400).json({ success: false, message: "methodID required" });

    let updateData = { ...req.body };

    // If images are uploaded, replace them
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "deliveryMethods",
        });
        uploadedImages.push(result.secure_url);
      }
      updateData.image = uploadedImages;
    }

    const updated = await DeliveryMethodsModel.findByIdAndUpdate(methodID, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Delivery Method not found" });

    res.status(200).json({ success: true, message: "Delivery Method updated", updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDeliveryMethod,
  listDeliveryMethods,
  removeDeliveryMethod,
  singleDeliveryMethod,
  updateDeliveryMethod,
};
