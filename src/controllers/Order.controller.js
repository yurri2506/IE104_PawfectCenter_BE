const OrderService = require("../services/Order.service");

const createOrder = async (req, res) => {
  try {
    const {
      discount_ids,
      user_id,
      shipping_fee,
      shipping_address,
      products,
      order_payment,
      order_delivery_date,
      estimated_delivery_date,
      order_note,
    } = req.body;

    const newOrderData = {
      discount_ids,
      user_id,
      shipping_fee,
      shipping_address,
      products,
      order_payment,
      order_delivery_date,
      estimated_delivery_date,
      order_note,
    };
    const response = await OrderService.createOrder(newOrderData);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Lỗi khi tạo đơn hàng" });
  }
};

module.exports = {
  createOrder,
  // updateOrder,
  // getOrderDetails,
  // getUserOrders,
};
