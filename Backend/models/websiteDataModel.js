import mongoose from "mongoose";

const websiteDataSchema = new mongoose.Schema({
  Logo: { type: [String], required: true }, // Array of logo URLs
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  ShortDescription: { type: String, required: true }, // Fixed typo
  Contact: { type: String, required: true },
  email: { type: String, required: true },
  Accent: { type: String,  },           // Hex color
  SecondaryAccent: { type: String,  },  // Fixed typo
  DefaultColor: { type: String,  },     // Hex color
  PriceColor: { type: String,  },       // Hex color
  Currency: { type: String, required: true },
  date: { type: Number, required: true }
}, { timestamps: true });

const websiteDataModel = mongoose.models.WebsiteData || mongoose.model('WebsiteData', websiteDataSchema);

export default websiteDataModel;
