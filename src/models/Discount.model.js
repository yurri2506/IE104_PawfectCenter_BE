const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    discount_title: { type: String, required: true },
    discount_type: {
      type: String,
      enum: ["shipping", "voucher"],
      required: true,
    },
    discount_description: { type: String },
    discount_start_day: { type: Date },
    discount_end_day: { type: Date },
    discount_amount: { type: Number },
    is_displayed: { type: Boolean, default: false },
    discount_number: { type: Number, required: true }, // phần trăm giảm giá
    discount_condition: [
      {
        price_total_order: { type: Number, required: true },
        category_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
  {
    collection: "Discount",
  }
);

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
