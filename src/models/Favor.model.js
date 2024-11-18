const mongoose = require('mongoose');

const favorSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
        variant: {type: mongoose.Schema.Types.ObjectId, required: true}
      }
    ]
  },
  {
    timestamps: true,
    collection: "Favor"
  }
);

const Favor = mongoose.model('Favor', favorSchema);
module.exports = Favor;
