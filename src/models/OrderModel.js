const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    order_id: { Type: Number, required: true},
    discount_ids: [{ 
      type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId để tham chiếu đến collection Discount
      ref: 'Discount', // Tham chiếu đến collection Discount
      required: false // Không bắt buộc, có thể không có mã giảm giá
    }],
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true // Mã khách hàng, bắt buộc và là khóa ngoại 
    },
    shipping_address: {
      fullname: { type: String, required: true }, // Tên đầy đủ
      phone: { type: String, required: true }, // Số điện thoại
      address: {
        home_number: {type: Number},// số nhà
        province: { type: String, required: true }, // Tỉnh
        district: { type: String, required: true }, // Huyện
        commune: { type: String, required: true } // Xã
      },
      required: true 
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // ID sản phẩm
        quantity: { type: Number, required: true, default: 1}, // Số lượng sản phẩm
        model: {type: String},
        status: { 
          type: String, 
          enum: ['Giao hàng thành công', 'Hoàn hàng'], 
        }
      }
    ],
    order_status: { 
      type: String, 
      enum: ['Chờ xác nhận','Đang chuẩn bị hàng', 'Đang giao', 'Giao hàng thành công', 'Hoàn hàng'], 
      default: 'Chờ xác nhận' // Trạng thái của từng sản phẩm
    },
    order_payment: { 
      type: String, 
      enum: ['credit_card', 'paypal', 'cod'], 
      required: true, // Hình thức thanh toán, bắt buộc 
      default: 'cod'
    },
    order_delivery_date: { 
      type: Date // Ngày giao hàng 
    },
    order_total_before: { 
      type: Number, 
      required: true // Tổng tiền trước khi giảm giá, bắt buộc 
    },
    order_total_after: { 
      type: Number, 
      required: true // Tổng tiền sau khi giảm giá, bắt buộc 
    }
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
