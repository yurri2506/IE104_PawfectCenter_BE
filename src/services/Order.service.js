const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const Discount = require('../models/Discount.model');
const Cart = require('../models/Cart.model');

// Tạo đơn hàng -- chưa test
const createOrder = async (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      discount_ids,
      user_id,
      shipping_fee,
      shipping_address,
      products,
      order_status = "Chờ xác nhận",
      order_payment,
      order_delivery_date,
      estimated_delivery_date,
      order_note,
    } = newOrder;

    try {
      if (!user_id || !shipping_address || !products || products.length === 0) {
        return reject({
          status: "ERR",
          message: "Thiếu thông tin cần thiết để tạo đơn hàng",
        });
      }

      // Bước 1: Duyệt qua các sản phẩm để tính giá trị trước khi giảm giá
      let orderTotalBeforeDiscount = 0;
      const productDetails = await Promise.all(
        products.map(async (product) => {
          const productInfo = await Product.findById(product.product_id);
          if (!productInfo) {
            throw new Error(`Không tìm thấy sản phẩm với ID: ${product.product_id}`);
          }

          const variant = productInfo.variants.find((v) => v._id.equals(product.variant));
          let price = variant ? variant.product_price : productInfo.product_price;

          if (isNaN(price)) {
            throw new Error(`Giá sản phẩm với ID ${product.product_id} không hợp lệ.`);
          }

          // Áp dụng giảm giá của sản phẩm nếu có
          if (productInfo.product_percent_discount) {
            price = price * (1 - productInfo.product_percent_discount / 100);
          }

          const totalPrice = price * product.quantity;
          orderTotalBeforeDiscount = orderTotalBeforeDiscount + totalPrice;

          return {
            ...product,
            price,
            total_price: totalPrice,
            product_category: productInfo.product_category,
          };
        })
      );

      // Bước 2: Kiểm tra và áp dụng các mã giảm giá
      let productDiscountValue = 0;
      let shippingDiscountValue = 0;

      if (discount_ids && discount_ids.length > 0) {
        const discounts = await Discount.find({ _id: { $in: discount_ids } });

        discounts.forEach((discount) => {
          if (discount.discount_type === "shipping" && shipping_fee > 0) {
            // Áp dụng giảm giá cho phí ship nếu thoả điều kiện
            discount.discount_condition.forEach((condition) => {
              if (orderTotalBeforeDiscount >= condition.price_total_order) {
                shippingDiscountValue += (shipping_fee * discount.discount_number) / 100;
              }
            });
          } else if (discount.discount_type === "product") {
            // Áp dụng giảm giá cho sản phẩm nếu thoả điều kiện
            discount.discount_condition.forEach((condition) => {
              if (orderTotalBeforeDiscount >= condition.price_total_order) {
                productDetails.forEach((product) => {
                  if (condition.category_id.includes(product.product_category.toString())) {
                    productDiscountValue += (product.total_price * discount.discount_number) / 100;
                  }
                });
              }
            });
          }
        });
      }

      // Bước 3: Tính tổng đơn hàng sau khi áp dụng giảm giá
      const shippingFeeAfterDiscount = Math.max(0, shipping_fee - shippingDiscountValue);
      const orderTotalAfterDiscount = orderTotalBeforeDiscount - productDiscountValue + shippingFeeAfterDiscount;

      // Chuẩn bị dữ liệu để tạo đơn hàng
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
        order_note,
        order_total_before: orderTotalBeforeDiscount,
        order_total_after: orderTotalAfterDiscount,
        discount_applied: {
          product_discount: productDiscountValue,
          shipping_discount: shippingDiscountValue,
        },
      };

      // Tạo đơn hàng mới trong database
      const newOrderDataInstance = await Order.create(newOrderData);

      if (newOrderDataInstance) {
        // Bước 4: Cập nhật số lượng mã giảm giá và số lượng sản phẩm
        if (discount_ids && discount_ids.length > 0) {
          await Discount.updateMany(
            { _id: { $in: discount_ids } },
            { $inc: { discount_amount: -1 } }
          );
        }

        // Cập nhật số lượng sản phẩm và biến thể
        await Promise.all(
          products.map(async (product) => {
            const productInfo = await Product.findById(product.product_id);
            if (productInfo) {
              const variantIndex = productInfo.variants.findIndex((v) => v._id.equals(product.variant));
              if (variantIndex !== -1) {
                productInfo.variants[variantIndex].product_countInStock -= product.quantity;
              }
              await productInfo.save();
            }
          })
        );

        // Bước 5: Cập nhật giỏ hàng của người dùng, đặt số lượng = 0 cho các sản phẩm đã mua
        await Promise.all(
          products.map(async (product) => {
            await Cart.updateOne(
              { user_id: user_id },
              {
                $set: {
                  "products.$[elem].quantity": 0,
                },
              },
              {
                arrayFilters: [
                  {
                    "elem.product_id": product.product_id,
                    "elem.variant": product.variant,
                  },
                ],
              }
            );
          })
        );

        return resolve({
          status: "OK",
          message: "Đơn hàng đã được tạo thành công",
          data: newOrderDataInstance,
        });
      }
    } catch (e) {
      return reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi tạo đơn hàng",
      });
    }
  });
};

module.exports = {
  createOrder,
  // updateOrder,
  // getOrderDetails,
  // getUserOrders,
};
