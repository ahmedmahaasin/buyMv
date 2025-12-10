// add products to user card

import userModel from "../models/userModel.js"

export const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    console.log("userId from middleware:", req.body.userId);

    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    // ---------------------------
    // ✔ Determine size key
    // ---------------------------
    // If frontend sends size = null → use "Default"
    const sizeKey = size ? size : "Default";

    // ---------------------------
    // ✔ Update Cart Logic
    // ---------------------------
    if (!cartData[itemId]) {
      cartData[itemId] = {}; // create product entry
    }

    if (!cartData[itemId][sizeKey]) {
      cartData[itemId][sizeKey] = 0; // create size entry
    }

    cartData[itemId][sizeKey] += 1; // increment

    // Save cart
    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({
      success: true,
      message: "Added to cart",
      cart: cartData
    });

  } catch (error) {
    console.log("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

// update user card

export const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate quantity
    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    // Check if item exists in cart
    if (!cartData[itemId]) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    // Check if size exists
    if (!cartData[itemId][size]) {
      return res.status(404).json({ success: false, message: "Size not found in cart" });
    }

    // ✔ Update or remove
    if (quantity === 0) {
      // remove size
      delete cartData[itemId][size];

      // if item has no more sizes, remove product entirely
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    // Save updated cart
    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({
      success: true,
      message: "Cart Updated",
      cart: cartData
    });

  } catch (error) {
    console.log("Update Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};


// get user card data

export const getUserCart = async(req,res) =>{
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({success: true, cartData})

    } catch (error) {
        console.log(error);
        res.json({success:false , message:message.error})
    }
}