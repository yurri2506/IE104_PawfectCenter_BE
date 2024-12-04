const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: '{Product'},
    notify_type: { type: String, enum: ['Tin nhắn', 'Khuyến mãi', 'Tình trạng đơn hàng', 'Tài khoản', 'Sản phẩm'], required: true },
    notify_title: { type: String, required: true },
    notify_desc: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: 'Notification'
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
