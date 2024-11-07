const DiscountService = require("../services/Discount.service");

const createDiscount = async (req, res) => {
  try {
    const {
      discount_title,
      discount_type,
      discount_description,
      discount_start_day,
      discount_end_day,
      discount_amount,
      discount_number,
      discount_condition,
    } = req.body;

    if (!discount_title) {
      return res.status(200).json({
        status: "ERR",
        message: "Tên mã giảm giá là bắt buộc",
      });
    }

    if (!discount_type) {
      return res.status(200).json({
        status: "ERR",
        message: "Loại giảm giá là bắt buộc",
      });
    }

    if (!discount_description) {
      return res.status(200).json({
        status: "ERR",
        message: "Thông tin chi tiết về mã giảm giá là bắt buộc",
      });
    }

    if (!discount_start_day) {
      return res.status(200).json({
        status: "ERR",
        message: "Ngày bắt đầu mã giảm giá là bắt buộc",
      });
    }

    if (!discount_end_day) {
      return res.status(200).json({
        status: "ERR",
        message: "Ngày kết thúc mã giảm giá là bắt buộc",
      });
    }

    if (!discount_amount) {
      return res.status(200).json({
        status: "ERR",
        message: "Số lượng mã giảm giá là bắt buộc",
      });
    }

    if (!discount_number) {
      return res.status(200).json({
        status: "ERR",
        message: "Phần trăm giảm giá là bắt buộc",
      });
    }

    if (!discount_condition) {
      return res.status(200).json({
        status: "ERR",
        message: "Điều kiện giảm giá là bắt buộc",
      });
    }

    const newDiscountData = {
      discount_title,
      discount_type,
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

module.exports = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountDetails,
};
