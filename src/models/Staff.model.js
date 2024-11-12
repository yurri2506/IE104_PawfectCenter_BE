const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    staff_name: { type: String, required: true, unique: true},
    staff_email:  {type: String, required: true, unique: true},
    staff_password: { type: String, required: true },
    staff_phone: { type: String, required: true },
    staff_role: { 
        type: [String],  
        enum: ['Quản lý sản phẩm', 'Quản lý kho', 'Quản lý khách hàng', 'Quản lý feedback', 'Quản lý đơn hàng'],
        required: true 
      },
    isDelete: { type: Boolean, default: false }, 
  },
  {
    timestamps: true,
    collection: 'Staff'
  }
);

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
