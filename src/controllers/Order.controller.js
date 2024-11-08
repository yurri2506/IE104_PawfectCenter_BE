const OrderService = require("../services/Order.service");
const slugify = require("slugify");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
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
      order_total_before,
      order_total_after,
      order_note,
    } = req.body;

    if (!user_id || !shipping_address || !products || products.length === 0 ) {
      return res.status(400).json({
        status: "ERR",
        message: "Thiếu thông tin cần thiết để tạo đơn hàng",
      });
    }

    const orderData = {
      discount_ids,
      user_id,
      shipping_fee,
      shipping_address,
      products,
      order_status,
      order_payment,
      order_delivery_date,
      estimated_delivery_date,
      order_total_before,
      order_total_after,
      order_note,
    };
    const response = await OrderService.createOrder(orderData);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Lỗi khi tạo đơn hàng" });
  }
};

// const updateCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const data = req.body;
//     if (!data) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "Thông tin cập nhật không có",
//       });
//     }
//     if (!categoryId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "ID danh mục sản phẩm là bắt buộc",
//       });
//     }
//     const response = await CategoryService.updateCategory(categoryId, data);
//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     if (!categoryId) {
//       return res.status(400).json({
//         status: "ERR",
//         message: "The categoryId is required",
//       });
//     }

//     const response = await CategoryService.deleteCategory(categoryId);

//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(500).json({
//       status: "ERR",
//       message: e.message || "An error occurred while deleting the category.",
//     });
//   }
// };

// const getTypeCategory = async (req, res) => {
//   try {
//     const response = await CategoryService.getTypeCategory();
//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(500).json({
//       status: "ERR",
//       message: e.message || "Error while fetching categories",
//     });}
// };

module.exports = {
  createOrder,
  // updateCategory,
  // deleteCategory,
  // getTypeCategory,
};
