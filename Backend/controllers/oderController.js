import orderModel from "../models/oderModel.js";
import userModel from "../models/userModel.js";

import productModel from "../models/productModel.js"; // make sure this points to your Products collection

export const placeOder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId)
      return res.status(400).json({ success: false, message: "User ID is required" });
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: "Cart items are required" });
    if (!amount)
      return res.status(400).json({ success: false, message: "Amount is required" });
    if (!address || Object.keys(address).length === 0)
      return res.status(400).json({ success: false, message: "Address is required" });

    // --- Reduce product quantities ---
    for (const item of items) {
      const { productId, quantity } = item;

      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${productId} not found` });
      }

      // Check if enough stock is available
      if (product.qty < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${product.name}`,
        });
      }

      // Reduce stock
      product.qty -= quantity;
      await product.save();
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Pending",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("PlaceOrder Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Place order using BML payment
export const placeOderUsingBml = async (req, res) => {
  

};



// Get all orders (Admin)
export const allOders = async (req, res) => {
  try {
  
    const orders = await orderModel.find().sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("AllOrders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get orders of a specific user (Frontend)
export const userOders = async (req, res) => {
  try {
    const { userId } = req.body; // <-- read from body instead of req.user.id
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("UserOrders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Admin)
export const updateOdersStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID and status are required" });
    }

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const prevStatus = order.status.toLowerCase();
    const newStatus = status.toLowerCase();

    const items = order.items || [];

    // If changing to "Cancelled" and it was not previously cancelled → restore stock
    if (newStatus === "cancelled" && prevStatus !== "cancelled") {
      for (const item of items) {
        const product = await productModel.findById(item.productId);
        if (product) {
          product.qty += item.quantity;
          await product.save();
        }
      }
    }

    // If changing from "Cancelled" to something else → reduce stock
    if (prevStatus === "cancelled" && newStatus !== "cancelled") {
      for (const item of items) {
        const product = await productModel.findById(item.productId);
        if (product) {
          if (product.qty < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Not enough stock for product ${product.name} to reactivate the order`,
            });
          }
          product.qty -= item.quantity;
          await product.save();
        }
      }
    }

    // Update order status
    order.status = status;
    const updatedOrder = await order.save();

    res.json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("UpdateOdersStatus Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Update payment status (Admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, payment } = req.body;

    if (!orderId || typeof payment !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Order ID and payment status (true/false) are required",
      });
    }

    // Find the order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update payment status
    order.payment = payment;
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Payment status updated to ${payment ? "Paid" : "Unpaid"}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UpdatePaymentStatus Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
