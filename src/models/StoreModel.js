const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    store_name: { type: String, required: true},
    store_email: { type: String, required: true}, 
    phone: { type: String, required: true},
    store_address: {type: [String]},
    store_logo: {type: String},
    store_img: {type: [String]},
    description: { type: String},
    privacy_policy: { type: String},
    warranty_policy: { type: String},
    return_policy: { type: String},
    general_term: { type: String}
  },
  {
    timestamps: true
  }
);

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
