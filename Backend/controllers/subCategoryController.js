import { v2 as cloudinary } from "cloudinary";
import subCategoryModel from "../models/subCategoryModle.js"; // fixed import

// Add Subcategory
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
      folder: "subcategories",
      resource_type: "image",
    });

    const catData = {
      cat_name,
      cat_image: result.secure_url,
      show_home: show_home === "true" || show_home === true,
      date: Date.now(),
    };

    const subcategory = new subCategoryModel(catData); // use correct model
    await subcategory.save();

    return res.status(201).json({
      success: true,
      message: "Sub Category added successfully",
      category: subcategory, // return saved subcategory
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// List all Subcategories
const listCategories = async (req, res) => {
  try {
    const subcategories = await subCategoryModel.find({});
    return res.status(200).json({ success: true, categories: subcategories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Subcategory
const removeCategory = async (req, res) => {
  try {
    const { categoryID } = req.body;

    if (!categoryID) {
      return res.status(400).json({
        success: false,
        message: "categoryID is required",
      });
    }

    const deleted = await subCategoryModel.findByIdAndDelete(categoryID);

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

// Get single Subcategory
const singleCategory = async (req, res) => {
  try {
    const categoryID = req.body.categoryID || req.params.id || req.query.id;

    if (!categoryID) {
      return res.status(400).json({
        success: false,
        message: "categoryID is required",
      });
    }

    const category = await subCategoryModel.findById(categoryID);

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

 const updateShowHome = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    let { show_home } = req.body;

    // Convert string to boolean if necessary
    if (typeof show_home === "string") {
      if (show_home.toLowerCase() === "true") show_home = true;
      else if (show_home.toLowerCase() === "false") show_home = false;
      else {
        return res.status(400).json({ success: false, message: "show_home must be boolean" });
      }
    }

    if (typeof show_home !== "boolean") {
      return res.status(400).json({ success: false, message: "show_home must be boolean" });
    }

    const updatedSubCategory = await subCategoryModel.findByIdAndUpdate(
      id,
      { show_home },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    res.json({ success: true, subCategory: updatedSubCategory });
  } catch (error) {
    console.error("Update Show Home Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  addCategory,
  listCategories,
  removeCategory,
  singleCategory,
  updateShowHome
};
