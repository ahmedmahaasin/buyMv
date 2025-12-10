import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  image: { type: [String], }, // array of image URLs
  bg_video_Link: { type: String, required: true }, // video link
  Text1: { type: String, }, // heading 1
  Text2: { type: String,  }, // heading 2
  Text3: { type: String, }, // paragraph text
  btn_Name: { type: String, default: "" }, // button label (optional)
  btn_Link: { type: String, default: "" }, // button link (optional)
});

const heroModel =
  mongoose.models.hero_section || mongoose.model("hero_section", heroSchema);

export default heroModel;
