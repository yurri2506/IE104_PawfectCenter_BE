const CategoryService = require("../services/Order.service");
const slugify = require("slugify");
const crypto = require("crypto");

const createCOrder = async (req, res) => {
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

// const updateCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const data = req.body;
//     if (!data) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "Thông tin cập nhật không có",
//       });
//     }
//     if (!categoryId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "ID danh mục sản phẩm là bắt buộc",
//       });
//     }
//     const response = await CategoryService.updateCategory(categoryId, data);
//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     if (!categoryId) {
//       return res.status(400).json({
//         status: "ERR",
//         message: "The categoryId is required",
//       });
//     }

//     const response = await CategoryService.deleteCategory(categoryId);

//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(500).json({
//       status: "ERR",
//       message: e.message || "An error occurred while deleting the category.",
//     });
//   }
// };

// const getTypeCategory = async (req, res) => {
//   try {
//     const response = await CategoryService.getTypeCategory();
//     return res.status(200).json(response);
//   } catch (e) {
//     return res.status(500).json({
//       status: "ERR",
//       message: e.message || "Error while fetching categories",
//     });}
// };

module.exports = {
  createCOrder,
  // updateCategory,
  // deleteCategory,
  // getTypeCategory,
};
