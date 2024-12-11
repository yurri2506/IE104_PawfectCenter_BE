const DiscountService = require("../services/Discount.service");

const createDiscount = async (req, res) => {
  try {
    const {
      discount_title,
      discount_type,
      discount_code,
      discount_description,
      discount_start_day,
      discount_end_day,
      discount_amount,
      discount_number,
      discount_condition,
    } = req.body;

    if (
      !discount_title ||
      discount_type ||
      !discount_code ||
      !discount_description ||
      !discount_start_day ||
      !discount_end_day ||
      !discount_amount ||
      !discount_number ||
      !discount_condition
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "Thiếu trường thông tin để tạo mã giảm giá",
      });
    }

    const newDiscountData = {
      discount_title,
      discount_type,
      discount_code,
      discount_description,
      discount_start_day,
      discount_end_day,
      discount_amount,
      discount_number,
      discount_condition,
    };

    const response = await DiscountService.createDiscount(newDiscountData);
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Lỗi khi tạo mã giảm giá" });
  }
};

const updateDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    const data = req.body;
    if (!data) {
      return res.status(200).json({
        status: "ERR",
        message: "Thông tin cập nhật không có",
      });
    }
    if (!discountId) {
      return res.status(200).json({
        status: "ERR",
        message: "ID của mã giảm giá không có, đây là trường bắt buộc",
      });
    }
    const response = await DiscountService.updateDiscount(discountId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    if (!discountId) {
      return res.status(400).json({
        status: "ERR",
        message: "The discountId is required",
      });
    }

    const response = await DiscountService.deleteDiscount(discountId);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "An error occurred while deleting the discount.",
    });
  }
};

const getDiscountDetails = async (req, res) => {
  try {
    const discountId = req.params.id;
    if (!discountId) {
      return res.status(200).json({
        status: "ERR",
        message: "The discountId is required",
      });
    }
    const response = await DiscountService.getDiscountDetails(discountId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const cartItems = req.body || []; 
    console.log("bé nè2", cartItems)
    // Kiểm tra nếu cartItems không có hoặc không phải mảng
    // if (cartItems && !Array.isArray(cartItems)) {
    //   return res.status(400).json({
    //     status: "ERR",
    //     message: "Giỏ hàng không hợp lệ",
    //   });
    // }

    // Gọi hàm getAllDiscounts và truyền vào cartItems
    const discountsResponse = await DiscountService.getAllDiscounts(cartItems);

    // Kiểm tra nếu có lỗi trong việc lấy thông tin mã giảm giá
    if (discountsResponse.status === "ERR") {
      return res.status(400).json(discountsResponse);
    }

    // Trả về thông tin mã giảm giá
    return res.status(200).json(discountsResponse); 
  } catch (error) {
    console.error("Error in getDiscounts controller:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi hệ thống, không thể lấy thông tin mã giảm giá",
    });
  }
};

module.exports = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountDetails,
  getAllDiscounts,
};
