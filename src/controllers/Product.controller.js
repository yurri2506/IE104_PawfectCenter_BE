const ProductService = require("../services/Product.service");
const multer = require("multer");
const slugify = require("slugify");
const crypto = require("crypto");
const { uploadImage } = require("../config/cloudinary.config");
// Cấu hình Multer để lưu file vào bộ nhớ tạm
const upload = multer({ storage: multer.memoryStorage() });

const uploadFields = upload.fields([
  { name: "product_images", maxCount: 10 },
  { name: "variant_img_0", maxCount: 1 },
  { name: "variant_img_1", maxCount: 1 },
  { name: "variant_img_2", maxCount: 1 },
  { name: "variant_img_3", maxCount: 1 },
]);

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
      product_brand,
      product_percent_discount,
      variants,
    } = req.body;

    const slug = product_title
      ? slugify(product_title, { lower: true, strict: true })
      : crypto.randomBytes(6).toString("hex");

    // Upload ảnh chính
    const product_images = [];
    if (req.files["product_images"]) {
      for (const file of req.files["product_images"]) {
        const imageUrl = await uploadImage(file.buffer);
        product_images.push(imageUrl);
      }
    }

    // Upload ảnh biến thể
    let parsedVariants = [];
    try {
      parsedVariants = JSON.parse(variants || "[]");
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON format for variants" });
    }

    const updatedVariants = [];
    for (let index = 0; index < parsedVariants.length; index++) {
      const variant = parsedVariants[index];
      const variantFieldName = `variant_img_${index}`;
      if (req.files && req.files[variantFieldName] && req.files[variantFieldName][0]) {
        const variantFile = req.files[variantFieldName][0];
        const variantImageUrl = await uploadImage(variantFile.buffer);
        variant.variant_img = variantImageUrl;
      } else {
        variant.variant_img = variant.variant_img || null;
      }
      updatedVariants.push(variant);
    }

    // Tạo sản phẩm
    const newProductData = {
      product_title,
      product_category,
      product_images,
      product_description,
      product_display,
      product_famous,
      product_rate,
      product_selled,
      product_brand,
      product_percent_discount,
      variants: updatedVariants,
      slug,
    };

    const response = await ProductService.createProduct(newProductData);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: error.message || "Lỗi khi tạo sản phẩm" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Kiểm tra productId
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    // Lấy sản phẩm hiện tại từ database
    const existingProduct = await ProductService.getDetailsProduct(productId);
    if (!existingProduct) {
      return res.status(404).json({
        status: "ERR",
        message: "Sản phẩm không tồn tại",
      });
    }

    // 1. Xử lý ảnh sản phẩm chính (product_images)
    let product_images = [];
    if (req.files && req.files["product_image"]) {
      for (const file of req.files["product_image"]) {
        // Upload từng ảnh lên Cloudinary
        const imageUrl = await uploadImage(file.buffer);
        product_images.push(imageUrl);
      }
    } else {
      // Nếu không có ảnh mới, giữ ảnh cũ
      product_images = existingProduct.product_images || [];
    }

    // 2. Xử lý ảnh của biến thể (variants)
    const parsedVariants = req.body.variants ? JSON.parse(req.body.variants) : [];
    const updatedVariants = [];
    for (let index = 0; index < parsedVariants.length; index++) {
      const variant = parsedVariants[index];

      // Kiểm tra ảnh mới cho biến thể
      if (req.files && req.files[`variant_img_${index}`]) {
        const variantFile = req.files[`variant_img_${index}`][0];
        if (variantFile) {
          // Upload ảnh biến thể lên Cloudinary
          const variantImageUrl = await uploadImage(variantFile.buffer);
          variant.variant_img = variantImageUrl;
        }
      } else {
        // Giữ nguyên ảnh cũ nếu không có ảnh mới
        variant.variant_img = variant.variant_img || null;
      }

      updatedVariants.push(variant);
    }

    // 3. Xây dựng dữ liệu cập nhật
    const updateData = {
      ...req.body,
      product_images, // Danh sách URL của ảnh chính
      variants: updatedVariants, // Danh sách biến thể đã cập nhật
    };

    // 4. Gọi service để cập nhật sản phẩm
    const response = await ProductService.updateProduct(productId, updateData);

    // 5. Phản hồi thành công
    return res.status(200).json(response);
  } catch (e) {
    // Phản hồi lỗi
    console.error("Error updating product:", e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Lỗi khi cập nhật sản phẩm",
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    // Lấy `user.id` từ `res.locals` và truyền xuống service
    // const userId = res.locals.user.id;
    const response = await ProductService.deleteProduct(productId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "An error occurred while deleting the product.",
    });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, search, priceMin, priceMax, product_brand, product_rate, pet_age, category_level_1, category_level_2,category_level_3, product_famous, product_category } = req.query;

    // Chuẩn bị các tham số lọc riêng lẻ
    const filters = {
      product_brand,
      product_famous,
      category_level_1: category_level_1? String(category_level_1): null,
      category_level_2: category_level_2? String(category_level_2): null,
      category_level_3: category_level_3? String(category_level_3): null,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      product_rate: product_rate ? Number(product_rate) : undefined,
      pet_age: pet_age ? Number(pet_age) : undefined,
      product_category,
    };

    // Gọi hàm service để lấy danh sách sản phẩm
    const response = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort || null,
      filters || null,
      search || null
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

module.exports = {
  createProduct,
  uploadFields,
  updateProduct,
  deleteProduct,
  deleteManyProduct,
  getDetailsProduct,
  getAllProduct,
};
