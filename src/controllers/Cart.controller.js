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
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của mã userId không có, đây là trường bắt buộc",
      });
    }

    const response = await CartService.updateCart(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi khi cập nhật cart",
    });
  }
};

const updateCart2 = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của mã userId không có, đây là trường bắt buộc",
      });
    }

    const response = await CartService.updateCart2(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi khi cập nhật cart",
    });
  }
};

const getAllProductByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await CartService.getAllProductByUserId(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const searchProductsInCart = async (req, res) => {
  const userId = req.params.userId;
  const searchQuery = req.query.q;
  try {
    const response = await CartService.searchProductsInCart(userId, searchQuery);
    return res.status(response.status === 'OK' ? 200 : 404).json(response);
  } catch (error) {
    return res.status(500).json({ status: 'ERR', message: error.message || 'Error while searching products in cart' });
  }
}

const deleteProductCart = async (req, res) => {
  const data = req.body;
  const userId = req.params.id;

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!userId || !data ) {
      return res.status(400).json({
        status: "ERR",
        message: "Dữ liệu không hợp lệ. `user_id` và `products` là bắt buộc, và `products` phải là một mảng.",
      });
    }

    // Gọi service để xử lý xóa sản phẩm
    const result = await CartService.deleteProductCart(userId, data);

    // Trả về kết quả
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi trong controller:", error.message);
    return res.status(500).json({
      status: "ERR",
      message: error.message || "Lỗi trong quá trình xóa sản phẩm khỏi giỏ hàng",
    });
  }
};

module.exports = {
  createCart,
  updateCart,
  updateCart2,
  getAllProductByUserId,
  searchProductsInCart,
  deleteProductCart,
};
