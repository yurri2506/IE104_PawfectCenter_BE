const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    user_email: { type: String, required: true, unique: true }, 
    phone: { type: String, required: true },
    user_address: { 
        type: {
            province: { type: String, required: true },
            district: { type: String, required: true }, 
            commune: { type: String, required: true } 
        }, 
        required: true 
    },
    store_img: {Type: [String]},
    description: { type: String }
  },
  {
    timestamps: true
  }
);

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
