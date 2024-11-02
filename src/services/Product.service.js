const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      product_title,
      product_category,
      product_images,
      product_description,
      product_display,
      product_famous,
      product_rate = 0,
      product_feedback,
      product_selled,
      product_percent_discount,
      variants,
      slug 
    } = newProduct;

    try {
      const checkProductTitle = await Product.findOne({ product_title });
      if (checkProductTitle !== null) {
        return resolve({
          status: "ERR",
          message: "Sản phẩm đã tồn tại.",
        });
      }

      const checkProductCategory = await Category.findById(product_category);
      if (checkProductCategory == null) {
        return resolve({
          status: "ERR",
          message: "Danh mục sản phẩm không tồn tại.",
        });
      }

      const newProductData = {
        product_title,
        product_category,
        product_images,
        product_description,
        product_display,
        product_famous,
        product_rate,
        product_feedback,
        product_selled,
        product_percent_discount,
        variants,
        slug 
      };

      const newProductInstance = await Product.create(newProductData);

      if (newProductInstance) {
        return resolve({
          status: "OK",
          message: "Sản phẩm đã được tạo thành công",
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
