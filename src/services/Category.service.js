const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

// Tạo sản phẩm
const createCategory = async (newCategory) => {
  try {
    const { category_title, category_parent_id, isActive, slug } = newCategory;
    const checkCategoryTitle = await Category.findOne({ category_title });
    if (checkCategoryTitle) {
      return {
        status: "ERR",
        message: "Danh mục đã tồn tại",
      };
    }

    let category_level = 1;
    if (category_parent_id) {
      const parentCategory = await Category.findById(category_parent_id);
      if (!parentCategory) {
        return {
          status: "ERR",
          message: "Danh mục cha không tồn tại",
        };
      }
      category_level = parentCategory.category_level + 1;
    }
    const newCategoryData = {
      category_title,
      category_parent_id,
      category_level,
      isActive,
      slug,
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

// Sửa sản phẩm
const updateCategory = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra ID có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return resolve({
          status: "ERR",
          message: "Invalid product ID",
        });
      }

      // Kiểm tra sản phẩm có tồn tại không
      const checkProduct = await Product.findOne({ _id: id });
      if (!checkProduct) {
        return resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      // Cập nhật sản phẩm chỉ với các trường được cung cấp trong `data`
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Error while updating the product",
      });
    }
  });
};

// Xóa sản phẩm
const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      await Product.updateOne(
        { _id: id },
        {
          is_delete: true,
          deletedBy: {
            // account_id: userId,
            deletedAt: new Date(),
          },
        }
      );
      resolve({
        status: "deleted",
        message: "cập nhật trạng thái thành công",
      });

      // await Product.findByIdAndDelete(id);
      // resolve({
      //   status: "OK",
      //   message: "Delete product success",
      // });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Error while delete the product",
      });
    }
  });
};

const getTypeCategory = (limit, page, sort, filter = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = { is_delete: false };
      console.log("Filter:", filter);

      if (filter.product_category) {
        console.log("Product Category Filter:", filter.product_category);
        query.product_category = filter.product_category;
      } else {
        console.log("Filter không tồn tại hoặc không có product_category");
      }

      if (filter.otherField && filter.otherValue) {
        query[filter.otherField] = { $regex: filter.otherValue, $options: "i" };
      }

      const totalProduct = await Product.countDocuments(query);

      if (totalProduct === 0) {
        return resolve({
          status: "OK",
          message: "No products found",
          data: [],
          total: 0,
          pageCurrent: Number(page) + 1,
          totalPage: 0,
        });
      }

      const skip = page * limit;

      let sortOptions = { createdAt: -1, updatedAt: -1 };
      if (sort) {
        if (sort === "price_asc") {
          sortOptions = { "variants.product_price": 1 };
        } else if (sort === "price_desc") {
          sortOptions = { "variants.product_price": -1 };
        } else if (sort === "best_selling") {
          sortOptions = { product_selled: -1 };
        } else if (sort === "popular") {
          sortOptions = { product_rate: -1 };
        }
      }

      const allProduct = await Product.find(query)
        .limit(limit)
        .skip(skip)
        .sort(sortOptions);

      resolve({
        status: "OK",
        message: "Success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject({
        status: "Error",
        message: e.message,
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
