const mongoose = require('mongoose');

const favorSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      }
    ]
  },
  {
    timestamps: true,
    collection: "Favor"
  }
);

favorSchema.set('toJSON', { virtuals: true }); // Để virtuals có thể hiển thị

// Cấm Mongoose tạo _id cho các phần tử trong mảng 'products'
favorSchema.options.toJSON.transform = function (doc, ret) {
  ret.products = ret.products.map(product => {
    delete product._id; // Xóa _id nếu có
    return product;
  });
};
const Favor = mongoose.model('Favor', favorSchema);
module.exports = Favor;
