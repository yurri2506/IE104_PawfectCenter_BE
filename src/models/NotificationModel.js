const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    notification_id: { Type: Number, required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['message', 'alert', 'update'], required: true },
    content: { type: String, required: true },
    notification_img: { type: String }, // Mảng chứa nhiều hình ảnh
    isRead: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
