const mongoose = require('mongoose');

const favoritedSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Favorited = mongoose.model('Favorited', favoritedSchema);
module.exports = Favorited;
