const CategoryService = require("../services/Category.service");
const slugify = require("slugify");
const crypto = require("crypto");

const createCategory = async (req, res) => {
  try {
    const {
      category_title,
      category_parent_id,
      category_level,
      isActive,
    } = req.body;

    if (!category_title) {
      return res.status(200).json({
        status: "ERR",
        message: "Tên danh mục sản phẩm là bắt buộc",
      });
    }

    if (!category_parent_id) {
      return res.status(200).json({
        status: "ERR",
        message: "Mã danh mục cha của sản phẩm là bắt buộc",
      });
    }

    const slug = category_title
      ? slugify(category_title, { lower: true, strict: true })
      : crypto.randomBytes(6).toString("hex");

    const newCategoryData = {
      category_title,
      category_parent_id,
      category_level,
      isActive,
      slug,
    };

    const response = await CategoryService.createCategory(newCategoryData);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Lỗi khi tạo sản phẩm" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteCategory = async (req, res) => {
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

const getTypeCategory = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const parsedFilter = filter ? JSON.parse(filter) : {};
    const response = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      parsedFilter
    );
    
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getTypeCategory,
};
