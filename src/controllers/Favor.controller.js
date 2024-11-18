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
    const favorId = req.params.id;
    const data = req.body;
    if (!favorId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của mã favor không có, đây là trường bắt buộc",
      });
    }

    const response = await FavorService.updateFavor(favorId, data);
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
module.exports = {
  createFavor,
  updateFavor,
  getDetailsFavor,
};
