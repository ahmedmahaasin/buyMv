import { v2 as cloudinary } from "cloudinary";
import categoryModel from "../models/categoryModel.js";

// Add Category
const addCategory = async (req, res) => {
  try {
    const { cat_name, show_home } = req.body;

    if (!cat_name || show_home === undefined || !req.file) {
      return res.status(400).json({
        success: false,
        message: "cat_name, show_home, and image are required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
      resource_type: "image",
    });

    const catData = {
      cat_name,
      cat_image: result.secure_url,
      show_home: show_home === "true" || show_home === true,
      date: Date.now(),
    };

    const category = new categoryModel(catData);
    await category.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      category, // fixed variable
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// List all Categories
const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Category
const removeCategory = async (req, res) => {
  try {
    const { categoryID } = req.body;

    if (!categoryID) {
      return res.status(400).json({
        success: false,
        message: "categoryID is required",
      });
    }

    const deleted = await categoryModel.findByIdAndDelete(categoryID);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category removed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Category
const singleCategory = async (req, res) => {
  try {
    const categoryID = req.body.categoryID || req.params.id || req.query.id;

    if (!categoryID) {
      return res.status(400).json({
        success: false,
        message: "categoryID is required",
      });
    }

    const category = await categoryModel.findById(categoryID);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({ success: true, category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const toggleShowHome = async (req, res) => {
  try {
    const { id } = req.params;
    const { show_home } = req.body;

    if (typeof show_home !== "boolean") {
      return res.status(400).json({ success: false, message: "show_home must be boolean" });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { show_home },
      { new: true }
    );

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

export {
  addCategory,
  listCategories,
  removeCategory,
  singleCategory,
  toggleShowHome
};
