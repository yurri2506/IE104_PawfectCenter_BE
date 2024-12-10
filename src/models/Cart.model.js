const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
        variant: { type: mongoose.Schema.Types.ObjectId, required: true },
        product_price: { type: Number, required: true, default: 1 },
        product_order_type: {type: String, required: true}
      }
    ]
  },
  {
    timestamps: true,
    collection: "Cart"
  }
);

cartSchema.set('toJSON', { virtuals: true }); // Để virtuals có thể hiển thị

// Cấm Mongoose tạo _id cho các phần tử trong mảng 'products'
cartSchema.options.toJSON.transform = function (doc, ret) {
  ret.products = ret.products.map(product => {
    delete product._id; // Xóa _id nếu có
    return product;
  });
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;