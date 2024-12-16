const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

// Tạo danh mục
const createCategory = async (newCategory) => {
  try {
    const { category_title, category_parent_id, isActive, slug } = newCategory;
    let category_level = 1;
    let finalSlug = slug; 

    if (category_parent_id && category_parent_id !== "0") {
      const parentCategory = await Category.findById(category_parent_id);
      if (!parentCategory) {
        return {
          status: "ERR",
          message: "Danh mục cha không tồn tại",
        };
      }
      category_level = parentCategory.category_level + 1;
      // Nối slug của cha với slug hiện tại
      finalSlug = `${parentCategory.slug}-${slug}`;
    }
    const newCategoryData = {
      category_title,
      category_parent_id,
      category_level,
      isActive,
      slug: finalSlug,
    };

    const newCategoryInstance = await Category.create(newCategoryData);

    return {
      status: "OK",
      message: "Danh mục sản phẩm đã được tạo thành công",
      data: newCategoryInstance,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi tạo danh mục sản phẩm",
    };
  }
};

// Sửa danh mục
const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Bắt đầu hàm updateCategory");
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return resolve({
          status: "ERR",
          message: "ID danh mục không hợp lệ",
        });
      }

      const checkCategory = await Category.findOne({ _id: id });
      if (!checkCategory) {
        return resolve({
          status: "ERR",
          message: "ID danh mục chưa có trong dữ liệu",
        });
      }

      const updatedCategory = await Category.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedCategory,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Lỗi trong quá trình cập nhật danh mục sản phẩm",
      });
    }
  });
};

// Xóa danh mục
const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({
        _id: id,
      });
      if (checkCategory === null) {
        resolve({
          status: "ERR",
          message: "The Category is not defined",
        });
      }
      if (checkCategory.isDelete === true) {
        resolve({
          status: "ERR",
          message: "Danh mục đã bị xóa",
        });
      }

      const newData = await Category.updateOne(
        { _id: id },
        {
          isDelete: true,
          deletedBy: {
            // account_id: userId,
            deletedAt: new Date(),
          },
        }
      );
      resolve({
        status: "deleted",
        message: "cập nhật trạng thái thành công",
        data: newData.isDelete,
      });

      // await Product.findByIdAndDelete(id);
      // resolve({
      //   status: "OK",
      //   message: "Delete product success",
      // });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Error while delete the category",
      });
    }
  });
};

const getTypeCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategories = await Category.find();

      const categoriesByParentAndLevel = {};

      allCategories.forEach((category) => {
        const parentId = category.category_parent_id || "root";
        const level = category.category_level;

        if (!categoriesByParentAndLevel[parentId]) {
          categoriesByParentAndLevel[parentId] = {};
        }

        if (!categoriesByParentAndLevel[parentId][level]) {
          categoriesByParentAndLevel[parentId][level] = [];
        }

        categoriesByParentAndLevel[parentId][level].push({
          _id: category._id,
          name: category.category_title,
          level: category.category_level,
        });
      });

      resolve({
        status: "OK",
        message: "Success",
        data: categoriesByParentAndLevel,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Error while fetching categories",
      });
    }
  });
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getTypeCategory,
};
