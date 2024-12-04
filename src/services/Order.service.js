const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const Discount = require("../models/Discount.model");
const Cart = require("../models/Cart.model");
const CartService = require("../services/Cart.service");

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
            throw new Error(
              `Không tìm thấy sản phẩm với ID: ${product.product_id}`
            );
          }

          const variant = productInfo.variants.find((v) =>
            v._id.equals(product.variant)
          );
          let price = variant
            ? variant.product_price
            : productInfo.product_price;

          if (isNaN(price)) {
            throw new Error(
              `Giá sản phẩm với ID ${product.product_id} không hợp lệ.`
            );
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
                shippingDiscountValue +=
                  (shipping_fee * discount.discount_number) / 100;
              }
            });
          } else if (discount.discount_type === "product") {
            // Áp dụng giảm giá cho sản phẩm nếu thoả điều kiện
            discount.discount_condition.forEach((condition) => {
              if (orderTotalBeforeDiscount >= condition.price_total_order) {
                productDetails.forEach((product) => {
                  if (
                    condition.category_id.includes(
                      product.product_category.toString()
                    )
                  ) {
                    productDiscountValue +=
                      (product.total_price * discount.discount_number) / 100;
                  }
                });
              }
            });
          }
        });
      }

      // Bước 3: Tính tổng đơn hàng sau khi áp dụng giảm giá
      const shippingFeeAfterDiscount = Math.max(
        0,
        shipping_fee - shippingDiscountValue
      );
      const orderTotalAfterDiscount =
        orderTotalBeforeDiscount -
        productDiscountValue +
        shippingFeeAfterDiscount;

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

        // Cập nhật số lượng sản phẩm và biến thể, cập nhật product_selled
        await Promise.all(
          products.map(async (product) => {
            const productInfo = await Product.findById(product.product_id);
            if (productInfo) {
              const variantIndex = productInfo.variants.findIndex((v) =>
                v._id.equals(product.variant)
              );
              if (variantIndex !== -1) {
                productInfo.variants[variantIndex].product_countInStock -=
                  product.quantity;
              }
              productInfo.product_selled += product.quantity;
              // Cập nhật tổng số lượng tồn kho của sản phẩm từ các biến thể
              productInfo.product_countInStock = productInfo.variants.reduce(
                (acc, variant) => acc + variant.product_countInStock,
                0
              );
              await productInfo.save();
            }
          })
        );

        // Bước 5: Cập nhật giỏ hàng của người dùng, đặt số lượng = 0 cho các sản phẩm đã mua
        const cart = await Cart.findOne({ user_id: user_id });
        if (cart) {
          await CartService.updateCart(cart._id, {
            products: products.map((product) => ({
              product_id: product.product_id,
              variant: product.variant,
              quantity: 0,
            })),
          });
        }
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

const previewOrder = async (newOrder) => {
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
            throw new Error(
              `Không tìm thấy sản phẩm với ID: ${product.product_id}`
            );
          }

          const variant = productInfo.variants.find((v) =>
            v._id.equals(product.variant)
          );
          let price = variant
            ? variant.product_price
            : productInfo.product_price;

          if (isNaN(price)) {
            throw new Error(
              `Giá sản phẩm với ID ${product.product_id} không hợp lệ.`
            );
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
                shippingDiscountValue +=
                  (shipping_fee * discount.discount_number) / 100;
              }
            });
          } else if (discount.discount_type === "product") {
            // Áp dụng giảm giá cho sản phẩm nếu thoả điều kiện
            discount.discount_condition.forEach((condition) => {
              if (orderTotalBeforeDiscount >= condition.price_total_order) {
                productDetails.forEach((product) => {
                  if (
                    condition.category_id.includes(
                      product.product_category.toString()
                    )
                  ) {
                    productDiscountValue +=
                      (product.total_price * discount.discount_number) / 100;
                  }
                });
              }
            });
          }
        });
      }

      // Bước 3: Tính tổng đơn hàng sau khi áp dụng giảm giá
      const shippingFeeAfterDiscount = Math.max(
        0,
        shipping_fee - shippingDiscountValue
      );
      const orderTotalAfterDiscount =
        orderTotalBeforeDiscount -
        productDiscountValue +
        shippingFeeAfterDiscount;

      // Chuẩn bị dữ liệu để xem trước đơn hàng
      const previewOrderData = {
        discount_ids,
        user_id,
        shipping_fee: shippingFeeAfterDiscount,
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

      // Trả về dữ liệu để xem trước đơn hàng mà không lưu vào database
      return resolve({
        status: "OK",
        message: "Xem trước đơn hàng thành công",
        data: previewOrderData,
      });
    } catch (e) {
      return reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi xem trước đơn hàng",
      });
    }
  });
};

