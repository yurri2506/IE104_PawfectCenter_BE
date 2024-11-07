const mongoose = require("mongoose");
const Feedback = require("../models/Feedback.model");
const Category = require("../models/Category.model");

// Tạo feedback
const createFeedback = async (newFeedback) => {
  try {
    const {
      product_id,
      variant_id,
      order_id,
      user_id,
      content,
      feedback_img,
      rating,
    } = newFeedback;

    const newFeedbackData = await Feedback.create(newFeedback);

    return {
      status: "OK",
      message: "Feedback đã được tạo thành công",
      data: newFeedbackData,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi tạo Feedback",
    };
  }
};

// Sửa feedback
const updateFeedback = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "ID mã giảm giá không hợp lệ",
      };
    }

    const checkFeedback = await Feedback.findById(id);
    if (!checkFeedback) {
      return {
        status: "ERR",
        message: "ID feedback chưa có trong dữ liệu",
      };
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return {
      status: "OK",
      message: "Cập nhật feedback thành công",
      data: updatedFeedback,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Lỗi trong quá trình cập nhật feedback",
    };
  }
};

// Xóa feedback
const deleteFeedback = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkFeedback = await Feedback.findOne({
        _id: id,
      });
      if (checkFeedback === null) {
        resolve({
          status: "ERR",
          message: "The Feedback is not defined",
        });
      }

      await Feedback.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Feedback success",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Error while delete the Feedback",
      });
    }
  });
};

const getAllFeedback = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const feedbacks = await Feedback.find({ 'product_id': productId });
      
      if (!feedbacks || feedbacks.length === 0) {
        return resolve({
          status: "ERR",
          message: "Không có feedbacks nào cho sản phẩm này",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy tất cả feedbacks của sản phẩm thành công",
        data: feedbacks,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Lỗi khi lấy feedbacks của sản phẩm",
      });
    }
  });
};


module.exports = {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
};
