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
const updateFavor = async (favorId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(favorId)) {
      return {
        status: "ERR",
        message: "ID giỏ hàng không hợp lệ",
      };
    }

    const checkFavorId = await Favor.findOne({ _id: favorId });
    if (!checkFavorId) {
      return {
        status: "ERR",
        message: "Giỏ hàng yêu thích của người dùng chưa có trong dữ liệu",
      };
    }

    // Duyệt qua các sản phẩm trong giỏ hàng để cập nhật hoặc thêm mới
    data.products.forEach((newProduct) => {
      const existingProductIndex = checkCartId.products.findIndex(
        (p) =>
          p.product_id.toString() === newProduct.product_id &&
          p.variant.toString() === newProduct.variant
      );

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm và biến thể đã có trong giỏ hàng, cập nhật số lượng
        checkCartId.products[existingProductIndex].quantity = newProduct.quantity;

        // Nếu số lượng bằng 0, xóa sản phẩm khỏi giỏ hàng
        if (newProduct.quantity === 0) {
          checkCartId.products.splice(existingProductIndex, 1);
        }
      } else {
        // Nếu sản phẩm và biến thể chưa có trong giỏ hàng, thêm mới
        if (newProduct.quantity > 0) {
          checkCartId.products.push(newProduct);
        }
      }
    });

    // Lưu giỏ hàng đã cập nhật
    const updatedFavor = await checkFavorId.save();

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
      });
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

module.exports = {
  createFavor,
  updateFavor,
  getDetailsFavor,
};
