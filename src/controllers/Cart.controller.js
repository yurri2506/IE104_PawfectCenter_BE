const CartService = require("../services/Cart.service");

const createCart = async (req, res) => {
  try {
    const { user_id, products } = req.body;

    // Kiểm tra xem user_id và products có đủ thông tin cần thiết không
    if (!user_id || !products || products.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Thông tin bị thiếu",
      });
    }

    const newCartData = {
      user_id,
      products,
    };

    // Gọi đến service để tạo giỏ hàng
    const response = await CartService.createCart(newCartData);

    // Trả về phản hồi từ service
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message || "Lỗi khi tạo Cart",
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const data = req.body;
    if (!cartId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của mã cart không có, đây là trường bắt buộc",
      });
    }

    const response = await CartService.updateCart(cartId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi khi cập nhật cart",
    });
  }
};

const getDetailsCart = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await CartService.getDetailsCart(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createCart,
  updateCart,
  getDetailsCart,
};
