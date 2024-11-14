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
    privacy_policy: { type: String}, // chính sách bảo mật
    warranty_policy: { type: String}, // chính sách bảo hành
    return_policy: { type: String}, // chính sách đổi trả
    general_term: { type: String} // điều khoản chung
  },
  {
    timestamps: true,
    collection: "Store"
  }
);

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
