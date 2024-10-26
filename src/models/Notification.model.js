const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Tin nhắn', 'Khuyến mãi', 'Tình trạng đơn hàng', 'Tài khoản'], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
