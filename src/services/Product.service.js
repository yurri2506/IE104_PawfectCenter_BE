const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

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
      slug 
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

      const product_price = Math.min(...variants.map(variant => variant.product_price));
      const product_countInStock = variants.reduce((acc, variant) => acc + variant.product_countInStock, 0);

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
        data.product_price = Math.min(...data.variants.map(variant => variant.product_price));
        data.product_countInStock = data.variants.reduce((acc, variant) => acc + variant.product_countInStock, 0);
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

const getAllProduct = (limit = 0, page = 0, sort = "", filters = {}, search = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = { is_delete: false, product_display: true }; // Lọc sản phẩm chưa bị xóa và đang hiển thị
      // Thêm logic tìm kiếm theo từ khóa
      if (search) {
        query.product_title = { $regex: search, $options: "i" };
      }

      // Lọc theo danh mục (product_category)
      if (filters.product_category) {
        query.product_category = filters.product_category;
      }

      // Lọc theo thương hiệu (product_brand)
      if (filters.product_brand) {
        query.product_brand = { $regex: filters.product_brand, $options: "i" };
      }

      // Lọc theo số sao đánh giá (product_rate)
      if (filters.product_rate !== undefined) {
        query.product_rate = { $gte: filters.product_rate }; // Lọc sản phẩm có số sao lớn hơn hoặc bằng
      }

      // Lọc theo số tuổi của thú cưng (pet_age)
      if (filters.pet_age !== undefined) {
        const petAge = Number(filters.pet_age);
        if (petAge === -1) {
          // Không lọc theo tuổi
        } else if (petAge === 0) {
          query["variants.pet_age"] = { $lt: 1 }; // Dưới 1 tuổi
        } else if (petAge >= 1) {
          query["variants.pet_age"] = { $gte: petAge }; // Trên 1 tuổi hoặc hơn
        }
      }

      // Đếm tổng số sản phẩm phù hợp
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
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProduct,
  getDetailsProduct,
  getAllProduct,
};
