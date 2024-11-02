const ProductService = require("../services/Product.service");
const fs = require('fs');

const createProduct = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is undefined" });
    }

    const {
      product_title,
      product_category,
      // product_img,
      product_description,
      product_selled,
      product_percent_discount,
      variants
    } = req.body;

    // Kiểm tra `variants` là mảng và có ít nhất một phần tử
    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "Variants must be a non-empty array" });
    }

    // Destructuring `variants`
    const [
      { pet_age, product_color, product_weight, product_size, variant_img, product_price, product_countInStock }
    ] = variants;

    // Xử lý `product_img` để chuyển thành Base64 nếu cần
    // let base64Images = [];
    // if (Array.isArray(product_img)) {
    //   base64Images = product_img.map((img) => {
    //     if (img && img.path) {
    //       return fs.readFileSync(img.path, 'base64');
    //     }
    //     return null;
    //   }).filter(Boolean);
    // } else if (typeof product_img === 'string') {
    //   base64Images = [product_img]; // Giả định là `product_img` là chuỗi Base64
    // }

    // Kiểm tra các trường bắt buộc
    if (
      !product_title ||
      !product_category ||
      // product_img.length === 0 ||
      !product_description ||
      !product_selled ||
      !product_percent_discount
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const productData = {
      product_title,
      product_category,
      // product_img: base64Images,
      product_description,
      product_selled,
      product_percent_discount,
      variants: [
        { pet_age, product_color, product_weight, product_size, product_price, product_countInStock }, // thiếu variant_img
      ],
    };

    const response = await ProductService.createProduct(productData);
    return res.status(201).json(response);
  } catch (e) {
    console.error("Error:", e); // Log lỗi ra console để dễ debug hơn
    return res.status(500).json({
      message: e.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createProduct,
};
