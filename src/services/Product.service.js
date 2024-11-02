const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

// Tạo sản phẩm
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      product_title,
      product_category,
      product_description,
      product_display,
      product_famous,
      product_rate = 0,
      product_feedback,
      product_selled,
      product_percent_discount,
      variants // Để nguyên `variants` là một mảng
    } = newProduct;

    try {
      // Kiểm tra trùng lặp tiêu đề sản phẩm
      const checkProductTitle = await Product.findOne({ product_title });
      if (checkProductTitle !== null) {
        return resolve({
          status: "ERR",
          message: "Sản phẩm đã tồn tại.",
        });
      }

      // Kiểm tra sự tồn tại của danh mục sản phẩm
      const checkProductCategory = await Category.findById(product_category);
      if (checkProductCategory == null) {
        return resolve({
          status: "ERR",
          message: "Danh mục sản phẩm không tồn tại.",
        });
      }

      // Xây dựng dữ liệu sản phẩm mới
      const newProductData = {
        product_title,
        product_category,
        product_description,
        product_display,
        product_famous,
        product_rate,
        product_feedback,
        product_selled,
        product_percent_discount,
        variants, // Không destructure mà giữ nguyên cấu trúc của mảng `variants`
      };

      // Tạo sản phẩm mới trong database
      const newProductInstance = await Product.create(newProductData);

      if (newProductInstance) {
        return resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProductInstance,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi tạo sản phẩm",
      });
    }
  });
};

module.exports = {
  createProduct,
};