const updateOrder = async (orderId, updatedData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return {
        status: "ERR",
        message: "ID đơn hàng không hợp lệ",
      };
    }

    // Lấy thông tin đơn hàng hiện tại
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return {
        status: "ERR",
        message: "Không tìm thấy đơn hàng để cập nhật",
      };
    }

    // Nếu trạng thái thay đổi thành "Hủy hàng" hoặc "Hoàn hàng"
    if (
      updatedData.order_status &&
      ["Hủy hàng", "Hoàn hàng"].includes(updatedData.order_status)
    ) {
      const products = existingOrder.products;

      // Duyệt qua các sản phẩm và thêm lại số lượng kho
      await Promise.all(
        products.map(async (product) => {
          const productInfo = await Product.findById(product.product_id);

          if (!productInfo) {
            throw new Error(
              `Không tìm thấy sản phẩm với ID: ${product.product_id}`
            );
          }

          // Tìm biến thể dựa trên variant_id
          const variantIndex = productInfo.variants.findIndex((v) =>
            v._id.equals(product.variant)
          );

          if (variantIndex === -1) {
            throw new Error(
              `Không tìm thấy biến thể với ID: ${product.variant} của sản phẩm ${product.product_id}`
            );
          }

          // Thêm số lượng kho của biến thể
          productInfo.variants[variantIndex].product_countInStock +=
            product.quantity;

          // Lưu thay đổi vào cơ sở dữ liệu
          await productInfo.save();
        })
      );
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        ...updatedData,
        order_status: updatedData.order_status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    

    if (!updatedOrder) {
      return {
        status: "ERR",
        message: "Không tìm thấy đơn hàng để cập nhật",
      };
    }

    return {
      status: "OK",
      message: `Đơn hàng đã được cập nhật trạng thái: ${updatedData.order_status}`,
      data: updatedOrder,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi cập nhật đơn hàng",
    };
  }
};

const getOrderDetails = async (orderId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return {
        status: "ERR",
        message: "ID đơn hàng không hợp lệ",
      };
    }

    const orderDetails = await Order.findById(orderId);

    if (!orderDetails) {
      return {
        status: "ERR",
        message: "Không tìm thấy đơn hàng",
      };
    }

    return {
      status: "OK",
      message: "Lấy thông tin đơn hàng thành công",
      data: orderDetails,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi lấy thông tin đơn hàng",
    };
  }
};

const getOrdersByStatus = async (orderStatus, userId) => {
  try {
    let filter = {};

    // Xử lý lọc theo orderStatus
    if (orderStatus) {
      if (orderStatus.toLowerCase() === "all") {
        filter = {}; // Lấy tất cả đơn hàng
      } else if (
        [
          "Chờ xác nhận",
          "Đang chuẩn bị hàng",
          "Đang giao",
          "Giao hàng thành công",
          "Hoàn hàng",
          "Hủy hàng",
        ].includes(orderStatus)
      ) {
        filter.order_status = orderStatus; // Lọc theo trạng thái đơn hàng
      } else {
        throw new Error(
          "Không có đơn hàng thuộc trạng thái đã yêu cầu hoặc trạng thái không hợp lệ"
        );
      }
    }

    // Xử lý lọc theo userId (chỉ thêm nếu userId được cung cấp)
    if (userId) {
      filter.user_id = userId;
    }

    // Tìm đơn hàng theo filter
    const orders = await Order.find(filter);

    if (orders.length === 0) {
      throw new Error("Không có đơn hàng thỏa mãn yêu cầu");
    }

    return {
      status: "OK",
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    throw new Error(
      error.message || "Đã xảy ra lỗi khi lấy danh sách đơn hàng"
    );
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrderDetails,
  // getUserOrders,
  previewOrder,
  getOrdersByStatus,
};
