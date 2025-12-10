import mongoose from "mongoose";

const deliveryMethodSchema = new mongoose.Schema({
  image: { type: [String], required: true }, // Array of image URLs
  method_name: { type: String, required: true },
  service_areas: { type: String, required: true },
  description: { type: String, required: true },
  Delivery_charge: { type: Number, required: true },

  Limit_Unit_minimum: { type: String, required: true },
  minimum_order_amount: { type: Number, required: true },
  Limit_Unit_maximum: { type: String },
  maximum_order_limit: { type: Number},

  apply_extra_charge_minimum: { type: Boolean, required: true },
  extra_charge_amount_minimum: { type: Number, required: true },

  apply_extra_charge_maximum: { type: Boolean},
  extra_charge_amount_maximum: { type: Number },

  display: { type: Boolean, required: true },
  date: { type: Number, required: true }
}, { timestamps: true });

const DeliveryMethodsModel = mongoose.models.DeliveryMethods || mongoose.model('DeliveryMethods', deliveryMethodSchema);

export default DeliveryMethodsModel;
