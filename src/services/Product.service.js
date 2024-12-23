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
        return reject({
          status: "ERR",
          message: "Sản phẩm đã tồn tại.",
        });
      }

      // Kiểm tra sự tồn tại của danh mục sản phẩm
      const checkProductCategory = await Category.findById(product_category);
      if (checkProductCategory == null) {
        return reject({
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
      })
      .populate("product_category", "category_title category_parent_id category_level")
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

const getAllProduct = async (
  limit = 0,
  page = 1,
  sort = "",
  filters = {},
  search = ""
) => {
  try {
    const query = { is_delete: false, product_display: true }; // Lọc sản phẩm chưa bị xóa và đang hiển thị

    // Thêm logic tìm kiếm theo từ khóa
    if (filters.product_category) {
      query.product_category = filters.product_category;
    }

    if (search) {
      query.product_title = { $regex: search, $options: "i" };
    }

    // Lọc theo sản phẩm nổi bật
    if (filters.product_famous == "true") {
      query.product_famous = true;
    }

    let categories = new Set(); // Sử dụng Set để tránh trùng lặp

    // Kiểm tra và lấy ID cho category_level_1 (Chó/Mèo)
    let categoryLevel1 = null;
    if (filters.category_level_1 && filters.category_level_1.includes("Chó")) {
      categoryLevel1 = "11"; // ID cho "Chó"
    } else if (
      filters.category_level_1 &&
      filters.category_level_1.includes("Mèo")
    ) {
      categoryLevel1 = "10"; // ID cho "Mèo"
    }

    if (categoryLevel1) {
      // Nếu có category_level_1, truy vấn các danh mục cấp 2 và cấp 3
      let level1Categories = await Category.find({
        category_level: `${categoryLevel1}`, // Cấp 2 (ví dụ: "112" cho Chó)
      }).select("_id");

      // Lọc theo category_level_1 (Chó/Mèo) - Chỉ lấy các danh mục cấp 2 và cấp 3 liên kết với cấp 1
      if (!filters.category_level_2 && !filters.category_level_3) {
        // Tìm danh mục cấp 2 của Chó hoặc Mèo
        let level2Categories = await Category.find({
          category_level: `${categoryLevel1}2`, // Cấp 2 (ví dụ: "112" cho Chó)
        }).select("_id");

        if (level2Categories.length === 0) {
          // Nếu không có danh mục cấp 2, có thể là do danh mục không đúng
          console.log("No level 2 categories found.");
        }

        // Tìm danh mục cấp 3 của Chó hoặc Mèo
        let level3Categories = await Category.find({
          category_level: `${categoryLevel1}23`, // Cấp 3 (ví dụ: "1123" cho Chó)
        }).select("_id");

        if (level3Categories.length === 0) {
          console.log("No level 3 categories found.");
        }

        // Kết hợp các category vào mảng
        level3Categories.forEach((cat) => categories.add(cat._id.toString())); // Thêm vào Set
      } else if (filters.category_level_2 && !filters.category_level_3) {
        // Lọc theo category_level_2 nếu có
        let level2Categories = await Category.find({
          category_title: { $in: filters.category_level_2 },
          category_level: `${categoryLevel1}2`, // Cấp 2
        }).select("_id category_parent_id");

        let validLevel2Categories =
          level2Categories.category_parent_id === level1Categories._id
            ? level2Categories
            : null;

        let level3Categories = await Category.find({
          category_parent_id: {
            $in: validLevel2Categories.map((cat) => cat._id),
          },
          category_level: `${categoryLevel1}23`, // Cấp 3
        }).select("_id category_title category_parent_id");
        validLevel2Categories.forEach((cat) =>
          categories.add(cat._id.toString())
        ); // Thêm vào Set
        level3Categories.forEach((cat) => categories.add(cat._id.toString()));
      } else if (filters.category_level_3) {
        let level2Categories = await Category.find({
          category_title: { $in: filters.category_level_2 },
          category_level: `${categoryLevel1}2`, // Cấp 2
        }).select("_id category_parent_id");

        let validLevel2Categories =
          level2Categories.category_parent_id === level1Categories._id
            ? level2Categories
            : null;
        
        let level3Categories = await Category.find({
          category_title: { $in: filters.category_level_3 },
          category_level: `${categoryLevel1}23`, // Cấp 3
        }).select("_id category_parent_id");

        let validLevel3Categories =
        level3Categories.category_parent_id === validLevel2Categories._id
            ? level3Categories
            : null;
        validLevel3Categories.forEach((cat) =>
          categories.add(cat._id.toString())
        ); // Thêm vào Set
    }
    }
    if (categories === 0) {
      return { status: "OK", message: "No products found", data: [], total: 0 };
    }
    // Nếu không có category nào được tìm thấy và không truyền danh mục vào thì lấy toàn bộ sản phẩm
    if (categories.size === 0 && !categoryLevel1) {
      // Không lọc theo danh mục, lấy tất cả sản phẩm
    } else {
      // Nếu có danh mục, lọc sản phẩm theo category
      query.product_category = { $in: Array.from(categories) }; // Chuyển Set thành mảng
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

    // Lọc theo giá (priceMin và priceMax)
    if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
      query.product_price = {
        $gte: filters.priceMin,
        $lte: filters.priceMax,
      }; // Lọc sản phẩm theo giá
    } else if (filters.priceMin !== undefined) {
      query.product_price = { $gte: filters.priceMin }; // Lọc sản phẩm có giá từ giá min trở lên
    } else if (filters.priceMax !== undefined) {
      query.product_price = { $lte: filters.priceMax }; // Lọc sản phẩm có giá dưới giá max
    }

    console.log("Final query:", query); // Kiểm tra lại query đã đúng chưa

    // Đếm tổng số sản phẩm phù hợp
    const totalProduct = await Product.countDocuments(query);

    if (totalProduct === 0) {
      return { status: "OK", message: "No products found", data: [], total: 0 };
    }

    const skip = Number(page-1) * limit;

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
      .populate("product_category", "category_title category_parent_id category_level") // Populate tên danh mục từ ObjectId
      .populate("product_feedback"); // Populate đánh giá sản phẩm
    
      console.log("Number of products returned:", allProduct.length);
    return {
      status: "OK",
      message: "Lấy thành công sản phẩm khi getAll",
      data: allProduct,
      total: totalProduct,
      pageCurrent: Number(page),
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
