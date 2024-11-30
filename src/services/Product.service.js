const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const ObjectId = mongoose.Types.ObjectId;
const notificationService = require("../services/Notification.service")
const Notification = require("../models/Notification.model")
// Tạo sản phẩm
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
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
      variants,
      slug,
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

      const product_price = Math.min(
        ...variants.map((variant) => variant.product_price)
      );
      const product_countInStock = variants.reduce(
        (acc, variant) => acc + variant.product_countInStock,
        0
      );

      // Xây dựng dữ liệu sản phẩm mới
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
        variants,
        slug,
        product_price,
        product_countInStock,
      };

      // Tạo sản phẩm mới trong database
      const newProductInstance = await Product.create(newProductData);
      if (newProductInstance && newProductInstance.product_display) {

        await Notification.create({
          user_id: null,
          product_id: newProductInstance._id,
          notify_type: 'Sản phẩm',
          notify_title: 'Sản phẩm mới đã có mặt',
          notify_desc:`Sản phẩm ${newProductInstance.product_title} đã có sắn, mua hang ngay nào`
        })
      }
      if (newProductInstance) {
        return resolve({
          status: "OK",
          message: "SUCCESS",
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

// Sửa sản phẩm
const updateProduct = (id, data) => {
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

      if (data.variants) {
        data.product_price = Math.min(
          ...data.variants.map((variant) => variant.product_price)
        );
        data.product_countInStock = data.variants.reduce(
          (acc, variant) => acc + variant.product_countInStock,
          0
        );
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
const deleteProduct = (id) => {
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

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notFoundIds = [];

      for (const id of ids) {
        const checkProduct = await Product.findOne({ _id: id });

        if (checkProduct === null) {
          notFoundIds.push(id);
          continue;
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
      }
      resolve({
        status: "OK",
        message:
          "Successfully updated deleted status for all specified products",
        notFoundIds,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Error while deleting the products",
      });
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông tin chi tiết thành công",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = async (limit = 0, page = 0, sort = "", filters = {}, search = "") => {
  try {
    const query = { is_delete: false, product_display: true }; // Lọc sản phẩm chưa bị xóa và đang hiển thị

    // Thêm logic tìm kiếm theo từ khóa
    if (search) {
      query.product_title = { $regex: search, $options: "i" };
    }

    // Lọc theo sản phẩm nổi bật
    if (filters.product_famous == "true") {
      query.product_famous = true;
    }

    let categories = [];  // Mảng để chứa các category_id

    // Xử lý theo Mèo (category_level_1 = Mèo)
    if (filters.category_level_1 && filters.category_level_1.includes("Mèo")) {
      // Lọc danh mục cấp 2 của Mèo (category_level_2 bắt đầu với "10" và kết thúc với "2")
      if (filters.category_level_2 && !filters.category_level_3) {
        let level2Categories = await Category.find({
          category_title: { $in: filters.category_level_2 },
          category_level: "102", // Cấp 2 của Mèo
        }).select("_id");

        // Lọc danh mục cấp 3 thuộc cấp 2 của Mèo (category_level_3 bắt đầu với "102" và kết thúc với "3")
        let level3Categories = await Category.find({
          category_parent_id: { $in: level2Categories.map(cat => cat._id) },
          category_level: "1023", // Cấp 3 của Mèo
        }).select("_id");

        categories = categories.concat(level3Categories.map(cat => cat._id));
      }

      // Lọc trực tiếp danh mục cấp 3 của Mèo
      else if (filters.category_level_3) {
        let level3Categories = await Category.find({
          category_title: { $in: filters.category_level_3 },
          category_level: "1023", // Cấp 3 của Mèo
        }).select("_id");

        categories = categories.concat(level3Categories.map(cat => cat._id));
      }
    }

    // Xử lý theo Chó (category_level_1 = Chó)
    else if (filters.category_level_1 && filters.category_level_1.includes("Chó")) {
      // Lọc danh mục cấp 2 của Chó (category_level_2 bắt đầu với "11" và kết thúc với "2")
      if (filters.category_level_2 && !filters.category_level_3) {
        let level2Categories = await Category.find({
          category_title: { $in: filters.category_level_2 },
          category_level: "112", // Cấp 2 của Chó
        }).select("_id");

        // Lọc danh mục cấp 3 thuộc cấp 2 của Chó (category_level_3 bắt đầu với "112" và kết thúc với "3")
        let level3Categories = await Category.find({
          category_parent_id: { $in: level2Categories.map(cat => cat._id) },
          category_level: "1123", // Cấp 3 của Chó
        }).select("_id");

        categories = categories.concat(level3Categories.map(cat => cat._id));
      }

      // Lọc trực tiếp danh mục cấp 3 của Chó
      else if (filters.category_level_3) {
        let level3Categories = await Category.find({
          category_title: { $in: filters.category_level_3 },
          category_level: "1123", // Cấp 3 của Chó
        }).select("_id");

        categories = categories.concat(level3Categories.map(cat => cat._id));
      }
    }

    // Kiểm tra nếu không có danh mục phù hợp
    if (categories.length === 0) {
      return { status: "OK", message: "No products found", data: [], total: 0 };
    }

    // Đảm bảo có category_id trong query
    query.product_category = { $in: categories };

    console.log("Final query:", query);  // Kiểm tra lại query đã đúng chưa

    // Đếm tổng số sản phẩm phù hợp
    const totalProduct = await Product.countDocuments(query);

    if (totalProduct === 0) {
      return { status: "OK", message: "No products found", data: [], total: 0 };
    }

    const skip = page * limit;

    // Xác định kiểu sắp xếp
    let sortOptions = { createdAt: -1 }; // Mặc định là mới nhất trước
    if (sort) {
      if (sort === "price_asc") {
        sortOptions = { "variants.product_price": 1 }; // Giá tăng dần
      } else if (sort === "price_desc") {
        sortOptions = { "variants.product_price": -1 }; // Giá giảm dần
      } else if (sort === "best_selling") {
        sortOptions = { product_selled: -1 }; // Sản phẩm bán chạy nhất
      } else if (sort === "popular") {
        sortOptions = { product_rate: -1 }; // Sản phẩm phổ biến nhất (theo số sao)
      } else if (sort === "newest") {
        sortOptions = { createdAt: -1 }; // Sản phẩm mới nhất
      } else if (sort === "relevance") {
        sortOptions = {}; // Không sắp xếp
      }
    }

    // Lấy danh sách sản phẩm phù hợp
    const allProduct = await Product.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sortOptions)
      .populate("product_category", "category_name") // Populate tên danh mục từ ObjectId
      .populate("product_feedback"); // Populate đánh giá sản phẩm

    return {
      status: "OK",
      message: "Success",
      data: allProduct,
      total: totalProduct,
      pageCurrent: Number(page) + 1,
      totalPage: Math.ceil(totalProduct / limit),
    };
  } catch (e) {
    return {
      status: "Error",
      message: e.message,
    };
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProduct,
  getDetailsProduct,
  getAllProduct,
};
