const FavorService = require("../services/Favor.service");

const createFavor = async (req, res) => {
  try {
    const { user_id, products } = req.body;

    // Kiểm tra xem user_id và products có đủ thông tin cần thiết không
    if (!user_id || !products || products.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Thông tin bị thiếu",
      });
    }

    const newFavorData = {
      user_id,
      products,
    };

    // Gọi đến service để tạo giỏ hàng
    const response = await FavorService.createFavor(newFavorData);

    // Trả về phản hồi từ service
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message || "Lỗi khi tạo Favor",
    });
  }
};

const updateFavor = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của mã favor không có, đây là trường bắt buộc",
      });
    }

    const response = await FavorService.updateFavor(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi khi cập nhật favor",
    });
  }
};

const getDetailsFavor = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await FavorService.getDetailsFavor(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
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
    const response = await FavorService.getAllProductByUserId(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

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
    const result = await FavorService.deleteProductCart(userId, data);

    // Trả về kết quả
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi trong controller:", error.message);
    return res.status(500).json({
      status: "ERR",
      message: error.message || "Lỗi trong quá trình xóa sản phẩm khỏi yêu thích",
    });
  }
};

module.exports = {
  createFavor,
  updateFavor,
  getDetailsFavor,
  getAllProductByUserId,
  deleteProductCart,
};
