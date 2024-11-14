const mongoose = require("mongoose");
const Store = require("../models/Store.model");

// Tạo feedback
const createStore = async (newStore) => {
  try {
    const {
      store_name,
      store_email,
      phone,
      store_address,
      store_img,
      description,
      privacy_policy,
      warranty_policy,
      return_policy,
      general_term
    } = newStore;

    const newStoreData = await Store.create(newStore);

    return {
      status: "OK",
      message: "Store đã được tạo thành công",
      data: newStoreData,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi tạo Store",
    };
  }
};

// Sửa feedback
const updateStore = async (id, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        status: "ERR",
        message: "ID store không hợp lệ",
      };
    }

    const checkStore = await Store.findById(id);
    if (!checkStore) {
      return {
        status: "ERR",
        message: "ID store chưa có trong dữ liệu",
      };
    }

    const updatedStore = await Store.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return {
      status: "OK",
      message: "Cập nhật Store thành công",
      data: updatedStore,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Lỗi trong quá trình cập nhật Store",
    };
  }
};

const getDetail = (storeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const store = await Store.find({ '_id': storeId });
      
      if (!store || store.length === 0) {
        return resolve({
          status: "ERR",
          message: "Không có thông tin nào cho cửa hàng này",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông tin cửa hàng thành công",
        data: store,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Lỗi khi lấy thông tin của cửa hàng",
      });
    }
  });
};

module.exports = {
  updateStore,
  getDetail,
  createStore
};
