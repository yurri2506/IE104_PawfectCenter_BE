const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category_title: {
      type: String,
      required: true,
    },
    category_parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, 
    },
    slug: { 
      type: String, 
      slug: "title",  //San pham 1 
      unique: true
    },
    category_level: {
      type: Number,
      required: true,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'Category'
  }
);

module.exports = mongoose.model("Category", CategorySchema);
