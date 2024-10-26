const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true }, 
    user_password: { type: String, required: true }, 
    user_avt_img: { type: String }, 
    user_email: { type: String, unique: true }, 
    user_phone: { type: String, unique: true }, 
    user_address: { 
      home_address: {type: String},
      province: { type: String}, 
      district: { type: String}, 
      commune: { type: String} 
    }, 
    user_birth: { type: Date }, 
    user_sex: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: "Nam" } ,
    is_delete : {type: Boolean, default: false}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
