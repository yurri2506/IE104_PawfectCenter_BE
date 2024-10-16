const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    admin_id: {Type: Number, require},
    name: { type: String, required: true },
    password: { type: String, required: true },
    //role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
  },
  {
    timestamps: true
  }
);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
