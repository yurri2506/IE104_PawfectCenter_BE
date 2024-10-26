const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    product_category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    pet_age: {type: Number, required: true},
    product_color: { type: String },
    product_weight: { type: String }, 
    product_size: { type: String }, 
    variant_img: { type: String }, 
    product_price: { type: Number, required: true },
    product_countInStock: { type: Number, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    product_title: { type: String, required: true },
    product_img: { type: [String] }, 
    product_description: { type: String, required: true },
    product_display: { type: Boolean, required: true, default: false },
    product_famous: { type: Boolean, required: true, default: false }, 
    product_rate: { type: Number },
    product_feedback: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Feedback" },
    ],
    product_selled: { type: Number, required: true }, 
    product_percent_discount: { type: Number }, 
    is_delete: { type: Boolean, default: false }, 
    variants: [variantSchema],
    product_category: {}
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
