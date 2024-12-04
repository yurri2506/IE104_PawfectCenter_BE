const StoreService = require("../services/Store.service");
const multer = require("multer");

// Cấu hình Multer để lưu file vào bộ nhớ tạm
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFields = upload.fields([
  { name: "store_img", maxCount: 10 }
]);

const createStore = async (req, res) => {
  try {
    const {
      store_name,
      store_email,
      phone,
      store_address,
      description,
      privacy_policy,
      warranty_policy,
      return_policy,
      general_term
    } = req.body;

    const store_img =
    req.files["store_img"]?.map((file) => {
      return file.buffer.toString("base64");
    }) || [];

    const newStoreData = {
      store_name,
      store_email,
      phone,
      store_address,
      description,
      privacy_policy,
      warranty_policy,
      return_policy,
      general_term,
      store_img 
    };

    const response = await StoreService.createStore(newStoreData);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Lỗi khi tạo store" });
  }
};

const updateStore = async (req, res) => {
  try {
    const storeId = req.params.id;

    if (!storeId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của store không có, đây là trường bắt buộc",
      });
    }
    let store_img = [];
    // Xử lý ảnh feedback_img nếu có trong yêu cầu cập nhật
    store_img = req.files["store_img"]?.map((file) => {
      return file.buffer.toString("base64");
    });

    // Xây dựng dữ liệu cập nhật
    const updateData = { ...req.body };

    // Chỉ thêm store_img vào updateData nếu có ảnh mới
    if (store_img && store_img.length > 0) {
      updateData.store_img = store_img;
    }

    const response = await StoreService.updateStore(storeId, updateData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi khi cập nhật thông tin cửa hàng",
    });
  }
};

const getDetail = async (req, res) => {
  try {
    //const storeId = req.params.id;
    // if (!storeId) {
    //   return res.status(200).json({
    //     status: "ERR",
    //     message: "The storeId in Store is required",
    //   });
    // }
    const response = await StoreService.getDetail();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  updateStore,
  getDetail,
  uploadFields,
  createStore,
};
