const FeedbackService = require("../services/Feedback.service");

const createFeedback = async (req, res) => {
  try {
    const {
      product_id,
      variant_id,
      order_id,
      user_id,
      content,
      rating,
    } = req.body;

    if (!product_id) {
      return res.status(200).json({
        status: "ERR",
        message: "Mã sản phẩm là bắt buộc",
      });
    }

    // if (!variant_id) {
    //   return res.status(200).json({
    //     status: "ERR",
    //     message: "Biến thể của sản phẩm là bắt buộc",
    //   });
    // }

    if (!order_id) {
      return res.status(200).json({
        status: "ERR",
        message: "Mã đơn hàng là bắt buộc",
      });
    }

    if (!user_id) {
      return res.status(200).json({
        status: "ERR",
        message: "Mã người dùng là bắt buộc",
      });
    }

    if (!content) {
      return res.status(200).json({
        status: "ERR",
        message: "Nội dung feedback từ người dùng là bắt buộc",
      });
    }

    if (!rating) {
      return res.status(200).json({
        status: "ERR",
        message: "Số sao đánh giá là bắt buộc",
      });
    }

    const newFeedbackData = {
      product_id,
      variant_id,
      order_id,
      user_id,
      content,
      feedback_img,
      rating,
    };

    const response = await FeedbackService.createFeedback(newFeedbackData);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Lỗi khi tạo feedback" });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    if (!feedbackId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của mã feedback không có, đây là trường bắt buộc",
      });
    }

    // Xử lý ảnh feedback_img nếu có trong yêu cầu cập nhật
    let feedback_img = req.files["feedback_img"]?.map((file) => {
      return file.buffer.toString("base64");
    });

    // Xây dựng dữ liệu cập nhật
    const updateData = { ...req.body };

    // Chỉ thêm feedback_img vào updateData nếu có ảnh mới
    if (feedback_img && feedback_img.length > 0) {
      updateData.feedback_img = feedback_img;
    }

    const response = await FeedbackService.updateFeedback(feedbackId, updateData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi khi cập nhật feedback",
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    if (!feedbackId) {
      return res.status(400).json({
        status: "ERR",
        message: "The feedbackId is required",
      });
    }

    const response = await FeedbackService.deleteFeedback(feedbackId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "An error occurred while deleting the feedback.",
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId in Feedback is required",
      });
    }
    const response = await FeedbackService.getAllFeedback(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
};
