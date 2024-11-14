const OrderService = require("../services/Order.service");

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

const updateOrder = async (req, res) => {
  try {
    const response = await OrderService.updateOrder(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi cập nhật đơn hàng",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const response = await OrderService.getOrderDetails(req.params.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi lấy thông tin chi tiết đơn hàng",
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const status = req.query.status; // Trạng thái đơn hàng có thể lọc từ query
    const response = await OrderService.getUserOrders(userId, status);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi lấy danh sách đơn hàng",
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrderDetails,
  getUserOrders,
};
