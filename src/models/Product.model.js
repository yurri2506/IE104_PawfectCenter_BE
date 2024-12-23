const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    product_order_type: { type: String }, // mới thêm, oke không???
    variant_img: { type: String },
    product_price: { type: Number, required: true, default: 0 },
    product_countInStock: { type: Number, required: true, default: 0},
  }
);
  
const productSchema = new mongoose.Schema(
  {
    product_title: { type: String, required: true },
    product_category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    product_images: { type: [String] },
    product_brand: { type: String, required: true }, // mới thêm, oke không???
    product_description: { type: String, required: true },
    product_display: { type: Boolean, required: true, default: true },
    product_famous: { type: Boolean, required: true, default: false },
    product_rate: { type: Number },
    product_feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
    product_selled: { type: Number, required: false },
    product_percent_discount: { type: Number },
    product_price: { type: Number, required: true, default: 0},
    product_countInStock: { type: Number, required: true, default: 0 },
    is_delete: { type: Boolean, default: false },
    variants: [variantSchema],
    slug: { 
      type: String,
      unique: true, 
      required: true, 
      default: function() { return ""; } // Đảm bảo `slug` không bị lưu null
    },
  },
  {
    timestamps: true,
    collection: "Product"
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
