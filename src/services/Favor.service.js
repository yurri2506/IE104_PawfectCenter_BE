const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Favor = require("../models/Favor.model");

// Tạo favor
const createFavor = async (newFavor) => {
  try {
    const { user_id, products } = newFavor;

    // Kiểm tra nếu người dùng đã có giỏ hàng
    const checkUserId = await Favor.findOne({ user_id: user_id });
    if (checkUserId) {
      return {
        status: "ERR",
        message: "Người dùng đã tồn tại giỏ hàng yêu thích.",
      };
    }

    // Tạo giỏ hàng mới
    const newFavorData = await Favor.create(newFavor);

    return {
      status: "OK",
      message: "Favor đã được tạo thành công",
      data: newFavorData,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi tạo Favor",
    };
  }
};

// Sửa favor
const updateFavor = async (userId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        status: "ERR",
        message: "ID giỏ hàng không hợp lệ",
      };
    }

    const checkFavorId = await Favor.findOne({ user_id: userId });
    if (!checkFavorId) {
      return {
        status: "ERR",
        message: "Giỏ hàng yêu thích của người dùng chưa có trong dữ liệu",
      };
    }
    const updatedFavor = await Favor.findByIdAndUpdate(checkFavorId._id, data, {
      new: true,
      runValidators: true,
    });

    return {
      status: "OK",
      message: "Cập nhật Favor thành công",
      data: updatedFavor,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Lỗi trong quá trình cập nhật giỏ hàng yêu thích",
    };
  }
};

// lấy thông tin favor
const getDetailsFavor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Favor.findOne({
        user_id: id,
      })
      .populate('products.product_id', 'product_images product_title product_price product_percent_discount')
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông giỏ hàng yêu thích chi tiết thành công",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductByUserId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Favor.findOne({ user_id: id })
      .populate('products.product_id', 'product_images product_title product_percent_discount')
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông giỏ hàng yêu thích thành công",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createFavor,
  updateFavor,
  getDetailsFavor,
  getAllProductByUserId,
};
