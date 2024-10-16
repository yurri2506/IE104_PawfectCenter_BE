const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, unique: true }, // Customer ID
    user_name: { type: String, required: true }, // Customer name
    user_password: { type: String, required: true }, // Password
    user_avt_img: { type: String }, // Avatar image
    user_email: { type: String, required: true, unique: true }, // Email
    user_phone: { type: String, required: true, unique: true }, // Phone number
    user_address: { 
        type: {
            province: { type: String, required: true }, // Province
            district: { type: String, required: true }, // District
            commune: { type: String, required: true } // Commune
        }, 
        required: true 
    }, // Address
    user_birth: { type: Date }, // Date of birth
    user_sex: { type: String, enum: ['Male', 'Female', 'Other'] } // Gender
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
