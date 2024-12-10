const mongoose = require("mongoose");
const Product = require("../models/Product.model");
const Cart = require("../models/Cart.model");

// Tạo cart
const createCart = async (newCart) => {
  try {
    const { user_id, products } = newCart;

    // Kiểm tra nếu người dùng đã có giỏ hàng
    const checkUserId = await Cart.findOne({ user_id: user_id });
    if (checkUserId) {
      return {
        status: "ERR",
        message: "Người dùng đã tồn tại giỏ hàng.",
      };
    }

    // Tạo giỏ hàng mới
    const newCartData = await Cart.create(newCart);

    return {
      status: "OK",
      message: "Cart đã được tạo thành công",
      data: newCartData,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Đã xảy ra lỗi khi tạo Cart",
    };
  }
};

// Sửa cart
const updateCart = async (userId, data) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        status: "ERR",
        message: "ID giỏ hàng không hợp lệ",
      };
    }

    const checkCartId = await Cart.findOne({ user_id: userId });
    if (!checkCartId) {
      return {
        status: "ERR",
        message: "Giỏ hàng của người dùng chưa có trong dữ liệu",
      };
    }

    // Duyệt qua các sản phẩm trong giỏ hàng để cập nhật hoặc thêm mới
    data.products.forEach((newProduct) => {
      const existingProductIndex = checkCartId.products.findIndex(
        (p) =>
          p.product_id.toString() === newProduct.product_id &&
          p.variant.toString() === newProduct.variant
      );

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm và biến thể đã có trong giỏ hàng, cập nhật số lượng
        checkCartId.products[existingProductIndex].quantity +=
          newProduct.quantity ;
        // Nếu số lượng bằng 0, xóa sản phẩm khỏi giỏ hàng
        if (newProduct.quantity === 0) {
          checkCartId.products.splice(existingProductIndex, 1);
        }
      } else {
        // Nếu sản phẩm và biến thể chưa có trong giỏ hàng, thêm mới
        if (newProduct.quantity > 0) {
          checkCartId.products.push(newProduct);
        }
      }
    });

    // Lưu giỏ hàng đã cập nhật
    const updatedCart = await checkCartId.save();

    return {
      status: "OK",
      message: "Cập nhật Cart thành công",
      data: updatedCart,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Lỗi trong quá trình cập nhật giỏ hàng",
    };
  }
};

const getAllProductByUserId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Cart.findOne({ user_id: id })
      .populate('products.product_id', 'product_images product_title product_percent_discount')
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thông giỏ hàng chi tiết thành công",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const searchProductsInCart = async (userId, searchQuery) => {
  try {
    const cart = await Cart.findOne({ user_id: userId })
      .populate("products.product_id")
      .populate("products.variant");
    if (!cart) {
      return { status: "ERR", message: "Cart not found", data: null };
    }
    const matchingProducts = cart.products.filter((product) =>
      product.product_id.product_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    return {
      status: "OK",
      message: "Products retrieved successfully",
      data: matchingProducts,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message || "Error retrieving products in cart",
      data: null,
    };
  }
};

const deleteProductCart = async (userId, data) => {
  try {
    // Kiểm tra `userId` có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID giỏ hàng không hợp lệ");
    }

    // Kiểm tra xem giỏ hàng có tồn tại không
    const checkCartId = await Cart.findOne({ user_id: userId });
    if (!checkCartId) {
      throw new Error("Giỏ hàng của người dùng chưa có trong dữ liệu");
    }

    // Tạo điều kiện xóa từ danh sách products
    const conditions = data.products.map((product) => ({
      product_id: product.product_id,
      variant: product.variant,
    }));

    // Sử dụng $pull để xóa các sản phẩm
    const updatedCart = await Cart.findOneAndUpdate(
      { user_id: userId },
      { $pull: { products: { $or: conditions } } },
      { new: true } // Trả về giỏ hàng sau khi cập nhật
    );

    if (!updatedCart) {
      throw new Error("Không tìm thấy giỏ hàng để cập nhật");
    }

    return {
      status: "OK",
      message: "Xóa sản phẩm trong giỏ hàng thành công",
      data: updatedCart,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: error.message,
    };
  }
};

const updateCart2 = async (userId, data) => {
  try {
    // Kiểm tra xem `userId` có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        status: "ERR",
        message: "ID giỏ hàng không hợp lệ",
      };
    }

    // Kiểm tra xem giỏ hàng của người dùng có tồn tại không
    const checkCartId = await Cart.findOne({ user_id: userId });
    if (!checkCartId) {
      return {
        status: "ERR",
        message: "Giỏ hàng của người dùng chưa có trong dữ liệu",
      };
    }

    // Tìm và cập nhật sản phẩm trong giỏ hàng
    const product = checkCartId.products.find(
      (item) =>
        item?.product_id.toString() === data.products[0].product_id.toString() && // So sánh `product_id`
        item?.variant.toString() === data.products[0].variant.toString()         // So sánh `variant`
    );

    if (!product) {
      return {
        status: "ERR",
        message: "Sản phẩm không tồn tại trong giỏ hàng",
      };
    }

    // Cập nhật quantity cho sản phẩm
    product.quantity = data.products[0].quantity;

    // Lưu giỏ hàng đã cập nhật
    const updatedCart = await checkCartId.save();

    return {
      status: "OK",
      message: "Cập nhật Cart thành công",
      data: updatedCart,
    };
  } catch (e) {
    return {
      status: "ERR",
      message: e.message || "Lỗi trong quá trình cập nhật giỏ hàng",
    };
  }
};


module.exports = {
  createCart,
  updateCart,
  updateCart2,
  getAllProductByUserId,
  searchProductsInCart,
  deleteProductCart,
};
