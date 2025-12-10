import { v2 as cloudinary } from "cloudinary";
import brandModel from "../models/brandModel.js";
import fs from "fs";


// Add brand
const addBrand = async (req, res) => {
  try {
    const { Brand_name, show_home } = req.body;

    if (!Brand_name || show_home === undefined || !req.file) {
      return res.status(400).json({ success: false, message: "Brand name, show_home, and image are required" });
    }

    // Upload single image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "brands",
      resource_type: "image",
    });

    const brandData = {
      Brand_name,
      Brand_image: result.secure_url,
      show_home: show_home === "true" || show_home === true,
      date: Date.now()
    };

    console.log(brandData);

    const brand = new brandModel(brandData);
    await brand.save();

    return res.json({ success: true, message: "Brand added successfully", brand });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// List all brands
const listBrands = async (req, res) => {
  try {
    const brands = await brandModel.find({});
    res.json({ success: true, brands });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove brand
const removeBrand = async (req, res) => {
  try {
    const { brandID } = req.body;
    if (!brandID) return res.status(400).json({ success: false, message: "Brand ID is required" });

    const deleted = await brandModel.findByIdAndDelete(brandID);
    if (!deleted) return res.status(404).json({ success: false, message: "Brand not found" });

    res.json({ success: true, message: "Brand removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single brand info
const singleBrand = async (req, res) => {
  try {
    const brandID = req.body.brandID || req.params.id || req.query.id;

    if (!brandID) return res.status(400).json({ success: false, message: "Brand ID is required" });

    const brand = await brandModel.findById(brandID);
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });

    res.status(200).json({ success: true, brand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { Brand_name, show_home, remove_image } = req.body;
    const brandID = req.params.id;

    if (!brandID)
      return res.status(400).json({ success: false, message: "Brand ID is required" });

    const brand = await brandModel.findById(brandID);
    if (!brand)
      return res.status(404).json({ success: false, message: "Brand not found" });

    // Update text fields
    if (Brand_name) brand.Brand_name = Brand_name;
    if (show_home !== undefined)
      brand.show_home = show_home === "true" || show_home === true;

    // Remove image if requested
    if (remove_image === "true" || remove_image === true) {
      brand.Brand_image = "";
    }

    // Upload new image if provided
    if (req.file) {
      const filePath = req.file.path;

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "brands",
        resource_type: "image",
      });

      brand.Brand_image = result.secure_url;

      // Delete local file after upload
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await brand.save();

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    console.error("Update brand error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addBrand, listBrands, removeBrand, singleBrand, updateBrand ,  };
