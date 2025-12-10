import websiteDataModel from '../models/websiteDataModel.js'
import { v2 as cloudinary } from "cloudinary";

// Add Website Data
const addWebsiteData = async (req, res) => {
    try {
        const {
            FirstName,
            LastName,
            ShortDescription,
            Contact,
            email,
            Accent,
            SecondaryAccent,
            DefaultColor,
            PriceColor,
            Currency,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Logo image is required" });
        }

        const upload = await cloudinary.uploader.upload(req.file.path, {
            folder: "website-data",
        });

        const webData = new websiteDataModel({
            Logo: [upload.secure_url],
            FirstName,
            LastName,
            ShortDescription,
            Contact,
            email,
            Accent,
            SecondaryAccent,
            DefaultColor,
            PriceColor,
            Currency,
            date: Date.now(),
        });

        await webData.save();

        res.status(201).json({ success: true, message: "Website data added", webData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get single Website Data
const singleWebsiteData = async (req, res) => {
    try {
        const id = req.params.id || req.query.id || req.body.id;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" });

        const result = await websiteDataModel.findById(id);
        if (!result) return res.status(404).json({ success: false, message: "Data not found" });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// Remove Website Data
const removeWebsiteData = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "ID required" });

        const deleted = await websiteDataModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Data not found" });

        res.status(200).json({ success: true, message: "Data removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update Website Data
const updateWebsiteData = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ success: false, message: "ID is required" });

        let updateData = { ...req.body };

        // If new logo uploaded
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, {
                folder: "website-data",
            });
            updateData.Logo = [upload.secure_url];
        }

        const updated = await websiteDataModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) return res.status(404).json({ success: false, message: "Data not found" });

        res.status(200).json({ success: true, message: "Website data updated", data: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { addWebsiteData, singleWebsiteData, updateWebsiteData, removeWebsiteData };
