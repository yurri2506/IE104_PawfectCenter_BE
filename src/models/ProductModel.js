const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    product_id: { type: Number, unique: true },
    product_type: { type: String, required: true },
    product_model: { type: [String], required: true }, // Sử dụng mảng cho mẫu mã
    product_name: { type: String, required: true },
    product_img: { type: [String] }, // Mảng chứa nhiều hình ảnh
    product_price: { type: Number, required: true },
    product_description: { type: String, required: true },
    product_display: { type: Boolean, required: true },
    product_countInStock: { type: Number, required: true },
    product_rate: { type: Number }, // Sẽ được tính toán từ Feedbacks
    product_feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }], // Tham chiếu đến collection Feedback
    product_selled: { type: Number, required: true },
    product_percent_discount: { type: Number }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
