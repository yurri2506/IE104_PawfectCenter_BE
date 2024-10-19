const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true }, // Customer name
    user_password: { type: String, required: true }, // Password
    user_avt_img: { type: String }, // Avatar image
    user_email: { type: String, unique: true }, // Email
    user_phone: { type: String, unique: true }, // Phone number
    user_address: { 
      home_number: {type: Number},
      province: { type: String}, // Province
      district: { type: String}, // District
      commune: { type: String} // Commune
    }, // Address
    user_birth: { type: Date }, // Date of birth
    user_sex: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: "Nam" } ,// Gender
    is_delete : {type: Boolean, default: false}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
