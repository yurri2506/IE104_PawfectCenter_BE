const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    admin_email: { type: String, required: true },
    admin_name: { type: String, required: true },
    admin_password: { type: String, required: true },
    role: { type: String, default: 'admin' }
  },
  {
    timestamps: true,
    collection: 'Admin'
  }
);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
