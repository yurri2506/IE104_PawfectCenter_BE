const mongoose = require("mongoose");
const Discount = require("../models/Discount.model");
const Category = require("../models/Category.model");

// Tạo danh mục
const createDiscount = async (newDiscount) => {
  try {
    const {
      discount_title,
      discount_type,
      discount_description,
      discount_start_day,
      discount_end_day,
      discount_amount,
      discount_number,
      discount_condition,
    } = newDiscount;

    const newDiscountData = await Discount.create(newDiscount);

    return {
      status: "OK",
      message: "Mã giảm giá đã được tạo thành công",
      data: newDiscountData,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi tạo mã giảm giá",
    };
  }
};

// Sửa danh mục
const updateDiscount = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "ID mã giảm giá không hợp lệ",
      };
    }

    const checkDiscount = await Discount.findById(id);
    if (!checkDiscount) {
      return {
        status: "ERR",
        message: "ID mã giảm giá chưa có trong dữ liệu",
      };
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return {
      status: "OK",
      message: "Cập nhật mã giảm giá thành công",
      data: updatedDiscount,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Lỗi trong quá trình cập nhật mã giảm giá",
    };
  }
};

// Xóa danh mục, xóa hẳn không xóa mềm???
const deleteDiscount = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkDiscount = await Discount.findOne({
        _id: id,
      });
      if (checkDiscount === null) {
        resolve({
          status: "ERR",
          message: "The Discount is not defined",
        });
      }

      await Discount.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Discount success",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Error while delete the Discount",
      });
    }
  });
};

const getDiscountDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({
        _id: id,
      });
      if (discount === null) {
        resolve({
          status: "ERR",
          message: "The discount is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông tin chi tiết về mã giảm giá thành công",
        data: discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountDetails,
};
