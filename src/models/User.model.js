const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  home_address: { type: String },
  province: { type: String },
  district: { type: String },
  commune: { type: String },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true }, 
    user_password: { type: String, required: true }, 
    user_avt_img: { type: String }, 
    user_email: { type: String}, 
    user_phone: { type: String}, 
    user_address: [addressSchema], 
    user_birth: { type: Date }, 
    user_sex: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: "Nam" } ,
    is_delete : {type: Boolean, default: false}
  },
  {
    timestamps: true,
    collection: 'User'
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
