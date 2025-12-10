
import heroModel from "../models/heroModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add Hero
const addHero = async (req, res) => {
  try {
    const { bg_video_Link, Text1, Text2, Text3, btn_Name, btn_Link } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "hero",
    });

    const heroData = new heroModel({
      image: [result.secure_url], // store as array
      bg_video_Link,
      Text1,
      Text2,
      Text3,
      btn_Name: btn_Name || "",
      btn_Link: btn_Link || "",
      date: Date.now(),
    });

    await heroData.save();

    res.status(201).json({ success: true, message: "Hero added", hero: heroData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List Heroes
const listHeroes = async (req, res) => {
  try {
    const heroes = await heroModel.find({});
    res.status(200).json({ success: true, heroes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Single Hero
const singleHero = async (req, res) => {
  try {
    const heroID = req.params.id || req.body.heroID || req.query.id;
    if (!heroID) return res.status(400).json({ success: false, message: "Hero ID required" });

    const hero = await heroModel.findById(heroID);
    if (!hero) return res.status(404).json({ success: false, message: "Hero not found" });

    res.status(200).json({ success: true, hero });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove Hero
const removeHero = async (req, res) => {
try {
  const heroID = req.params.id; // get ID from URL
  if (!heroID) return res.status(400).json({ success: false, message: "Hero ID required" });

  const hero = await heroModel.findById(heroID);
  if (!hero) return res.status(404).json({ success: false, message: "Hero not found" });

  // Remove the image
  hero.image = []; // use null if it's a single image
  await hero.save();

  res.status(200).json({ success: true, message: "Hero image removed successfully" });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, message: error.message });
}


};

// Update Hero
const updateHero = async (req, res) => {
  try {
    const heroID = req.params.id;
    if (!heroID) return res.status(400).json({ success: false, message: "Hero ID required" });

    let updateData = { ...req.body };

    // If a new image is uploaded, replace the old one
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "hero",
      });
      updateData.image = [result.secure_url];
    }

    const updatedHero = await heroModel.findByIdAndUpdate(heroID, updateData, { new: true });
    if (!updatedHero) return res.status(404).json({ success: false, message: "Hero not found" });

    res.status(200).json({ success: true, message: "Hero updated", hero: updatedHero });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addHero, listHeroes, singleHero, removeHero, updateHero };
