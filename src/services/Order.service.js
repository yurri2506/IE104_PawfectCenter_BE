const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const Discount = require('../models/Discount.model');

// Tạo đơn hàng -- chưa test
const createOrder = (orderData) => {
  return new Promise(async (resolve, reject) => {
    const {
      discount_ids,
      user_id,
      shipping_fee,
      shipping_address,
      products,
      order_status,
      order_payment,
      order_delivery_date,
      estimated_delivery_date,
      order_note,
    } = orderData;

    try {
      // 1. Tính toán tổng giá trị đơn hàng trước khi áp dụng chiết khấu
      let orderTotalBefore = 0;
      const productDetails = await Promise.all(
        products.map(async (product) => {
          const productInfo = await Product.findById(product.product_id).populate('product_category');
          if (!productInfo) {
            return resolve({
              status: "ERR",
              message: `Không tìm thấy sản phẩm với ID: ${product.product_id}`,
            });
          }

          // Tìm giá của biến thể sản phẩm (nếu có), nếu không, dùng giá sản phẩm
          const price = productInfo.variants.find(variant => variant._id.equals(product.variant_id))?.product_price || productInfo.price;

          // Tính tổng giá trị của sản phẩm, có áp dụng chiết khấu nếu có (product.discount_percentage)
          const totalPrice = price * product.quantity * (100 - (product.discount_percentage || 0)) / 100;

          // Cộng giá trị sản phẩm vào tổng giá trị trước khi áp dụng chiết khấu
          orderTotalBefore += totalPrice;

          return {
            ...product,
            price,
            total_price: totalPrice,
            product_category: productInfo.product_category
          };
        })
      );

      // 2. Kiểm tra mã giảm giá người dùng cung cấp
      let highestProductDiscount = null;
      let highestShippingDiscount = null;

      if (discount_ids && discount_ids.length > 0) {
        const discounts = await Discount.find({ _id: { $in: discount_ids } });

        // Phân loại mã giảm giá thành product và shipping
        discounts.forEach((discount) => {
          if (discount.discount_type === 'product' && !highestProductDiscount) {
            highestProductDiscount = discount; // Áp dụng trực tiếp mã giảm giá cho sản phẩm do người dùng cung cấp
          } else if (discount.discount_type === 'shipping' && !highestShippingDiscount) {
            highestShippingDiscount = discount; // Áp dụng trực tiếp mã giảm giá cho vận chuyển do người dùng cung cấp
          }
        });
      }

      // 3. Nếu không đủ hai loại mã giảm giá, tìm kiếm mã giảm giá tốt nhất từ mã giảm giá của người dùng (`user_id`)
      if (!highestProductDiscount || !highestShippingDiscount) {
        // Lấy tất cả các mã giảm giá của người dùng từ `user_id`
        const user = await User.findById(user_id).populate('discount_ids');
        const userDiscounts = user.discount_ids || [];

        userDiscounts.forEach((discount) => {
          const applicableCondition = discount.discount_condition.find(condition => {
            // Kiểm tra điều kiện danh mục và giá trị đơn hàng
            const isCategoryMatched = condition.category_id.some(category => 
              productDetails.some(product => product.product_category && product.product_category.equals(category))
            );
            return isCategoryMatched && orderTotalBefore >= condition.price_total_order;
          });

          // Nếu điều kiện áp dụng mã giảm giá thỏa mãn
          if (applicableCondition) {
            if (discount.discount_type === 'product' && !highestProductDiscount) {
              highestProductDiscount = discount; // Cập nhật mã giảm giá cao nhất cho sản phẩm
            } else if (discount.discount_type === 'shipping' && !highestShippingDiscount) {
              highestShippingDiscount = discount; // Cập nhật mã giảm giá cao nhất cho vận chuyển
            }
          }
        });
      }

      // 4. Tính giá trị chiết khấu từ các mã giảm giá được chọn
      let productDiscountValue = 0;
      let shippingDiscountValue = 0;

      if (highestProductDiscount) {
        productDiscountValue = (orderTotalBefore * highestProductDiscount.discount_number) / 100;
      }

      if (highestShippingDiscount && shipping_fee > 0) {
        shippingDiscountValue = (shipping_fee * highestShippingDiscount.discount_number) / 100;
      }

      // 5. Tính tổng đơn hàng sau khi áp dụng chiết khấu và phí vận chuyển
      const shippingFeeAfterDiscount = Math.max(0, (shipping_fee || 0) - shippingDiscountValue);
      const orderTotalAfter = orderTotalBefore - productDiscountValue + shippingFeeAfterDiscount;

      // 6. Chuẩn bị dữ liệu để lưu đơn hàng
      const newOrderData = {
        discount_ids,
        user_id,
        shipping_fee,
        shipping_address,
        products: productDetails,
        order_status,
        order_payment,
        order_delivery_date,
        estimated_delivery_date,
        order_total_before: orderTotalBefore,
        order_total_after: orderTotalAfter,
        order_note,
        discount_applied: {
          productDiscount: highestProductDiscount ? highestProductDiscount.discount_number : 0,
          shippingDiscount: highestShippingDiscount ? highestShippingDiscount.discount_number : 0
        },
        shipping_fee_after_discount: shippingFeeAfterDiscount,
        order_total_to_pay: orderTotalAfter
      };

      // 7. Tạo và lưu đơn hàng
      const newOrderInstance = await Order.create(newOrderData);

      if (newOrderInstance) {
        return resolve({
          status: "OK",
          message: "Đơn hàng đã được tạo thành công",
          data: newOrderInstance,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi tạo đơn hàng",
      });
    }
  });
};

const updateOrder = (orderId, updateData) => {
  // Cập nhật thông tin đơn hàng
  return new Promise(async (resolve, reject) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
      if (updatedOrder) {
        return resolve({
          status: "OK",
          message: "Cập nhật đơn hàng thành công",
          data: updatedOrder,
        });
      } else {
        return resolve({
          status: "ERR",
          message: "Không tìm thấy đơn hàng để cập nhật",
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi cập nhật đơn hàng",
      });
    }
  });
};

const getOrderDetails = (orderId) => {
  // Lấy thông tin chi tiết của một đơn hàng
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId).populate('user_id products.product_id');
      if (order) {
        return resolve({
          status: "OK",
          message: "Lấy thông tin chi tiết đơn hàng thành công",
          data: order,
        });
      } else {
        return resolve({
          status: "ERR",
          message: "Không tìm thấy đơn hàng",
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi lấy thông tin chi tiết đơn hàng",
      });
    }
  });
};

const getUserOrders = (userId, status) => {
  // Lấy danh sách đơn hàng của người dùng (có thể lọc theo trạng thái)
  return new Promise(async (resolve, reject) => {
    try {
      let filter = { user_id: userId };
      if (status) {
        filter.order_status = status; // Nếu có trạng thái, lọc theo trạng thái
      }

      const orders = await Order.find(filter).populate('products.product_id');
      return resolve({
        status: "OK",
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi lấy danh sách đơn hàng",
      });
    }
  });
};

module.exports = {
  createOrder,
  updateOrder,
  getOrderDetails,
  getUserOrders,
};
