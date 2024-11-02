const ProductService = require("../services/Product.service");
const multer = require("multer");
const slugify = require("slugify");
const crypto = require("crypto");

// Cấu hình Multer để lưu file vào bộ nhớ tạm
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createProduct = async (req, res) => {
  try {
    const {
      product_title,
      product_category,
      product_description,
      product_display,
      product_famous,
      product_rate = 0,
      product_selled,
      product_percent_discount,
      variants
    } = req.body;

    const slug = product_title
      ? slugify(product_title, { lower: true, strict: true })
      : crypto.randomBytes(6).toString("hex");

    // Chuyển đổi `product_images` từ file sang chuỗi Base64
    const product_images = req.files['product_images']?.map((file) => {
      return file.buffer.toString("base64");
    }) || [];

    // Chuyển đổi `variant_img` cho từng biến thể
    const parsedVariants = JSON.parse(variants);
    const updatedVariants = parsedVariants.map((variant, index) => {
      const variantFile = req.files[`variant_img_${index}`]?.[0];
      if (variantFile) {
        variant.variant_img = variantFile.buffer.toString("base64");
      }
      return variant;
    });

    const newProductData = {
      product_title,
      product_category,
      product_images,
      product_description,
      product_display,
      product_famous,
      product_rate,
      product_selled,
      product_percent_discount,
      variants: updatedVariants,
      slug
    };

    const response = await ProductService.createProduct(newProductData);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Lỗi khi tạo sản phẩm" });
  }
};

const uploadFields = upload.fields([
  { name: "product_images", maxCount: 10 }, 
  { name: "variant_img_0", maxCount: 1 },
]);

module.exports = { createProduct, uploadFields };
