import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    cartData: { type: Object, default: {} } // stores cart info
}, { minimize: false, timestamps: true }); // added timestamps for createdAt & updatedAt

// Prevent model recompilation errors in hot reload / nodemon
const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
