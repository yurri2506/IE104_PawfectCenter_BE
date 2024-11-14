const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

// Tạo sản phẩm
const createProduct = (orderData) => {
  return new Promise(async (resolve, reject) => {
    const {
      discount_ids,
      user_id,
      shipping_fee,
      shipping_address,
      products,
      order_status,
      order_payment,
      order_delivery_date,
      estimated_delivery_date,
      order_note,
    } = orderData;

    try {
      // 1. Tính toán tổng giá trị đơn hàng trước khi áp dụng chiết khấu
      let orderTotalBefore = 0;
      const productDetails = await Promise.all(
        products.map(async (product) => {
          const productInfo = await Product.findById(product.product_id).populate('product_category');
          if (!productInfo) {
            return resolve({
              status: "ERR",
              message: `Không tìm thấy sản phẩm với ID: ${product.product_id}`,
            });
          }

          // Tìm giá của biến thể sản phẩm (nếu có), nếu không, dùng giá sản phẩm
          const price = productInfo.variants.find(variant => variant._id.equals(product.variant_id))?.product_price || productInfo.price;
          const totalPrice = price * product.quantity;
          orderTotalBefore += totalPrice;

          return {
            ...product,
            price,
            total_price: totalPrice,
            product_category: productInfo.product_category
          };
        })
      );

      // 2. Tính toán chiết khấu dựa trên mã giảm giá và điều kiện áp dụng
      let productDiscount = 0;
      let shippingDiscount = 0;

      if (discount_ids && discount_ids.length > 0) {
        const discounts = await Discount.find({ _id: { $in: discount_ids } });

        discounts.forEach((discount) => {
          const applicableCondition = discount.discount_condition.find(condition => {
            const isCategoryMatched = condition.category_id.some(category => 
              productDetails.some(product => product.product_category && product.product_category.equals(category))
            );
            return isCategoryMatched && orderTotalBefore >= condition.price_total_order;
          });

          // Nếu điều kiện áp dụng mã giảm giá thỏa mãn
          if (applicableCondition) {
            const discountValue = (orderTotalBefore * discount.discount_number) / 100;
            if (discount.discount_type === 'product') {
              productDiscount = Math.max(productDiscount, discountValue);
            } else if (discount.discount_type === 'shipping') {
              shippingDiscount = Math.max(shippingDiscount, discountValue);
            }
          }
        });
      }

      // 3. Tính tổng đơn hàng sau khi áp dụng chiết khấu và phí vận chuyển
      const orderTotalAfter = orderTotalBefore - productDiscount + (shipping_fee || 0) - shippingDiscount;

      // 4. Chuẩn bị dữ liệu để lưu đơn hàng
      const newOrderData = {
        discount_ids,
        user_id,
        shipping_fee,
        shipping_address,
        products: productDetails,
        order_status,
        order_payment,
        order_delivery_date,
        estimated_delivery_date,
        order_total_before: orderTotalBefore,
        order_total_after: orderTotalAfter,
        order_note,
        discount_applied: {
          productDiscount,
          shippingDiscount
        }
      };

      // 5. Tạo và lưu đơn hàng
      const newOrderInstance = await Order.create(newOrderData);

      if (newOrderInstance) {
        return resolve({
          status: "OK",
          message: "Đơn hàng đã được tạo thành công",
          data: newOrderInstance,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "Đã xảy ra lỗi khi tạo đơn hàng",
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

const getAllProduct = (limit, page, sort, filter = {}) => { 
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
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProduct,
  getDetailsProduct,
  getAllProduct,
};
