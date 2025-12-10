import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      size: { type: String }, // optional
    }
  ],
  amount: { type: Number, required: true }, 
  address: { type: Object, required: true }, 
  status: { type: String, required: true, default: "Pending" },
  paymentMethod: { type: String, required: true },  
  payment: { type: Boolean, required: true, default: false },  
  date: { type: Date, required: true, default: Date.now },
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
