const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    discount_id: { Type: Number, required: true},
    name: { type: String, required: true },
    discount_type: { type: String, enum: ['Oder', 'Account', 'Discount'], required: true },
    description: { type: String },
    start_day: { type: Date },
    end_day: { type: Date },
    amount: { type: Number },
    is_displayed: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

const Discount = mongoose.model('Discount', discountSchema);
module.exports = Discount;
